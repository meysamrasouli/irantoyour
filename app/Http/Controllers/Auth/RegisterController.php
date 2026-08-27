<?php

namespace App\Http\Controllers\Auth;

use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Validation\ValidationException;

class RegisterController extends AuthController
{
    /**
     * validate user mobile
     * @param LoginRequest $request
     * @return string
     * @throws ValidationException
     */
    public function checkOtp(LoginRequest $request): string{
        $inputData = $request->validated();

        $response = (new OtpController($inputData['mobile']))->check($inputData['otp']);
        if(!empty($response))
            throw ValidationException::withMessages(['error' => $response]);

        return '';
    }
}
