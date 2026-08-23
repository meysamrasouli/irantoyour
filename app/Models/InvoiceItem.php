<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvoiceItem extends Model
{
    protected $fillable = [
        'invoice_id',
        'type',
        'variety',
        'price',
    ];

    //==================================================| Relations |==================================================\\
    public function invoice(): BelongsTo{
        return $this->belongsTo(Invoice::class);
    }

    //==================================================| Functions |==================================================\\
    public static function showInvoiceItems(array $invoiceItems): array{
        $detail = [];

        foreach ($invoiceItems as $value){
            switch ($value['type']){
                case 'membership':
                    $shop = Tariff::where([
                        'type' => $value['type'],
                        'variety' => $value['variety'],
                    ])->first();

                    $detail[] = [
                        'title' => 'تمدید اشتراک',
                        'detail' => $shop['detail']['description'] . ' ',
                        'price' => $value['price'],
                    ];
                    break;

                case 'wallet':
                    $detail[] = [
                        'title' => 'افزایش اعتبار',
                        'detail' => 'شارژ کیف پول به مبلغ '.number_format($value['price']).' تومان',
                        'price' => $value['price'],
                    ];
                    break;
            }
        }

        return $detail;
    }
}


