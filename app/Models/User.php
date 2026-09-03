<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasFactory, HasRoles;

    protected $fillable = [
        'mobile',
        'first_name',
        'last_name',
        'national_code',
        'email',
        'balance',
        'sign_in_from',
        'membership_expires_at',
        'status',
    ];

    protected function casts(): array{
        return [
            'status' => 'boolean',
        ];
    }

    //==================================================| Relations |==================================================\\
//    public function memberships(): HasMany{
//        return $this->hasMany(Membership::class);
//    }
//    public function membershipActive(): HasOne{
//        return $this->hasOne(Membership::class)->where('status', true);
//    }
//    public function cart(): HasOne{
//        return $this->hasOne(Cart::class);
//    }
//    public function wallets(): HasMany{
//        return $this->hasMany(Wallet::class);
//    }
//    public function company(): HasOne{
//        return $this->hasOne(Company::class);
//    }
//    public function units(): HasMany{
//        return $this->hasMany(Unit::class);
//    }
    //==================================================| Functions |==================================================\\
    //========================================| create new user
    /**
     * @param array $data (user details)
     * @param string $membershipDuration (days)
     * @param string $sign_in_from (the first time user login from)
     * @param array $roles (roles other than 'user')
     * @return User
     */
    public static function createNewUser(array $data, int $membershipDuration, string $sign_in_from, array $roles = []): User{
        $user = self::create(array_merge($data, [
            'sign_in_from' => $sign_in_from,
            'membership_expires_at' => Carbon::now()->addDays($membershipDuration)->toDateString()
        ]));

        //------------------------------| role
        if(!empty($roles)){
            if(!in_array("user", $roles)) $roles[] = 'user';// add 'user' role if it's not exist
            $user->assignRole($roles);// additional roles
        }else{
            $user->assignRole('user');// add 'user' role for every user
        }

        return $user;
    }

    //========================================| user full name

    /**
     * @param string $firstName
     * @param string $lastName
     * @return string
     */
    public static function getFullName(string $firstName = "", string $lastName = ""): string{
        $firstName = $firstName ?? "";
        $lastName = $lastName ?? "";

        if(!empty($firstName) && !empty($lastName))
            return $firstName . ' ' . $lastName;

        if(!empty($firstName)) return $firstName;
        if(!empty($lastName)) return $lastName;

        return "-";
    }
}
