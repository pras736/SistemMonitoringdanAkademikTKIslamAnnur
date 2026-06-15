<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['judul', 'deskripsi', 'tanggal', 'foto'])]
class Kegiatan extends Model
{
    protected $table = 'kegiatans';
    protected $primaryKey = 'id_kegiatan';

    protected function casts(): array
    {
        return [
            'tanggal' => 'date',
        ];
    }
}
