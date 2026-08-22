<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

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
    public static function invoiceItemMaker(array $cartDetail): array{
        $order = [];

        foreach ($cartDetail as $key => $value){
            switch ($key){
                case 'membership':
                    $tariffItem = Tariff::where([
                        'type' => $key,
                        'variety' => $value,
                        'status' => true,
                    ])->first();

                    if(!is_null($tariffItem))
                        $order[] = [
                            'type' => $tariffItem['type'],
                            'variety' => $tariffItem['variety'],
                            'price' => $tariffItem['price'],
                        ];
                    break;
                case 'wallet':
                    $tariffItem = Tariff::where([
                        'type' => $key,
                        'price' => $value,
                        'status' => true,
                    ])->first();

                    $order[] = [
                        'type' => $key,
                        'variety' => (!is_null($tariffItem)) ? $tariffItem->variety : null,// user entered custom amount
                        'price' => $value,
                    ];
                    break;
            }
        }

        return $order;
    }

    public static function showInvoiceItems(array $invoiceOrder): array{
        $detail = [];

        foreach ($invoiceOrder as $value){
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


