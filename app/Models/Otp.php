<?php

namespace App\Models;

use App\Services\GeneralService;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Notifications\Notifiable;

class Otp extends Model{
    use Notifiable;

    protected $fillable = [
        'mobile',
        'ip',
        'code',
        'attempt',
        'sent_count',
        'login_count',
    ];

    //==================================================| Relations |==================================================\\
    public function user(): HasOne{
        return $this->hasOne(User::class,'mobile','mobile');
    }

    //==================================================| Functions |==================================================\\

}
