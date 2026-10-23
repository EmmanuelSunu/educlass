<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course; // Import the Course model
use Illuminate\Support\Facades\Validator; // Import Validator

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $courses = Course::all(); // Fetch all courses
        return response()->json($courses); // Return as JSON
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string|unique:courses,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:courses,code|max:255',
            'description' => 'nullable|text',
            'programId' => 'nullable|string|exists:programs,id',
            'lecturerId' => 'nullable|string|exists:lecturers,id',
            'credits' => 'nullable|integer',
            'duration' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive',
            'level' => 'required|in:100,200,300,400',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $course = Course::create($request->all());

        return response()->json($course, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        return response()->json($course);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'code' => 'string|unique:courses,code,' . $id . '|max:255',
            'description' => 'nullable|text',
            'programId' => 'nullable|string|exists:programs,id',
            'lecturerId' => 'nullable|string|exists:lecturers,id',
            'credits' => 'nullable|integer',
            'duration' => 'nullable|string|max:255',
            'status' => 'in:active,inactive',
            'level' => 'in:100,200,300,400',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $course->update($request->all());

        return response()->json($course);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        $course->delete();

        return response()->json(['message' => 'Course deleted successfully']);
    }
}
