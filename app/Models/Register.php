<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Register extends Model {
    protected $fillable = [
        'user_id',
        'tariff_id',
        'mobile',
        'first_name',
        'last_name',
        'national_code',
    ];

    //==================================================| Relations |==================================================\\
    public function user(): BelongsTo{
        return $this->BelongsTo(User::class);
    }

    public function tariff(): BelongsTo{
        return $this->BelongsTo(Tariff::class);
    }

    public function latestTransaction(): morphOne{
        return $this->morphOne(Transaction::class, 'transactionable')->latest();
    }
}


