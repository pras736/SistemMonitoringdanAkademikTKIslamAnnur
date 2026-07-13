<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Notification;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = Notification::where('id_user', $request->user()->id_user)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notifications);
    }

    public function markAsRead(Request $request, $id)
    {
        $notification = Notification::where('id_notification', $id)
            ->where('id_user', $request->user()->id_user)
            ->firstOrFail();

        $notification->update(['is_read' => true]);

        return response()->json(['message' => 'Notifikasi berhasil dibaca', 'data' => $notification]);
    }

    public function markAllAsRead(Request $request)
    {
        Notification::where('id_user', $request->user()->id_user)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['message' => 'Semua notifikasi berhasil dibaca']);
    }
}
