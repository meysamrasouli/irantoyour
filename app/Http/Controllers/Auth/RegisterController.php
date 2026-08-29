<?php

namespace App\Http\Controllers\Auth;

use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class RegisterController extends AuthController
{
    /**
     * validate user mobile
     * @param LoginRequest $request
     * @return JsonResponse
     * @throws ValidationException
     */
    public function checkOtp(LoginRequest $request): JsonResponse{
        $inputData = $request->validated();

        $response = (new OtpController($inputData['mobile']))->check($inputData['otp']);

        if(!empty($response))
            return response()->json(['error' => $response]);

        return response()->json(['error' => '']);
    }
}
