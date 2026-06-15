<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['id_anak', 'id_guru', 'tanggal', 'status', 'keterangan'])]
class Absensi extends Model
{
    protected $table = 'absensis';
    protected $primaryKey = 'id_absensi';

    protected function casts(): array
    {
        return [
            'tanggal' => 'date',
        ];
    }

    public function anak()
    {
        return $this->belongsTo(Anak::class, 'id_anak', 'id_anak');
    }

    public function guru()
    {
        return $this->belongsTo(Guru::class, 'id_guru', 'id_guru');
    }
}
