<?php

namespace App\Http\Requests\Website;

use App\Http\Controllers\Auth\OtpController;
use App\Models\Register;
use App\Rules\CartItemRule;
use App\Rules\MobileRule;
use App\Rules\NationalCodeRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Validator;

class RegisterStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'otp'           => 'required|string|max:5',
            'cart_item'     => ['required', new CartItemRule()],
            'mobile'        => ['required', new MobileRule()],
            'national_code' => ['required', new NationalCodeRule()],
            'first_name'    => 'required|string|max:50',
            'last_name'     => 'required|string|max:50',
        ];
    }

    public function after(): array
    {
        return [
            function(Validator $validator){
                $alreadyRegistered = Register::query()
                    ->where([
                        'mobile' => $this->input('mobile'),
                        'national_code' => $this->input('national_code'),
                    ])
                    ->whereNotNull('user_id')
                    ->first();

                if($alreadyRegistered)
                    $validator->errors()->add('general', 'کاربری با این مشخصات قبلا ثبت نام کرده است');
            },
            function (Validator $validator) {
                $response = (new OtpController($this->input('otp')))->check($this->input('mobile'));
                if(!empty($response))
                    $validator->errors()->add('general', $response);
            }
        ];
    }
}
