<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Exam>
 */
class ExamFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'lecturer_id' => User::where('role', 'teacher')->inRandomOrder()->first()?->id ?? User::factory(),
            'course_id' => Course::inRandomOrder()->first()?->id ?? Course::factory(),
            'type' => fake()->randomElement(['exam', 'assignment']),
            'due_date' => fake()->date(),
            'start_time' => fake()->time('H:i'),
            'end_time' => fake()->time('H:i'),
            'duration' => fake()->time('H:i'),
            'description' => fake()->sentence(),
        ];

    }
}
