<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

class Cart extends Model{

    /**
     * detail = [
     *      ["type"=>"membership", "variety"=>"one-month"]
     *      ["type"=>"wallet", "variety"=>"large"], OR ["type"=>"wallet", "variety"=>"custom", "price"=>200000]
     * ]
    */
    protected $fillable = [
        'user_id',
        'detail',// [["type"=>"","variety"=>""],[...]]
        'lock_status',
    ];
    protected function casts(): array {
        return [
            'detail' => 'array',
            'lock_status'  => 'boolean',
        ];
    }

    //==================================================| Relations |==================================================\\

    public function user(): BelongsTo{
        return $this->belongsTo(User::class);
    }

    //==================================================| Functions |==================================================\\
    public static function addItem(array $item): void{
        $cart = self::query()
            ->where('user_id', Auth::guard('web')->id())
            ->whereNull('lock_status')
            ->first();

        if($cart){
            $cart->update([
                'detail' => array_merge($cart['detail'], $item)
            ]);
        }else{
            Cart::create([
                'user_id' => Auth::guard('web')->id(),
                'detail' => $item,
            ]);
        }
    }

    public static function prepareCartToInvoice(Cart $cart): array{
        $items = [];

        foreach ($cart['detail'] as $item){
            switch ($item['type']){
                //------------------------------| membership
                case 'membership':
                    $tariff = Tariff::where([
                        'type' => $item['type'],
                        'variety' => $item['variety'],
                        'status' => true,
                    ])->first();

                    if(!is_null($tariff))
                        $items[] = [
                            'type' => $item['type'],
                            'variety' => $item['variety'],
                            'price' => $tariff['price']
                        ];
                    break;
                //------------------------------| wallet
                case 'wallet':
                    if($item['variety'] === 'custom'){
                        $items[] = [
                            'type' => $item['type'],
                            'variety' => $item['variety'],
                            'price' => $item['price']
                        ];
                    }else{
                        $tariff = Tariff::where([
                            'type' => $item['type'],
                            'variety' => $item['variety'],
                            'status' => true,
                        ])->first();

                        if(!is_null($tariff))
                            $items[] = [
                                'type' => $item['type'],
                                'variety' => $item['variety'],
                                'price' => $tariff['price']
                            ];
                    }
                    break;
                //------------------------------|
            }
        }

        return $items;
    }

    public static function totalPrice(Cart $cart): int{
        $price = 0;
        $tariffsQuery = [];

        foreach ($cart['detail'] as $item){
            switch ($item['type']){
                case 'membership':
                    $tariffsQuery[] = ['type' => $item['type'], 'variety' => $item['variety']];
                    break;
                case 'wallet':
                    if($item['variety'] === 'custom'){
                        $price += $item['price'];// custom amount
                    }else{
                        $tariffsQuery[] = ['type' => $item['type'], 'variety' => $item['variety']];
                    }
                    break;
            }
        }

        $price += Tariff::where(function ($query) use ($tariffsQuery) {
            foreach ($tariffsQuery as $condition)
                $query->orWhere($condition);
        })->sum('price');

        return $price;
    }
}
