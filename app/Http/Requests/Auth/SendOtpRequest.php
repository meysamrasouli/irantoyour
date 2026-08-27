<?php

namespace App\Http\Requests\Auth;

use App\Rules\MobileRule;
use App\Services\ConverterService;
use Illuminate\Foundation\Http\FormRequest;

class SendOtpRequest extends FormRequest
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
            'mobile' => ['required', new MobileRule()],
        ];
    }

    protected function passedValidation(): void{
        $data = $this->validator->getData();

        $this->validator->setData([
            'mobile' => ConverterService::convertNumberFAtoEN($data['mobile']),
        ]);
    }
}
