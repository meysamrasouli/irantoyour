<?php

namespace App\Http\Controllers\Profile;

use App\Services\Redis\RedisIndexService;
use App\Services\Redis\RedisRepopulateService;
use inertia\Inertia;
use inertia\Response;

class ProfileController extends Controller
{
    public function index(): Response{
        //RedisRepopulateService::repopulate();

        return inertia::render('profile/index', [
            'list_widget' => [],
        ]);
    }
}
