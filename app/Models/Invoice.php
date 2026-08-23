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
        'status',
    ];

    //==================================================| Relations |==================================================\\
    public function user(): BelongsTo{
        return $this->belongsTo(User::class);
    }

    public function invoiceItems(): HasMany{
        return $this->hasMany(InvoiceItem::class);
    }

    public function transactions(): MorphMany{
        return $this->morphMany(Transaction::class, 'transactionable');
    }

    //==================================================| Functions |==================================================\\
    //========================================| create invoice
}
