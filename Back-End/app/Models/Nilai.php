<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['id_anak', 'id_guru', 'mata_pelajaran', 'nilai', 'semester', 'tgl_input'])]
class Nilai extends Model
{
    protected $table = 'nilais';
    protected $primaryKey = 'id_nilai';

    protected function casts(): array
    {
        return [
            'tgl_input' => 'date',
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
