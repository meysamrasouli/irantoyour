<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class mobile implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if(!preg_match("/^09[0-9]{9}$/",$value)){
            // $fail(':attribute is not a mobile number.');
            $fail('validation.mobile')->translate();// lang/en/validation.mobile
        }
    }
}
