<?php

namespace App\Http\Controllers\Website;

use inertia\Inertia;
use Inertia\Response;

class WebsiteController extends Controller
{
    public function index(): Response
    {
        return inertia::render('website/index', [
            'pageDetail' => [
                'url' => env('APP_URL'),// canonical
                'description' => "",
                'breadcrumb' => [
                    ['name' => env('APP_NAME_FA'), 'url' => env('APP_URL')]
                ],
            ]
        ]);
    }

    public function about(): Response
    {
        return inertia::render('website/about', [
            'pageDetail' => [
                'url' => env('APP_URL').'/about',// canonical
                'description' => "",
                'breadcrumb' => [
                    ['name' => env('APP_NAME_FA'), 'url' => env('APP_URL')]
                ],
            ]
        ]);
    }

    public function terms(): Response
    {
        return inertia::render('website/terms', [
            'pageDetail' => [
                'url' => env('APP_URL').'/terms',// canonical
                'description' => "",
                'breadcrumb' => [
                    ['name' => env('APP_NAME_FA'), 'url' => env('APP_URL')]
                ],
            ]
        ]);
    }

    public function contact(): Response
    {
        return inertia::render('website/contact', [
            'pageDetail' => [
                'url' => env('APP_URL').'contact',// canonical
                'description' => "",
                'breadcrumb' => [
                    ['name' => env('APP_NAME_FA'), 'url' => env('APP_URL')]
                ],
            ]
        ]);
    }
}
