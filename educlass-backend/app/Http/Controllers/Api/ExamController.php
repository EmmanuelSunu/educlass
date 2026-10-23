<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Exam; // Import the Exam model
use Illuminate\Support\Facades\Validator; // Import Validator

class ExamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $exams = Exam::all(); // Fetch all exams
        return response()->json($exams); // Return as JSON
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'type' => 'required|in:exam,assignment',
            'description' => 'nullable|text',
            'classId' => 'nullable|string|exists:courses,id', // Assuming classId refers to course id
            'className' => 'nullable|string|max:255',
            'dueDate' => 'nullable|date',
            'startTime' => 'nullable|date_format:H:i',
            'endTime' => 'nullable|date_format:H:i|after:startTime',
            'durationHours' => 'nullable|integer',
            'durationMinutes' => 'nullable|integer',
            'duration' => 'nullable|string|max:255',
            'status' => 'required|in:upcoming,ongoing,completed',
            'totalPoints' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $exam = Exam::create($request->all());

        return response()->json($exam, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $exam = Exam::find($id);

        if (!$exam) {
            return response()->json(['message' => 'Exam not found'], 404);
        }

        return response()->json($exam);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $exam = Exam::find($id);

        if (!$exam) {
            return response()->json(['message' => 'Exam not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'string|max:255',
            'type' => 'in:exam,assignment',
            'description' => 'nullable|text',
            'classId' => 'nullable|string|exists:courses,id', // Assuming classId refers to course id
            'className' => 'nullable|string|max:255',
            'dueDate' => 'nullable|date',
            'startTime' => 'nullable|date_format:H:i',
            'endTime' => 'nullable|date_format:H:i|after:startTime',
            'durationHours' => 'nullable|integer',
            'durationMinutes' => 'nullable|integer',
            'duration' => 'nullable|string|max:255',
            'status' => 'in:upcoming,ongoing,completed',
            'totalPoints' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $exam->update($request->all());

        return response()->json($exam);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $exam = Exam::find($id);

        if (!$exam) {
            return response()->json(['message' => 'Exam not found'], 404);
        }

        $exam->delete();

        return response()->json(['message' => 'Exam deleted successfully']);
    }
}
