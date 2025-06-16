<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Program;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        // Seed base entities
        Program::factory(10)->create();
        User::factory(20)->create();
        Course::factory(30)->create();

        // Assign relationships
        // Attach teachers to courses
        $teachers = User::where('role', 'teacher')->get();
        Course::all()->each(function ($course) use ($teachers) {
            $course->teachers()->attach(
                $teachers->random(min(3, $teachers->count()))->pluck('id')->toArray()
            );

        });


        // Attach students to programs
        $students = User::where('role', 'student')->get();
        Program::all()->each(function ($program) use ($students) {
            $program->students()->attach(
                $students->random(min(10, $students->count()))->pluck('id')->toArray()
            );
        });


    }
}
