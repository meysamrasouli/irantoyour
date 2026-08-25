<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class CartItemRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_array($value)) {
            $fail('فرمت سبد خرید نامعتبر است.');
            return;
        }

        $requiredFields = ['type', 'variety', 'price'];
        foreach ($requiredFields as $field) {
            if (!array_key_exists($field, $value)) {
                $fieldNames = [
                    'type' => 'نوع اشتراک',
                    'variety' => 'نوع پلن',
                    'price' => 'قیمت'
                ];
                $fail("فیلد {$fieldNames[$field]} در سبد خرید الزامی است.");
                return;
            }
        }

        // type
        if (empty($value['type']) || !is_string($value['type'])) {
            $fail('نوع اشتراک باید یک رشته معتبر باشد.');
            return;
        }
        // variety
        if (empty($value['variety']) || !is_string($value['variety'])) {
            $fail('نوع پلن باید یک رشته معتبر باشد.');
            return;
        }
        if (strlen($value['variety']) > 50) {
            $fail('نوع پلن نباید بیشتر از 50 کاراکتر باشد.');
            return;
        }
        // price
        if (empty($value['price']) || !is_numeric($value['price'])) {
            $fail('قیمت باید یک عدد باشد.');
            return;
        }
        if ($value['price'] < 0 || $value['price'] > 999999999) {
            $fail('قیمت وارد شده صحیح نیست');
            return;
        }
    }
}
