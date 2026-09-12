<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Company extends Model{

    protected $fillable = [
        'user_id',
        'name',
        'national_id_number',
        'address',
        'phone',
        'description',
        'status',
    ];
    protected function casts(): array {
        return [
            'address' => 'array',
            'status' => 'boolean',
        ];
    }

    //==================================================| Relations |==================================================\\
    public function user(): BelongsTo{
        return $this->belongsTo(User::class);
    }

    //==================================================| Functions |==================================================\\
}
