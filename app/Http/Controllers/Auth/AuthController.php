<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\SendOtpRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    /**
     * send OTP
     * @param SendOtpRequest $request
     * @return string
     */
    public function sendOTP(SendOtpRequest $request): string{
        $inputData = $request->validated();

        $response = (new OtpController($inputData['mobile']))->sendSMS();

        return ($response !== true) ? $response : "";// return remaining time
    }

    /**
     * store intended url in session for redirecting after login
     * @param Request $request
     * @return void
     */
    protected function intendedUrl(Request $request): void{
        $intendedUrl = Redirect::intended()->getTargetUrl();// it must be store immediately

        if(($intendedUrl && ($intendedUrl !== Config('app.url'))))
            $request->session()->put('intendedUrl', $intendedUrl);
    }

    /**
     * logout
     * @param Request $request
     * @return Response
     */
    function logout(Request $request){
        Auth::user()->tokens()->delete();// sanctum - api
        Auth::logout();

        $request->session()->invalidate();

        return Inertia::location('/');
    }

}
