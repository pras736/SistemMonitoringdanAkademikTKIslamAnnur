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
        // 1. KELAS
        Schema::create('kelas', function (Blueprint $table) {
            $table->id('id_kelas');
            $table->string('nama_kelas');
            $table->string('tahun_ajaran');
            $table->integer('kapasitas');
            $table->timestamps();
        });

        // 2. ADMIN
        Schema::create('admins', function (Blueprint $table) {
            $table->id('id_admin');
            $table->foreignId('id_user')->constrained('users', 'id_user')->onDelete('cascade');
            $table->string('nama_admin');
            $table->string('no_telp');
            $table->timestamps();
        });

        // 3. GURU
        Schema::create('gurus', function (Blueprint $table) {
            $table->id('id_guru');
            $table->foreignId('id_user')->constrained('users', 'id_user')->onDelete('cascade');
            $table->foreignId('id_kelas')->nullable()->constrained('kelas', 'id_kelas')->onDelete('set null');
            $table->string('nama_guru');
            $table->string('nip')->nullable();
            $table->string('no_telp');
            $table->timestamps();
        });

        // 4. ANAK
        Schema::create('anaks', function (Blueprint $table) {
            $table->id('id_anak');
            $table->foreignId('id_kelas')->nullable()->constrained('kelas', 'id_kelas')->onDelete('set null');
            $table->string('nisn')->nullable();
            $table->string('nik')->nullable();
            $table->string('no_reg_akte')->nullable();
            $table->string('nama_lengkap');
            $table->string('nama_panggilan')->nullable();
            $table->string('jenis_kelamin');
            $table->string('tempat_lahir')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->string('agama')->nullable();
            $table->string('kewarganegaraan')->nullable();
            $table->timestamps();
        });

        // 5. ORANG_TUA
        Schema::create('orang_tuas', function (Blueprint $table) {
            $table->id('id_ortu');
            $table->foreignId('id_user')->constrained('users', 'id_user')->onDelete('cascade');
            $table->foreignId('id_anak')->nullable()->constrained('anaks', 'id_anak')->onDelete('cascade');
            $table->string('role'); // e.g. ayah/ibu/wali
            $table->string('nama');
            $table->string('nik')->nullable();
            $table->string('tempat_tanggal_lahir')->nullable();
            $table->string('pendidikan_tertinggi')->nullable();
            $table->string('pekerjaan')->nullable();
            $table->string('alamat_telp_kantor')->nullable();
            $table->timestamps();
        });

        // 6. DATA_ANAK
        Schema::create('data_anaks', function (Blueprint $table) {
            $table->id('id_data_anak');
            $table->foreignId('id_anak')->constrained('anaks', 'id_anak')->onDelete('cascade');
            $table->string('hobi')->nullable();
            $table->string('cita_cita')->nullable();
            $table->integer('anak_ke')->nullable();
            $table->integer('jumlah_saudara')->nullable();
            $table->string('golongan_darah')->nullable();
            $table->float('berat_badan_kg')->nullable();
            $table->float('tinggi_badan_cm')->nullable();
            $table->float('lingkar_kepala_cm')->nullable();
            $table->string('imunisasi')->nullable();
            $table->timestamps();
        });

        // 7. ALAMAT_ANAK
        Schema::create('alamat_anaks', function (Blueprint $table) {
            $table->id('id_alamat');
            $table->foreignId('id_anak')->constrained('anaks', 'id_anak')->onDelete('cascade');
            $table->string('jalan')->nullable();
            $table->string('kelurahan')->nullable();
            $table->string('kecamatan')->nullable();
            $table->string('kota')->nullable();
            $table->string('provinsi')->nullable();
            $table->string('kode_pos')->nullable();
            $table->float('jarak_ke_sekolah_km')->nullable();
            $table->string('telp_ayah')->nullable();
            $table->string('telp_ibu')->nullable();
            $table->timestamps();
        });

        // 8. NILAI
        Schema::create('nilais', function (Blueprint $table) {
            $table->id('id_nilai');
            $table->foreignId('id_anak')->constrained('anaks', 'id_anak')->onDelete('cascade');
            $table->foreignId('id_guru')->constrained('gurus', 'id_guru')->onDelete('cascade');
            $table->string('mata_pelajaran');
            $table->float('nilai');
            $table->string('semester');
            $table->date('tgl_input');
            $table->timestamps();
        });

        // 9. KARTU_NGAJI
        Schema::create('kartu_ngajis', function (Blueprint $table) {
            $table->id('id_kartu');
            $table->foreignId('id_anak')->constrained('anaks', 'id_anak')->onDelete('cascade');
            $table->foreignId('id_guru')->constrained('gurus', 'id_guru')->onDelete('cascade');
            $table->string('catatan');
            $table->date('tanggal');
            $table->timestamps();
        });

        // 10. SPP
        Schema::create('spps', function (Blueprint $table) {
            $table->id('id_spp');
            $table->foreignId('id_anak')->constrained('anaks', 'id_anak')->onDelete('cascade');
            $table->foreignId('id_admin')->nullable()->constrained('admins', 'id_admin')->onDelete('set null');
            $table->string('bulan');
            $table->string('tahun');
            $table->float('nominal');
            $table->string('bukti_transfer')->nullable();
            $table->string('status_pembayaran');
            $table->date('tanggal_bayar')->nullable();
            $table->date('tanggal_verifikasi')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spps');
        Schema::dropIfExists('kartu_ngajis');
        Schema::dropIfExists('nilais');
        Schema::dropIfExists('alamat_anaks');
        Schema::dropIfExists('data_anaks');
        Schema::dropIfExists('orang_tuas');
        Schema::dropIfExists('anaks');
        Schema::dropIfExists('gurus');
        Schema::dropIfExists('admins');
        Schema::dropIfExists('kelas');
    }
};
