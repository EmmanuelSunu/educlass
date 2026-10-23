<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RubricCriteria; // Import the RubricCriteria model
use Illuminate\Support\Facades\Validator; // Import Validator

class RubricCriteriaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rubricCriteria = RubricCriteria::all(); // Fetch all rubric criteria
        return response()->json($rubricCriteria); // Return as JSON
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string|unique:rubric_criteria,id',
            'questionId' => 'required|string|exists:questions,id',
            'name' => 'required|string|max:255',
            'value' => 'nullable|integer',
            'description' => 'nullable|text',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $rubricCriteria = RubricCriteria::create($request->all());

        return response()->json($rubricCriteria, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $rubricCriteria = RubricCriteria::find($id);

        if (!$rubricCriteria) {
            return response()->json(['message' => 'Rubric Criteria not found'], 404);
        }

        return response()->json($rubricCriteria);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $rubricCriteria = RubricCriteria::find($id);

        if (!$rubricCriteria) {
            return response()->json(['message' => 'Rubric Criteria not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'questionId' => 'string|exists:questions,id',
            'name' => 'string|max:255',
            'value' => 'nullable|integer',
            'description' => 'nullable|text',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $rubricCriteria->update($request->all());

        return response()->json($rubricCriteria);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $rubricCriteria = RubricCriteria::find($id);

        if (!$rubricCriteria) {
            return response()->json(['message' => 'Rubric Criteria not found'], 404);
        }

        $rubricCriteria->delete();

        return response()->json(['message' => 'Rubric Criteria deleted successfully']);
    }
}
