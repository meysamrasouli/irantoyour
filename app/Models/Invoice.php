<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Invoice extends Model
{
    const STATUS = [
        'paid' => 'پرداخت شده',
        'refunded' => 'عودت شده',
    ];

    protected $fillable = [
        'user_id',
        'total',
        'respond_bank',
        'status',
    ];

    protected function casts(): array{
        return [
            'respond_bank' => 'array',
        ];
    }

    //==================================================| Relations |==================================================\\
    public function user(): BelongsTo{
        return $this->belongsTo(User::class);
    }

    public function invoiceItems(): HasMany{
        return $this->hasMany(InvoiceOrder::class);
    }

    public function transactions(): MorphMany{
        return $this->morphMany(Transaction::class, 'transactionable');
    }

    //==================================================| Functions |==================================================\\
    //========================================| create invoice
    static function invoiceCreate(int $userId, array $invoiceItems): void{
        $total = array_sum(array_column($invoiceItems, 'price'));

        $invoice = Invoice::create([
            'user_id' => $userId,
            'total' => $total * (1.1), // tax
        ]);

        $invoice->invoiceOrder()->createMany($invoiceItems);
    }
}
