<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    /** @use HasFactory<\Database\Factories\CourseFactory> */
    use HasFactory;

    protected $fillable = [
        'level',
        'code',
        'name',
        'description',
        'credits',
        'duration',
        'status',
        'program_id',
    ];

    // Course.php
    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    public function teachers()
    {
        return $this->belongsToMany(User::class, 'course_teacher', 'course_id', 'teacher_id')
            ->where('role', 'teacher');
    }
}
