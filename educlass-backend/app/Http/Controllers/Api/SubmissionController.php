<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Submission; // Import the Submission model
use Illuminate\Support\Facades\Validator; // Import Validator

class SubmissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $submissions = Submission::all(); // Fetch all submissions
        return response()->json($submissions); // Return as JSON
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string|unique:submissions,id',
            'examId' => 'required|integer|exists:exams,id',
            'studentId' => 'required|string|exists:students,id',
            'startTime' => 'nullable|date',
            'endTime' => 'nullable|date|after_or_equal:startTime',
            'status' => 'required|in:submitted',
            'totalScore' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $submission = Submission::create($request->all());

        return response()->json($submission, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $submission = Submission::find($id);

        if (!$submission) {
            return response()->json(['message' => 'Submission not found'], 404);
        }

        return response()->json($submission);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $submission = Submission::find($id);

        if (!$submission) {
            return response()->json(['message' => 'Submission not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'examId' => 'integer|exists:exams,id',
            'studentId' => 'string|exists:students,id',
            'startTime' => 'nullable|date',
            'endTime' => 'nullable|date|after_or_equal:startTime',
            'status' => 'in:submitted',
            'totalScore' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $submission->update($request->all());

        return response()->json($submission);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $submission = Submission::find($id);

        if (!$submission) {
            return response()->json(['message' => 'Submission not found'], 404);
        }

        $submission->delete();

        return response()->json(['message' => 'Submission deleted successfully']);
    }
}
