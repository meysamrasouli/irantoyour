<?php
namespace App\Services;

Class GeneralService {
    public static function randomGenerator($length = 5, $type = 'int'): string {
        $characters = match ($type) {
            'int'    => '0123456789',
            'string' => 'abcdefghijklmnopqrstuvwxyz',
            "mix"    => '0123456789abcdefghijklmnopqrstuvwxyz',
            default  => '0123456789',
        };
        return substr(str_shuffle(str_repeat($characters, 5)), 0, $length);
    }

    public static function formatCoordination($coordination): string{
        return number_format($coordination, 5, '.', '');
    }
}


