<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use App\Http\Requests\StoreSubmissionRequest;
use App\Http\Requests\UpdateSubmissionRequest;
use Illuminate\Support\Facades\DB;

class SubmissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Submission::all();
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
    public function store(StoreSubmissionRequest $request)
    {
        $data = $request->validated();
        $submissions = [];

        DB::transaction(function () use ($data) {
            foreach ($data['answers'] as $subs) {
                Submission::create([
                    'student_id' => $data['student_id'],  // auth()->id(), // or $request->student_id
                    'exam_id' => $data['exam_id'],
                    'question_id' => $subs['question_id'],
                    'response' => $subs['response'],
                ]);
            }
        });

        $submissions = Submission::whereIn('id', collect($submissions)->pluck('id'))->with(['question', 'exam'])->get();

        return response()->json(['message' => 'submission added successfully','data' =>  $submissions], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Submission $submission)
    {
        return $submission;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Submission $submission)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSubmissionRequest $request, Submission $submission)
    {
        $data = $request->validated();
        $submission->update($data);
        return response()->json(['message' => 'Schedule added successfully','data' =>  $submission], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Submission $submission)
    {
        return $submission->delete();
    }
}
