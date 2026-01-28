<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
        ]);

        // Check if email already exists in users table
        if (User::where('email', $validated['email'])->exists()) {
            throw ValidationException::withMessages([
                'email' => ['This email is already registered.'],
            ]);
        }

        // Check if email is being used by a doctor
        if (Doctor::where('email', $validated['email'])->exists()) {
            throw ValidationException::withMessages([
                'email' => ['This email is reserved for medical staff.'],
            ]);
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'date_of_birth' => $validated['date_of_birth'] ?? null,
            'role' => 'user',
            'user_type' => 'client',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Try to find user first
        $user = User::where('email', $request->email)->first();

        if ($user && Hash::check($request->password, $user->password)) {
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
                'user_type' => $user->user_type ?? $user->role,
            ]);
        }

        // Try to find doctor
        $doctor = Doctor::where('email', $request->email)->first();

        if ($doctor && Hash::check($request->password, $doctor->password)) {
            if ($doctor->status !== 'active') {
                return response()->json([
                    'message' => 'Your account is inactive. Please contact administration.'
                ], 403);
            }

            $token = $doctor->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => $doctor,
                'token' => $token,
                'token_type' => 'Bearer',
                'user_type' => 'doctor'
            ]);
        }

        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
