<?php

use App\Http\Controllers\Api\ScheduleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AnalysisController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*Route::group( ['middleware' => 'api'], function(){
    Route::get('analysis', 'AnalysisController@getAllAnalysisMain');
});*/

Route::get('/schedule_all', [ScheduleController::class, 'getScheduleAll']);

Route::get('/schedules', [ScheduleController::class, 'getSchedule']);

Route::get('/analysis', [AnalysisController::class, 'getAllAnalysisMain']);

Route::get('/result', [AnalysisController::class, 'getResult']);

Route::post('/send_file', [AnalysisController::class, 'sendImage']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
