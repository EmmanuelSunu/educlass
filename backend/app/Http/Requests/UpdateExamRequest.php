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
            'lecturer_id' => 'required|integer',
            'course_id'=>'required|integer',
            'type'=>'required|string',
            'due_date'=>'required|date',
            'start_time'=>'required|string',
            'end_time'=>'required|string',
            'duration'=>'required|string',
            'description'=> 'required|string',
        ];
    }
}
