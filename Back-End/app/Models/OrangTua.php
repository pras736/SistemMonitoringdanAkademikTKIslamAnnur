<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['id_user', 'id_anak', 'role', 'nama', 'nik', 'tempat_tanggal_lahir', 'pendidikan_tertinggi', 'pekerjaan', 'alamat_telp_kantor'])]
class OrangTua extends Model
{
    protected $table = 'orang_tuas';
    protected $primaryKey = 'id_ortu';

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function anak()
    {
        return $this->belongsTo(Anak::class, 'id_anak', 'id_anak');
    }
}
