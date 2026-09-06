<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class Personnel extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    protected string $guard = 'personnel';
    protected $table = 'personnel';
    protected $fillable = [
        'mobile',
        'first_name',
        'last_name',
        'national_code',
        'birthdate',
        'status',
    ];

    protected function casts(): array{
        return [
            'status' => 'boolean',
        ];
    }

    //==================================================| Relations |==================================================\\

    //==================================================| Functions |==================================================\\
}
