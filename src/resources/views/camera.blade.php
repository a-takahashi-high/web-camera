<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css">
    <!--<link rel="stylesheet" href="style.css">-->
    @if(config('app.env') === 'production')
        <link rel="stylesheet" href="{{ secure_asset('css/app.css') }}">
    @else
        <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    @endif
    <title>Demo3</title>
</head>

<style>
</style>

<body>
撮影 ver1.5
<div id="top_camera"></div>
<script src="{{ mix('ts/index.js') }}"></script>
</body>
</html>