<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function rootView(Request $request): string{
        if (str_contains($request->path(), 'dashboard'))
            return 'dashboard';
        if (str_contains($request->path(), 'profile'))
            return 'profile';
        return 'website';
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $global_variables = [
            'auth' => null,
            'flush' => [
                'notification' => fn () => $request->session()->get('notification'),
            ],
        ];

        //==================================================| Website - Profile
        if(Auth::guard('web')->check()){
            $global_variables['auth']['user'] = [
                'mobile'=> Auth::guard('web')->user()->mobile,
                'first_name'=> Auth::guard('web')->user()->first_name,
                'last_name'=> Auth::guard('web')->user()->last_name,
                'balance'=> Auth::guard('web')->user()->balance,
            ];

            //------------------------------| Website
            //------------------------------| Profile
            //if(str_contains($request->path(), 'profile')){}
        }

        //==================================================| All Dashboards
        if((Auth::guard('personnel')->check())){
            $global_variables['auth']['personnel'] = [
                'mobile'=> Auth::guard('personnel')->user()->mobile,
                'first_name'=> Auth::guard('personnel')->user()->first_name,
                'last_name'=> Auth::guard('personnel')->user()->last_name,
                'roles'=> Auth::guard('personnel')->user()->getRoleNames(),
            ];
        }

        return array_merge(parent::share($request), $global_variables);
    }
}
