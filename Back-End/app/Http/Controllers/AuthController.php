<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password_hash)) {
            return response()->json([
                'message' => 'Credentials do not match our records.'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'role' => $user->role,
            'user' => [
                'id' => $user->id_user,
                'username' => $user->username,
                'foto_profil' => $user->foto_profil,
            ]
        ]);
    }

    public function updateProfilePhoto(Request $request)
    {
        $request->validate([
            'foto_profil' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = $request->user();

        // Delete old photo if exists
        if ($user->foto_profil) {
            Storage::disk('public')->delete($user->foto_profil);
        }

        // Store new photo
        $path = $request->file('foto_profil')->store('profile_photos', 'public');

        $user->foto_profil = $path;
        $user->save();

        return response()->json([
            'message' => 'Foto profil berhasil diperbarui',
            'foto_profil' => $path,
            'url' => asset('storage/' . $path)
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }
}
