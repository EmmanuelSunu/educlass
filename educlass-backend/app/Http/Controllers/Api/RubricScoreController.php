<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RubricScore; // Import the RubricScore model
use Illuminate\Support\Facades\Validator; // Import Validator

class RubricScoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rubricScores = RubricScore::all(); // Fetch all rubric scores
        return response()->json($rubricScores); // Return as JSON
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string|unique:rubric_scores,id',
            'submissionAnswerId' => 'required|string|exists:submission_answers,id',
            'rubricCriteriaId' => 'required|string|exists:rubric_criteria,id',
            'score' => 'nullable|integer',
            'feedback' => 'nullable|text',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $rubricScore = RubricScore::create($request->all());

        return response()->json($rubricScore, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $rubricScore = RubricScore::find($id);

        if (!$rubricScore) {
            return response()->json(['message' => 'Rubric Score not found'], 404);
        }

        return response()->json($rubricScore);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $rubricScore = RubricScore::find($id);

        if (!$rubricScore) {
            return response()->json(['message' => 'Rubric Score not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'submissionAnswerId' => 'string|exists:submission_answers,id',
            'rubricCriteriaId' => 'string|exists:rubric_criteria,id',
            'score' => 'nullable|integer',
            'feedback' => 'nullable|text',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $rubricScore->update($request->all());

        return response()->json($rubricScore);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $rubricScore = RubricScore::find($id);

        if (!$rubricScore) {
            return response()->json(['message' => 'Rubric Score not found'], 404);
        }

        $rubricScore->delete();

        return response()->json(['message' => 'Rubric Score deleted successfully']);
    }
}
