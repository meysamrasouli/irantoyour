<?php

namespace App\Http\Controllers\Auth;

use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use App\Services\ConverterService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class UserController extends AuthController
{
    /**
     * login page
     * @param Request $request
     * @return \Inertia\Response
     */
    function index(Request $request){
        // check for intended url
        $this->intendedUrl($request);

        return inertia::render('auth/login');
    }

    /**
     * login user
     * @param LoginRequest $request
     * @return JsonResponse
     * @throws ValidationException
     */
    function login(LoginRequest $request): JsonResponse{
        $inputData = $request->validated();

        //------------------------------| check otp
        $response = (new OtpController($inputData['mobile']))->check($inputData['otp']);
        if(!empty($response))
            throw ValidationException::withMessages(['error' => $response]);

        //------------------------------| check for existing user
        $user = User::where('mobile', $inputData['mobile'])->first();
        if(empty($user))
            throw ValidationException::withMessages(['error' => 'کاربر نامعتبر']);

        //------------------------------| session based login (First-party SPA)
        Auth::guard('web')->login($user);

        //------------------------------| check intended url
        $intendedUrl = $request->session()->pull('intendedUrl');
        $intendedUrl = $intendedUrl ?: '/profile';

        return response()->json([
            'intended' => $intendedUrl,
        ]);
    }
}
