<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreExamRequest extends FormRequest
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
            'lecturer_id' => 'required|integer',
            'course_id'=>'required|integer',
            'type'=>'required|string|in:exam,assignment',
            'due_date'=>'required|string',
            'start_time'=>'required|string',
            'end_time'=>'required|string',
            'duration'=>'required|string',
            'description'=> 'required|string',

            'questions' => 'required|array|min:1',
            'questions.*.type' => 'required|string',
            'questions.*.point' => 'required|numeric|min:0',
            'questions.*.question' => 'required|string',
            'questions.*.answer' => 'required|string',
            'questions.*.other' => 'nullable|string',

        ];
    }
}
