<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['id_anak', 'jalan', 'kelurahan', 'kecamatan', 'kota', 'provinsi', 'kode_pos', 'jarak_ke_sekolah_km', 'telp_ayah', 'telp_ibu'])]
class AlamatAnak extends Model
{
    protected $table = 'alamat_anaks';
    protected $primaryKey = 'id_alamat';

    public function anak()
    {
        return $this->belongsTo(Anak::class, 'id_anak', 'id_anak');
    }
}
