<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class national_code implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if(!$this->_customValidation($value)){
            // $fail(':attribute is not a national_code.');
            $fail('validation.national_code')->translate();// lang/en/validation.national_code
        }
    }

    private function _customValidation($value): bool {
        $value = (string) $value;
        if (!preg_match("/^\d{10}$/", $value)) return false;
        $check = (int) $value[9];
        $sum = array_sum(array_map(function ($x) use ($value) {
                return ((int) $value[$x]) * (10 - $x);
            }, range(0, 8))) % 11;

        return $sum < 2 ? $check == $sum : $check + $sum == 11;
    }
}
