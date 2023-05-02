<?php

namespace App\Http\Controllers\Api;

//use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Support\Facades\Log; // Logファサードをuse
use Illuminate\Http\Request; 
use SebastianBergmann\Environment\Console;// リクエスト処理をする際はここのインポートは必須！ 

/**
 * Summary of AnalysisController
 */
class ScheduleController extends Controller
{

    public function getScheduleAll() {
        $items = Schedule::all();
        return response()->json($items);
    }
    public function getSchedule(Request $request) {
        $user_id = $request->input('user_id');
        //Log::debug('ログ出力：',$user_id);

        $items = Schedule::select('*')->where('user_id', $user_id)->get();
        return response()->json($items);
    }

    public function updateScheduleResult(Request $request) {
        $id = $request->input('id');
        $completion = $request->input('completion');
        

        Schedule::where('id', $id)->update(['completion' => $completion]);

        //return response()->json($items);
    }
}