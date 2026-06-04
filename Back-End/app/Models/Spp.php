<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['id_anak', 'id_admin', 'bulan', 'tahun', 'nominal', 'bukti_transfer', 'status_pembayaran', 'tanggal_bayar', 'tanggal_verifikasi'])]
class Spp extends Model
{
    protected $table = 'spps';
    protected $primaryKey = 'id_spp';

    protected function casts(): array
    {
        return [
            'tanggal_bayar' => 'date',
            'tanggal_verifikasi' => 'date',
        ];
    }

    public function anak()
    {
        return $this->belongsTo(Anak::class, 'id_anak', 'id_anak');
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class, 'id_admin', 'id_admin');
    }
}
