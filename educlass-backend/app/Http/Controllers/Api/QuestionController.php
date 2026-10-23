<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Question; // Import the Question model
use Illuminate\Support\Facades\Validator; // Import Validator

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $questions = Question::all(); // Fetch all questions
        return response()->json($questions); // Return as JSON
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string|unique:questions,id',
            'examId' => 'required|integer|exists:exams,id',
            'type' => 'required|in:essay,multi-choice,fill-ins',
            'questionText' => 'required|text',
            'points' => 'nullable|integer',
            'modelAnswer' => 'nullable|text', // For essay questions
            'correctAnswer' => 'nullable|text', // For fill-in questions
            'correctAnswerId' => 'nullable|string', // For multi-choice questions (ID of the correct option)
            // Add validation for options if needed, depending on how they are sent
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $question = Question::create($request->all());

        return response()->json($question, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $question = Question::find($id);

        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }

        return response()->json($question);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $question = Question::find($id);

        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'examId' => 'integer|exists:exams,id',
            'type' => 'in:essay,multi-choice,fill-ins',
            'questionText' => 'text',
            'points' => 'nullable|integer',
            'modelAnswer' => 'nullable|text',
            'correctAnswer' => 'nullable|text',
            'correctAnswerId' => 'nullable|string',
            // Add validation for options if needed
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $question->update($request->all());

        return response()->json($question);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $question = Question::find($id);

        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }

        $question->delete();

        return response()->json(['message' => 'Question deleted successfully']);
    }
}
