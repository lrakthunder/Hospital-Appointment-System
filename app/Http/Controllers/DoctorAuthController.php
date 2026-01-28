<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class DoctorAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $doctor = Doctor::where('email', $request->email)->first();

        if (!$doctor || !Hash::check($request->password, $doctor->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($doctor->status !== 'active') {
            return response()->json([
                'message' => 'Your account is inactive. Please contact administration.'
            ], 403);
        }

        $token = $doctor->createToken('doctor-token')->plainTextToken;

        return response()->json([
            'doctor' => $doctor,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
