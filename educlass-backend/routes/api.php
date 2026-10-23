<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\LecturerController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\ExamController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\RubricCriteriaController;
use App\Http\Controllers\Api\SubmissionController;
use App\Http\Controllers\Api\SubmissionAnswerController;
use App\Http\Controllers\Api\RubricScoreController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::apiResource('students', StudentController::class);
Route::apiResource('programs', ProgramController::class);
Route::apiResource('lecturers', LecturerController::class);
Route::apiResource('courses', CourseController::class);
Route::apiResource('exams', ExamController::class);
Route::apiResource('questions', QuestionController::class);
Route::apiResource('rubric-criteria', RubricCriteriaController::class);
Route::apiResource('submissions', SubmissionController::class);
Route::apiResource('submission-answers', SubmissionAnswerController::class);
Route::apiResource('rubric-scores', RubricScoreController::class);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
