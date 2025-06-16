<?php

namespace Database\Factories;

use App\Models\Program;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Course>
 */
class CourseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'program_id' => Program::inRandomOrder()->first()?->id ?? Program::factory(), // Safe fallback
            'level' => rand(1, 4),
            'code' => 'COU_' . fake()->unique()->numberBetween(100000, 999999),
            'name' => fake()->words(3, true),
            'description' => fake()->paragraph,
            'credits' => fake()->numberBetween(1, 6),
            'duration' => fake()->randomElement(['1 semester', '2 semesters', '3 months', '6 months']),
            'status' => fake()->randomElement(['active', 'inactive', 'archived']),
        ];

    }
}
