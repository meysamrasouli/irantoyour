<?php

namespace App\Http\Requests\Website;

use App\Models\Register;
use App\Rules\mobile;
use App\Rules\national_code;
use Illuminate\Foundation\Http\FormRequest;
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
            'tariff_id'     => 'required|integer|max:10',
            'mobile'        => ['required', new mobile()],
            'national_code' => ['required', new national_code()],
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

                if($alreadyRegistered){
                    $validator->errors()->add('general', 'کاربری با این مشخصات قبلا ثبت نام کرده است');
                }
            },
        ];


    }
}
