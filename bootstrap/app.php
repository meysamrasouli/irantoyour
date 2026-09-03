<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use App\Http\Middleware\HandleInertiaRequests;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //------------------------------| Sanctum (First-party SPA)
        $middleware->statefulApi();// request api/* should have statefull session (cookie) enabled
        $middleware->authenticateSessions();// authenticateSessions() will redirect to login page if user is not authenticated

        //------------------------------| Inertia
        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            // Always return JSON for api/* routes + any request that expects JSON (like axios calls)
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();
