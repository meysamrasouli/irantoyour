<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class PostalCodeRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if(!preg_match("/^[0-9]{10}$/",$value)){
            // $fail(':attribute is not a postal code.');
            $fail('validation.postal_code')->translate();// lang/en/validation.postal_code
        }
    }
}
