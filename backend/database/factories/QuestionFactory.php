<?php

namespace Database\Factories;

use App\Models\Exam;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Question>
 */
class QuestionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'exam_id' => Exam::inRandomOrder()->first()?->id ?? Exam::factory(),
            'type' => fake()->randomElement(['essay', 'choice', 'blank']),
            'point' => fake()->numberBetween(1, 10),
            'question' => fake()->sentence(),
            'answer' => fake()->sentence(),
            'other' => fake()->optional()->sentence(),
        ];

    }
}
