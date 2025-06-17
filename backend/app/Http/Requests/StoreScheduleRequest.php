<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreScheduleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string',
            'type' => 'required|string',
            'course_id' => 'required|string',
            'date' => 'required|string',
            'start_time' => 'required|string',
            'end_time' => 'required|string',
            'location' => 'required|string',
            'description' => 'required|string',
            'is_recurring' => 'required|string',
            'frequency' => 'required|string',
            'end' => 'required|string',
        ];
    }
}
