<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lecturer; // Import the Lecturer model
use Illuminate\Support\Facades\Validator; // Import Validator

class LecturerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $lecturers = Lecturer::all(); // Fetch all lecturers
        return response()->json($lecturers); // Return as JSON
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string|unique:lecturers,id',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:lecturers,email',
            'department' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $lecturer = Lecturer::create($request->all());

        return response()->json($lecturer, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $lecturer = Lecturer::find($id);

        if (!$lecturer) {
            return response()->json(['message' => 'Lecturer not found'], 404);
        }

        return response()->json($lecturer);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $lecturer = Lecturer::find($id);

        if (!$lecturer) {
            return response()->json(['message' => 'Lecturer not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'email' => 'string|email|unique:lecturers,email,' . $id,
            'department' => 'nullable|string|max:255',
            'status' => 'in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $lecturer->update($request->all());

        return response()->json($lecturer);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $lecturer = Lecturer::find($id);

        if (!$lecturer) {
            return response()->json(['message' => 'Lecturer not found'], 404);
        }

        $lecturer->delete();

        return response()->json(['message' => 'Lecturer deleted successfully']);
    }
}
