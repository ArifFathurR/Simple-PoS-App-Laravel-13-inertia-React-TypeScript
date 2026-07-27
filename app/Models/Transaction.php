<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(
    'invoice_number',
    'user_id',
    'total_amount',
    'pay_amount',
    'change_amount',
    'payment_method',
    'notes'
)]
class Transaction extends Model
{
    protected function casts(): array
    {
        return [
            'total_amount' => 'decimal:2',
            'pay_amount' => 'decimal:2',
            'change_amount' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function details(): HasMany
    {
        return $this->hasMany(TransactionDetail::class);
    }
}
