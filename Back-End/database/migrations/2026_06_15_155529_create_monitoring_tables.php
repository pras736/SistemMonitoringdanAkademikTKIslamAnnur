<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. ABSENSI
        Schema::create('absensis', function (Blueprint $table) {
            $table->id('id_absensi');
            $table->foreignId('id_anak')->constrained('anaks', 'id_anak')->onDelete('cascade');
            $table->foreignId('id_guru')->constrained('gurus', 'id_guru')->onDelete('cascade');
            $table->date('tanggal');
            $table->string('status'); // e.g. hadir, sakit, izin, alfa
            $table->string('keterangan')->nullable();
            $table->timestamps();
        });

        // 2. KEGIATAN LUAR SEKOLAH
        Schema::create('kegiatans', function (Blueprint $table) {
            $table->id('id_kegiatan');
            $table->string('judul');
            $table->text('deskripsi');
            $table->date('tanggal');
            $table->string('foto')->nullable();
            $table->timestamps();
        });

        // 3. PERKEMBANGAN AKADEMIK MINGGUAN
        Schema::create('perkembangan_akademiks', function (Blueprint $table) {
            $table->id('id_perkembangan');
            $table->foreignId('id_anak')->constrained('anaks', 'id_anak')->onDelete('cascade');
            $table->foreignId('id_guru')->constrained('gurus', 'id_guru')->onDelete('cascade');
            $table->integer('minggu_ke');
            $table->string('bulan');
            $table->string('tahun');
            $table->string('membaca'); // e.g. BB, MB, BSH, BSB
            $table->string('berhitung');
            $table->string('menulis');
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('perkembangan_akademiks');
        Schema::dropIfExists('kegiatans');
        Schema::dropIfExists('absensis');
    }
};
