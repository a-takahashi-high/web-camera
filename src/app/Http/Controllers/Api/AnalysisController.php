<?php

namespace App\Http\Controllers\Api;

//use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\AnalysisMain;
use Illuminate\Support\Facades\Log; // Logファサードをuse
use Illuminate\Http\Request; 
use SebastianBergmann\Environment\Console;// リクエスト処理をする際はここのインポートは必須！ 

/**
 * Summary of AnalysisController
 */
class AnalysisController extends Controller
{
    public function getAllAnalysisMain() {
        $items = AnalysisMain::all();
        return response()->json($items);
    }

    public function getResult(Request $request) {
        $exam_id = $request->input('exam_id');
        $exam_date = $request->input('exam_date');
        $user_id = $request->input('user_id');
        $photo_part = $request->input('photo_part');
        //Log::debug('ログ出力：',$exam_id);
        $items = AnalysisMain::select('success')->where('exam_id', $exam_id)->where('exam_date', $exam_date)->where('user_id', $user_id)->where('photo_part', $photo_part)->first();
        return response()->json($items);
    }

    /**
     * Summary of sendImage
     * @param Request $request
     * @return void
     */
    public function sendImage(Request $request) {
        $nowdate = date('Ymd');//現在日付 20191231
        $base64 = $request->input('date');
        $order = $request->input('no');
        $data = str_replace('data:image/png;base64,', '', $base64);  // 冒頭の部分を削除
        $data = str_replace(' ', '+', $data);  // 空白を'+'に変換
        $image = base64_decode($data);
        // ファイルへ保存
        $file_path = '/home/develop/photo/';
        $file_name = sprintf("%s_%s_%s_%s.png",'00001','1',$nowdate, $order);
        $file = $file_path.$file_name;    //ファイル名を作成
        file_put_contents($file, $image);
    }
}