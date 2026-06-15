<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['nama_kelas', 'tahun_ajaran', 'kapasitas'])]
class Kelas extends Model
{
    protected $table = 'kelas';
    protected $primaryKey = 'id_kelas';

    public function gurus()
    {
        return $this->hasMany(Guru::class, 'id_kelas', 'id_kelas');
    }

    public function anaks()
    {
        return $this->hasMany(Anak::class, 'id_kelas', 'id_kelas');
    }
}
