<?php
namespace App\Services;

Class ConverterService {
    public static function convertNumberFAtoEN($data): array|string {
        $numbers = range(0, 9);
        //-----------------------------
        // 1. Persian HTML decimal
        $persianDecimal = ['&#1776;', '&#1777;', '&#1778;', '&#1779;', '&#1780;', '&#1781;', '&#1782;', '&#1783;', '&#1784;', '&#1785;'];
        // 2. Arabic HTML decimal
        $arabicDecimal = ['&#1632;', '&#1633;', '&#1634;', '&#1635;', '&#1636;', '&#1637;', '&#1638;', '&#1639;', '&#1640;', '&#1641;'];
        // 3. Arabic Numeric
        $arabic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        // 4. Persian Numeric
        $persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        //-----------------------------
        $data =  str_replace($persianDecimal, $numbers, $data);
        $data =  str_replace($arabicDecimal, $numbers, $data);
        $data =  str_replace($arabic, $numbers, $data);
        return str_replace($persian, $numbers, $data);
    }

    public function convertStringFA($data): array|string {
        $string = ['ب','د','ذ','ز','س','ش','ک','ی','ی'];
        //-----------------------------
        // 1. Arabic HTML decimal
        $arabicString = ['بِ','دِ','ذِ','زِ','سِ','شِ','ك','ى','ي'];

        //-----------------------------
        return str_replace($arabicString, $string, $data);
    }

    public function convertEmptyArrayToNull($param) {
        if(gettype($param) === 'string' && $param === "[]") return null;
        if(gettype($param) === 'array' && empty($param)) return null;
        return $param;
    }

}


