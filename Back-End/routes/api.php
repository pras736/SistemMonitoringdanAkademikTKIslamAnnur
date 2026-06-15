<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [App\Http\Controllers\AuthController::class, 'login']);
Route::post('/logout', [App\Http\Controllers\AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::get('/user', function (Request $request) {
    // Return user along with profiles depending on role
    $user = $request->user();
    $profile = null;
    if ($user->role === 'admin') {
        $profile = $user->admin ?? \App\Models\Admin::where('id_user', $user->id_user)->first();
    } elseif ($user->role === 'guru') {
        $profile = \App\Models\Guru::with('kelas')->where('id_user', $user->id_user)->first();
    } elseif ($user->role === 'orangtua') {
        $profile = \App\Models\OrangTua::with('anak.kelas')->where('id_user', $user->id_user)->first();
    }
    return response()->json([
        'user' => $user,
        'profile' => $profile
    ]);
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    // ==========================================
    // ADMIN ROUTES
    // ==========================================
    Route::prefix('admin')->group(function () {
        // Kelas
        Route::get('/kelas', [App\Http\Controllers\AdminController::class, 'listKelas']);
        Route::post('/kelas', [App\Http\Controllers\AdminController::class, 'storeKelas']);
        Route::put('/kelas/{id}', [App\Http\Controllers\AdminController::class, 'updateKelas']);
        Route::delete('/kelas/{id}', [App\Http\Controllers\AdminController::class, 'deleteKelas']);

        // Guru
        Route::get('/guru', [App\Http\Controllers\AdminController::class, 'listGuru']);
        Route::post('/guru', [App\Http\Controllers\AdminController::class, 'storeGuru']);
        Route::put('/guru/{id}', [App\Http\Controllers\AdminController::class, 'updateGuru']);
        Route::delete('/guru/{id}', [App\Http\Controllers\AdminController::class, 'deleteGuru']);

        // Siswa
        Route::get('/siswa/export', [App\Http\Controllers\AdminController::class, 'exportSiswa']);
        Route::get('/siswa', [App\Http\Controllers\AdminController::class, 'listSiswa']);
        Route::post('/siswa', [App\Http\Controllers\AdminController::class, 'storeSiswa']);
        Route::put('/siswa/{id}', [App\Http\Controllers\AdminController::class, 'updateSiswa']);
        Route::delete('/siswa/{id}', [App\Http\Controllers\AdminController::class, 'deleteSiswa']);

        // SPP
        Route::get('/spp/pending', [App\Http\Controllers\AdminController::class, 'listPendingSPP']);
        Route::get('/spp/all', [App\Http\Controllers\AdminController::class, 'listAllSPP']);
        Route::post('/spp/{id}/verify', [App\Http\Controllers\AdminController::class, 'verifySPP']);
    });

    // ==========================================
    // GURU ROUTES
    // ==========================================
    Route::prefix('guru')->group(function () {
        Route::get('/siswa', [App\Http\Controllers\GuruController::class, 'listMyStudents']);
        Route::get('/absensi', [App\Http\Controllers\GuruController::class, 'listAbsensi']);
        Route::post('/absensi', [App\Http\Controllers\GuruController::class, 'storeAbsensi']);

        Route::get('/perkembangan', [App\Http\Controllers\GuruController::class, 'listPerkembangan']);
        Route::post('/perkembangan', [App\Http\Controllers\GuruController::class, 'storePerkembangan']);

        Route::get('/mengaji', [App\Http\Controllers\GuruController::class, 'listMengaji']);
        Route::post('/mengaji', [App\Http\Controllers\GuruController::class, 'storeMengaji']);

        Route::get('/kegiatan', [App\Http\Controllers\GuruController::class, 'listKegiatan']);
        Route::post('/kegiatan', [App\Http\Controllers\GuruController::class, 'storeKegiatan']);
        Route::delete('/kegiatan/{id}', [App\Http\Controllers\GuruController::class, 'deleteKegiatan']);
    });

    // ==========================================
    // WALI MURID ROUTES
    // ==========================================
    Route::prefix('wali')->group(function () {
        Route::get('/anak', [App\Http\Controllers\WaliController::class, 'getMyChildInfo']);
        Route::put('/anak', [App\Http\Controllers\WaliController::class, 'updateChildProfile']);
        
        Route::get('/anak/akademik', [App\Http\Controllers\WaliController::class, 'getChildAcademicProgress']);
        Route::get('/anak/mengaji', [App\Http\Controllers\WaliController::class, 'getChildNgajiProgress']);
        Route::get('/anak/absensi', [App\Http\Controllers\WaliController::class, 'getChildAbsensi']);
        
        Route::get('/kegiatan', [App\Http\Controllers\WaliController::class, 'getKegiatanList']);
        
        Route::get('/spp', [App\Http\Controllers\WaliController::class, 'getMySPPList']);
        Route::post('/spp/upload', [App\Http\Controllers\WaliController::class, 'uploadSPPProof']);
    });
});
