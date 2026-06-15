<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['id_anak', 'id_guru', 'catatan', 'tanggal'])]
class KartuNgaji extends Model
{
    protected $table = 'kartu_ngajis';
    protected $primaryKey = 'id_kartu';

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
