<?php

namespace App\Http\Controllers\Website;

use App\Http\Controllers\Bank\RegisterController as Bank;
use App\Http\Requests\Website\RegisterStoreRequest;
use App\Models\Register;
use App\Models\Tariff;
use Inertia\Inertia;
use Inertia\Response;

class RegisterController extends Controller
{
    public function index(): Response
    {
        return inertia::render('website/register', [
            'list_plan' => Tariff::get_membership(),
            'pageDetail' => [
                'url' => env('APP_URL').'/register',// canonical
                'description' => "",
                'breadcrumb' => [
                    ['name' => env('APP_NAME_FA'), 'url' => env('APP_URL')],
                    ['name' => 'عضویت', 'url' => env('APP_URL').'/register'],
                ],
            ]
        ]);
    }

    public function store(RegisterStoreRequest $request){
        $inputData = $request->validated();

        $register = Register::query()->updateOrCreate([
            'mobile' => $inputData['mobile'],
            'national_code' => $inputData['national_code'],
        ],[
            'tariff_id' => $inputData['membershipPlan'],
            'first_name' => $inputData['first_name'],
            'last_name' => $inputData['last_name'],
        ]);

        return (new Bank())->redirectToBank($register);
    }
}
