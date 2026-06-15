<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['id_anak', 'id_guru', 'minggu_ke', 'bulan', 'tahun', 'membaca', 'berhitung', 'menulis', 'catatan'])]
class PerkembanganAkademik extends Model
{
    protected $table = 'perkembangan_akademiks';
    protected $primaryKey = 'id_perkembangan';

    public function anak()
    {
        return $this->belongsTo(Anak::class, 'id_anak', 'id_anak');
    }

    public function guru()
    {
        return $this->belongsTo(Guru::class, 'id_guru', 'id_guru');
    }
}
