<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['id_user', 'id_kelas', 'nama_guru', 'nip', 'no_telp'])]
class Guru extends Model
{
    protected $table = 'gurus';
    protected $primaryKey = 'id_guru';

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'id_kelas', 'id_kelas');
    }

    public function nilais()
    {
        return $this->hasMany(Nilai::class, 'id_guru', 'id_guru');
    }

    public function kartuNgajis()
    {
        return $this->hasMany(KartuNgaji::class, 'id_guru', 'id_guru');
    }
}
