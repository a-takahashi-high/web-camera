#!/usr/bin/php
<?php

$folder_path = "/var/www/analysis/photo/";
$ftp_server = "49.212.184.14";
$ftp_user_name = "develop";
$ftp_user_pass = "develop";

if (!$argv[1]){
    echo "第一引数が指定されていません。";
    return;
}
if (!$argv[2]){
    echo "第二引数が指定されていません。";
    return;
}
$file = $argv[1];
$remote_file = $folder_path.$argv[2];

if (!file_exists($file)){
    echo "ファイルが存在しません。:".$file;
    return;
}


// 接続を確立する
$ftp = ftp_connect($ftp_server) or die('接続エラー');

// ユーザー名とパスワードでログインする
$login_result = ftp_login($ftp, $ftp_user_name, $ftp_user_pass) or die("ログインエラー");

// ファイルをアップロードする
if (ftp_put($ftp, $remote_file, $file, FTP_ASCII)) {
 echo "successfully uploaded $file\n";
} else {
 echo "There was a problem while uploading $file\n";
}

// 接続を閉じる
ftp_close($ftp);

?>