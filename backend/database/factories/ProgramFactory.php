<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Program>
 */
class ProgramFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $programs = [
            'Computer Science' => 'Focuses on algorithms, software development, and systems design.',
            'Business Administration' => 'Covers management, finance, and organizational behavior.',
            'Mechanical Engineering' => 'Deals with design and manufacturing of mechanical systems.',
            'Psychology' => 'Explores human behavior, cognition, and mental health.',
            'Agricultural Science' => 'Studies crop production, soil science, and sustainable farming.',
            'Education' => 'Prepares students for teaching and educational leadership roles.',
            'Nursing' => 'Trains students in patient care, anatomy, and clinical practice.',
            'Environmental Studies' => 'Examines ecological systems and sustainability practices.',
        ];

        $program = fake()->randomElement(array_keys($programs));

        return [
            'name' => $program,
            'description' => $programs[$program],
            'duration' => fake()->randomElement(['1', '2', '3', '4']),
        ];

    }
}
