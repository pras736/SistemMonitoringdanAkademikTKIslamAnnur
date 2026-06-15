<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'id_user', 'id_anak',
    'nama_ayah', 'nik_ayah', 'ttl_ayah', 'pendidikan_ayah', 'pekerjaan_ayah', 'kantor_ayah',
    'nama_ibu', 'nik_ibu', 'ttl_ibu', 'pendidikan_ibu', 'pekerjaan_ibu', 'kantor_ibu'
])]
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
