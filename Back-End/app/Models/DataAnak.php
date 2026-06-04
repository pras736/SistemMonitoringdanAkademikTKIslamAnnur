<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['id_anak', 'hobi', 'cita_cita', 'anak_ke', 'jumlah_saudara', 'golongan_darah', 'berat_badan_kg', 'tinggi_badan_cm', 'lingkar_kepala_cm', 'imunisasi'])]
class DataAnak extends Model
{
    protected $table = 'data_anaks';
    protected $primaryKey = 'id_data_anak';

    public function anak()
    {
        return $this->belongsTo(Anak::class, 'id_anak', 'id_anak');
    }
}
