<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['id_kelas', 'nisn', 'nik', 'no_reg_akte', 'nama_lengkap', 'nama_panggilan', 'jenis_kelamin', 'tempat_lahir', 'tanggal_lahir', 'agama', 'kewarganegaraan'])]
class Anak extends Model
{
    protected $table = 'anaks';
    protected $primaryKey = 'id_anak';

    protected function casts(): array
    {
        return [
            'tanggal_lahir' => 'date',
        ];
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'id_kelas', 'id_kelas');
    }

    public function orangTuas()
    {
        return $this->hasMany(OrangTua::class, 'id_anak', 'id_anak');
    }

    public function dataAnak()
    {
        return $this->hasOne(DataAnak::class, 'id_anak', 'id_anak');
    }

    public function alamatAnak()
    {
        return $this->hasOne(AlamatAnak::class, 'id_anak', 'id_anak');
    }

    public function nilais()
    {
        return $this->hasMany(Nilai::class, 'id_anak', 'id_anak');
    }

    public function kartuNgajis()
    {
        return $this->hasMany(KartuNgaji::class, 'id_anak', 'id_anak');
    }

    public function spps()
    {
        return $this->hasMany(Spp::class, 'id_anak', 'id_anak');
    }
}
