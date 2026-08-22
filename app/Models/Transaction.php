<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Transaction extends Model{

    protected $fillable = [
        'transactionable_type',
        'transactionable_id',
        'gateway',
        'amount',
        'ref_id',
        'tracking_code',
        'card_number',
        'result_code',
        'result_message',
        'result_bank_log',
        'ip',
        'status',
    ];

    protected function casts(): array{
        return [
            'result_bank_log' => 'array',
        ];
    }

    //==================================================| Relations |==================================================\\
    public function transactionable(): MorphTo{
        return $this->morphTo();
    }

    //==================================================| Function |==================================================\\
}
