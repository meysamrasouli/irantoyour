<?php

namespace App\Http\Controllers\Website;

use App\Models\Tariff;
use inertia\Inertia;
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

        //return (new RegisterBankController())->redirectToBank($invoice);
    }
}
