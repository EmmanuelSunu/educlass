<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
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
            'id' => 'required|integer|exists:users,id',
            'f_name' =>  'required|string',
            'l_name' => 'required|string',
            'other_id' => 'nullable|string',
            'department' => 'nullable|string',
            'level' => 'nullable|string',
            'semester' => 'nullable|string',
            'role' => 'required|string|in:admin,student,teacher',
            'email' => 'required|email|unique:users',
//            'password' => 'required|string|min:6',
        ];
    }
}
