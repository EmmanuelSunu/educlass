<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SubmissionAnswer; // Import the SubmissionAnswer model
use Illuminate\Support\Facades\Validator; // Import Validator

class SubmissionAnswerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $submissionAnswers = SubmissionAnswer::all(); // Fetch all submission answers
        return response()->json($submissionAnswers); // Return as JSON
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string|unique:submission_answers,id',
            'submissionId' => 'required|string|exists:submissions,id',
            'questionId' => 'required|string|exists:questions,id',
            'answer' => 'nullable|text', // For essay and fill-in questions
            'selectedOptionId' => 'nullable|string', // For multi-choice questions
            'score' => 'nullable|integer',
            'feedback' => 'nullable|text',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $submissionAnswer = SubmissionAnswer::create($request->all());

        return response()->json($submissionAnswer, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $submissionAnswer = SubmissionAnswer::find($id);

        if (!$submissionAnswer) {
            return response()->json(['message' => 'Submission Answer not found'], 404);
        }

        return response()->json($submissionAnswer);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $submissionAnswer = SubmissionAnswer::find($id);

        if (!$submissionAnswer) {
            return response()->json(['message' => 'Submission Answer not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'submissionId' => 'string|exists:submissions,id',
            'questionId' => 'string|exists:questions,id',
            'answer' => 'nullable|text',
            'selectedOptionId' => 'nullable|string',
            'score' => 'nullable|integer',
            'feedback' => 'nullable|text',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $submissionAnswer->update($request->all());

        return response()->json($submissionAnswer);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $submissionAnswer = SubmissionAnswer::find($id);

        if (!$submissionAnswer) {
            return response()->json(['message' => 'Submission Answer not found'], 404);
        }

        $submissionAnswer->delete();

        return response()->json(['message' => 'Submission Answer deleted successfully']);
    }
}
