<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$tokenRes = Illuminate\Support\Facades\Http::post('http://127.0.0.1:8000/api/login', ['username'=>'orangtua', 'password'=>'password']);
$token = $tokenRes->json('token');
if (!$token) {
    echo "Login failed\n";
    exit;
}

$res = Illuminate\Support\Facades\Http::withToken($token)->get('http://127.0.0.1:8000/api/wali/anak');
echo $res->status() . "\n";
echo $res->body() . "\n";
