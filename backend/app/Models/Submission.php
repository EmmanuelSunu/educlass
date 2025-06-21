<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    /** @use HasFactory<\Database\Factories\SubmissionFactory> */
    use HasFactory;
    protected $fillable = [
        'exam_id',
        'question_id',
        'student_id',
        'answer',
    ];

    // Submission.php
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id')->where('role', 'student');
    }

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function question()
    {
        return $this->belongsTo(Question::class); // Optional, if storing per-question answers
    }
}
