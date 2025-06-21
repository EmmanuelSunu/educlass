<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateExamRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'id' => 'required|integer|exists:exams,id',
            'type' => 'required|string',
            'due_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'duration' => 'required|string',

            'description' => 'nullable|string',
            'questions' => 'required|array|min:1',
            'questions.*.type' => 'required|string',
            'questions.*.point' => 'required|numeric|min:0',
            'questions.*.question' => 'required|string',
            'questions.*.answer' => 'required|string',
            'questions.*.other' => 'nullable|string',

        ];
    }
}
