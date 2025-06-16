<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::apiResource('/course', CourseController::class);
Route::apiResource('/program', ProgramController::class);
Route::apiResource('/exam', ExamController::class);
Route::apiResource('/question', QuestionController::class);
Route::apiResource('/schedule', ScheduleController::class);
Route::apiResource('/submission', SubmissionController::class);
Route::apiResource('/user', UserController::class);
