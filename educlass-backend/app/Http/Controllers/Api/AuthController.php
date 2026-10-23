<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed'
        ]);

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password'])
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'role' => $user->role,
        ]);
    }

    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            \Log::info('Authentication failed for email: ' . $request['email']);
            return response()->json([
                'message' => 'Invalid login credentials'
            ], 401);
        }

        \Log::info('Authentication successful for email: ' . $request['email']);

        $user = User::where('email', $request['email'])->first();

        if (!$user) {
            \Log::info('User not found for email: ' . $request['email']);
            return response()->json([
                'message' => 'Invalid login credentials'
            ], 401);
        }

        \Log::info('User found for email: ' . $request['email']);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'role' => $user->role,
        ]);
    }
}
