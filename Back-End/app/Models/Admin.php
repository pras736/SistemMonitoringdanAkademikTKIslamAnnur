<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['id_user', 'nama_admin', 'no_telp'])]
class Admin extends Model
{
    protected $table = 'admins';
    protected $primaryKey = 'id_admin';

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function spps()
    {
        return $this->hasMany(Spp::class, 'id_admin', 'id_admin');
    }
}
