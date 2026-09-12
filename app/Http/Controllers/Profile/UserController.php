<?php

namespace App\Http\Controllers\Profile;

use App\Http\Requests\Profile\UserUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * @return Response
     */
    public function edit(): Response{
        $user = Auth::guard('web')->user();

        return Inertia::render('profile/user/edit', [
            'user' => [
                'mobile' => $user->mobile,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'national_code' => $user->national_code,
                'email' => $user->email,
            ],
        ]);
    }

    /**
     * @param UserUpdateRequest $request
     * @return RedirectResponse
     */
    public function update(UserUpdateRequest $request): RedirectResponse{
        Auth::guard('web')->user()->update($request->validated());

        return redirect('/profile/user')->with('notification', [
            'mode'=> 'success', 'text'=> 'اطلاعات با موفقیت ویرایش شد'
        ]);
    }
}
