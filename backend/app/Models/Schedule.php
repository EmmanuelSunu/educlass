<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    /** @use HasFactory<\Database\Factories\ScheduleFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'type',
        'course_id' ,
        'date' ,
        'start_time' ,
        'end_time' ,
        'location' ,
        'description' ,
        'is_recurring' ,
        'frequency' ,
        'end' ,
    ];
}
