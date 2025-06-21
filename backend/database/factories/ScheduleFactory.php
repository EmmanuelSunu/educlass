<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Schedule>
 */
class ScheduleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

        $start = fake()->time('H:i');
        $end = \Carbon\Carbon::parse($start)->addMinutes(90)->format('H:i'); // 90-minute session

        return [
            'title' => fake()->randomElement(['Lecture', 'Lab', 'Tutorial']) . ' - ' . fake()->word(),
            'type' => fake()->randomElement(['lecture', 'lab', 'seminar']),
            'course_id' => Course::inRandomOrder()->first()?->id ?? Course::factory(),
            'lecturer_id' => User::where('role', 'teacher')->inRandomOrder()->first()?->id ?? User::factory(),
            'date' => fake()->dateTimeBetween('next Monday', 'next Friday')->format('Y-m-d'),
            'start_time' => $start,
            'end_time' => $end,
            'location' => fake()->randomElement(['Lab A', 'Room 101', 'Auditorium', 'Studio B']),
            'description' => fake()->sentence(),
            'is_recurring' => fake()->boolean(30),
            'frequency' => fake()->optional(0.5)->randomElement(['daily', 'weekly', 'monthly']),
            'end' => fake()->optional(0.5)->dateTimeBetween('+1 week', '+2 months')?->format('Y-m-d'),
        ];

    }
}
