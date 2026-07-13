<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Each index is wrapped in try/catch to skip gracefully if it already exists
        $this->addIndexSafe('users', ['role'], 'users_role_index');
        $this->addIndexSafe('spps', ['status_pembayaran'], 'spps_status_pembayaran_index');
        $this->addIndexSafe('spps', ['tahun', 'bulan'], 'spps_tahun_bulan_index');
        $this->addIndexSafe('absensis', ['tanggal'], 'absensis_tanggal_index');
        $this->addIndexSafe('kegiatans', ['tanggal'], 'kegiatans_tanggal_index');
        $this->addIndexSafe('kartu_ngajis', ['tanggal'], 'kartu_ngajis_tanggal_index');
        $this->addIndexSafe('notifications', ['id_user', 'is_read'], 'notifications_id_user_is_read_index');
    }

    private function addIndexSafe(string $table, array $columns, string $indexName): void
    {
        try {
            Schema::table($table, function (Blueprint $t) use ($columns, $indexName) {
                $t->index($columns, $indexName);
            });
        } catch (\Exception $e) {
            // Index already exists — skip silently
        }
    }

    private function dropIndexSafe(string $table, string $indexName): void
    {
        try {
            Schema::table($table, function (Blueprint $t) use ($indexName) {
                $t->dropIndex($indexName);
            });
        } catch (\Exception $e) {
            // Index does not exist — skip silently
        }
    }

    public function down(): void
    {
        $this->dropIndexSafe('users', 'users_role_index');
        $this->dropIndexSafe('spps', 'spps_status_pembayaran_index');
        $this->dropIndexSafe('spps', 'spps_tahun_bulan_index');
        $this->dropIndexSafe('absensis', 'absensis_tanggal_index');
        $this->dropIndexSafe('kegiatans', 'kegiatans_tanggal_index');
        $this->dropIndexSafe('kartu_ngajis', 'kartu_ngajis_tanggal_index');
        $this->dropIndexSafe('notifications', 'notifications_id_user_is_read_index');
    }
};
