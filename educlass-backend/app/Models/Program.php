<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Program extends Model
{
    /**
     * Get the courses for the program.
     */
    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }

    /**
     * Get the students for the program.
     */
    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }
}
