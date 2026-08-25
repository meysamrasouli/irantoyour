<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

class Cart extends Model{

    /**
     * detail = [
     *      ["type"=>"membership", "variety"=>"one-month", "price"=>"1000"],
     *      ["type"=>"wallet", "variety"=>"large"],
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
    private static function _findCurrentCart(): ?self{
        return self::query()
            ->where('user_id', Auth::guard('web')->id())
            ->whereNull('lock_status')
            ->first();
    }

    /**
     * @param array $item - ["type"=>"", "variety"=>"", "price"=>""]
     * @return array
    */
    public static function addItem(array $item): array{
        $cart = self::_findCurrentCart();
        $detail = $cart ? $cart->detail : [];
        $isItemExist = false;

        // only custom varieties are not in tariff tables
        $isCustom = $item['type'] === 'wallet' && $item['variety'] === 'custom';

        foreach ($detail as $key => $value) {
            if ($value['type'] === $item['type'] && $value['variety'] === $item['variety']) {
                $isItemExist = true;

                if ($isCustom) {
                    $detail[$key]['price'] = $item['price'];// update cart item(custom) price
                }else{
                    return $detail;// this item is already exist
                }
            }
        }

        if(!$isItemExist)
            $detail[] = $item;// this is a new item

        if($cart){
            $cart->update([
                'detail' => $detail
            ]);
        }else{
            Cart::create([
                'user_id' => Auth::guard('web')->id(),
                'detail' => [$detail],
            ]);
        }

        return $detail;
    }

    public static function removeItem(int $index): array{
        $cart = self::_findCurrentCart();
        $detail = $cart ? $cart->detail : [];

        if(!$cart || !array_key_exists($index, $detail)) return $detail;

        unset($detail[$index]);

        // rearrange the item index
        $cart->update(['detail' => array_values($detail)]);

        return $detail;
    }


    public static function updateCartItemPrice(Cart $cart): array{
        $cartItems = [];
        $tariffsQuery = [];

        foreach ($cart['detail'] as $key => $item) {
            if ($item['type'] === 'wallet' && $item['variety'] === 'custom') {
                $cartItems[] = [
                    'type' => $item['type'],
                    'variety' => $item['variety'],
                    'price' => $item['price']
                ];
            } else {
                $tariffsQuery[] = [
                    'type' => $item['type'],
                    'variety' => $item['variety'],
                ];
            }
        }

        // nothing to search in tariff table
        if(empty($tariffsQuery))
            return $cartItems;

        // search the tariff table
        $tariffs = Tariff::where('status', true)
            ->where(function ($query) use ($tariffsQuery) {
                foreach ($tariffsQuery as $condition)
                    $query->orWhere($condition);
            })
            ->get()
            ->keyBy(fn ($tariff) => $tariff->type . ':' . $tariff->variety);

        // match the cart item and add price
        foreach ($cart['detail'] as $item) {
            $key = $item['type'] . ':' . $item['variety'];

            if ($tariffs->has($key)) {
                $tariff = $tariffs->get($key);
                $cartItems[] = [
                    'type' => $item['type'],
                    'variety' => $item['variety'],
                    'price' => $tariff->price
                ];
            }
        }

        return $cartItems;
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
