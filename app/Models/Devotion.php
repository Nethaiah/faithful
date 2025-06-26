<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Devotion extends Model
{
    /** @use HasFactory<\Database\Factories\DevotionFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'mood',
        'verse',
        'verse_content',
        'title',
        'devotion',
        'is_private',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
