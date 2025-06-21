<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Http\Requests\StoreExamRequest;
use App\Http\Requests\UpdateExamRequest;
use Illuminate\Support\Facades\DB;

class ExamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Exam::all()->load('questions');;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreExamRequest $request)
    {
        $validated = $request->validated();
        $exam = DB::transaction(function () use ($validated) {
            $exam = Exam::create([
                'lecturer_id' => $validated['lecturer_id'],
                'course_id' => $validated['course_id'],
                'type' => $validated['type'],
                'due_date' => $validated['due_date'],
                'start_time' => $validated['start_time'],
                'end_time' => $validated['end_time'],
                'duration' => $validated['duration'],
                'description' => $validated['description'] ?? null,
            ]);

            foreach ($validated['questions'] as $q) {
                $exam->questions()->create($q);
            }
            return $exam->load('questions');
        });

        return response()->json(['message' => 'examm added successfully','data' =>  $exam], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Exam $exam)
    {
        return  $exam->load('questions');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Exam $exam)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateExamRequest $request, Exam $exam)
    {
        $validated = $request->validated();
        DB::transaction(function () use ($exam, $validated) {

            $exam->update([
                'type' => $validated['type'],
                'due_date' => $validated['due_date'],
                'start_time' => $validated['start_time'],
                'end_time' => $validated['end_time'],
                'duration' => $validated['duration'],
                'description' => $validated['description'] ?? null,
            ]);

            $exam->questions()->delete();

            foreach ($validated['questions'] as $questionData) {
                $exam->questions()->create($questionData);
            }
        });
        return response()->json(['message' => 'Exam updated successfully','data' =>  $exam->load('questions')], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Exam $exam)
    {
        return $exam->delete();
    }
}
