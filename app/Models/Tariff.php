<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Collection;
use function PHPSTORM_META\map;

class Tariff extends Model{
    const TYPE = [
        'membership' => 'تمدید زمان اشتراک',
        'ad_per_day' => 'هزینه روزانه آگهی',
        'ad_is_urgent' => 'آگهی فوری',
        'ad_is_boosted' => 'نردبان کردن آگهی',
        'wallet' => 'افزایش اعتبار',
    ];

    protected $fillable = [
        'type',
        'variety',
        'price',
        'detail',
    ];

    protected function casts(): array{
        return [
            'detail' => 'array',
            'status' => 'boolean',
        ];
    }

    //==================================================| Relations |==================================================\\
    //==================================================| Functions |==================================================\\
    public static function get_membership(): Collection{
        return self::select('id', 'price', 'detail')
        ->where([
            'type' => 'membership',
            'status' => true,
        ])->get();
    }

    public static function get_advertiseTerm(): array{
        $term = [];
        $tariff = self::whereLike('type', 'ad_%')->where('status', true)->get();

        foreach ($tariff as $value){
            $term[$value['type']] = [
                'description' => $value['detail']['description'],
                'price' => $value['price'],
            ];
        }

        return $term;
    }
}
