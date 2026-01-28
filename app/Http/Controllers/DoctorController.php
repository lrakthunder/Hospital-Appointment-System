<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    public function index(Request $request)
    {
        $query = Doctor::query();

        // Filter by department
        if ($request->has('department')) {
            $query->where('department', $request->department);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Only active doctors for public listing
        if ($request->has('active_only')) {
            $query->where('status', 'active');
        }

        $doctors = $query->orderBy('name')->get();
        return response()->json($doctors);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
            'department' => 'required|string|max:255',
            'specialization' => 'required|string|max:255',
            'license_number' => 'required|string|max:100|unique:doctors,license_number',
            'years_of_experience' => 'required|integer|min:0',
            'consultation_fee' => 'nullable|numeric|min:0',
            'available_days' => 'nullable',
            'available_time_start' => 'nullable|date_format:H:i',
            'available_time_end' => 'nullable|date_format:H:i',
            'bio' => 'nullable|string',
            'status' => 'nullable|in:active,inactive',
        ]);

        // Check if email is being used by a user
        if (\App\Models\User::where('email', $validated['email'])->exists()) {
            return response()->json([
                'message' => 'This email is already registered by a patient/user.',
                'errors' => ['email' => ['This email is already in use by a patient.']]
            ], 422);
        }

        // Convert available_days to array for JSON storage
        if (!empty($validated['available_days'])) {
            if (is_string($validated['available_days'])) {
                // If it's a comma-separated string, convert to array
                $validated['available_days'] = array_map('trim', explode(',', $validated['available_days']));
            } elseif (!is_array($validated['available_days'])) {
                // If it's neither string nor array, make it an empty array
                $validated['available_days'] = [];
            }
        }

        // Generate a default password (doctor can change it later)
        $defaultPassword = 'Doctor@' . date('Y');
        $validated['password'] = bcrypt($defaultPassword);
        $validated['role'] = 'doctor';

        $doctor = Doctor::create($validated);

        return response()->json([
            'message' => 'Doctor added successfully. Default password: ' . $defaultPassword,
            'doctor' => $doctor,
            'default_password' => $defaultPassword
        ], 201);
    }

    public function show($id)
    {
        $doctor = Doctor::findOrFail($id);
        return response()->json($doctor);
    }

    public function update(Request $request, $id)
    {
        $doctor = Doctor::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email',
            'phone' => 'sometimes|required|string|max:20',
            'department' => 'sometimes|required|string|max:255',
            'specialization' => 'sometimes|required|string|max:255',
            'license_number' => 'sometimes|required|string|max:100|unique:doctors,license_number,' . $id,
            'years_of_experience' => 'sometimes|required|integer|min:0',
            'consultation_fee' => 'nullable|numeric|min:0',
            'available_days' => 'nullable',
            'available_time_start' => 'nullable|date_format:H:i',
            'available_time_end' => 'nullable|date_format:H:i',
            'bio' => 'nullable|string',
            'status' => 'nullable|in:active,inactive',
        ]);

        // Check if email is being changed and is used by a user
        if (isset($validated['email']) && $validated['email'] !== $doctor->email) {
            if (\App\Models\User::where('email', $validated['email'])->exists()) {
                return response()->json([
                    'message' => 'This email is already registered by a patient/user.',
                    'errors' => ['email' => ['This email is already in use by a patient.']]
                ], 422);
            }
        }

        // Convert available_days to array for JSON storage
        if (isset($validated['available_days']) && !empty($validated['available_days'])) {
            if (is_string($validated['available_days'])) {
                // If it's a comma-separated string, convert to array
                $validated['available_days'] = array_map('trim', explode(',', $validated['available_days']));
            } elseif (!is_array($validated['available_days'])) {
                // If it's neither string nor array, make it an empty array
                $validated['available_days'] = [];
            }
        }

        $doctor->update($validated);

        return response()->json([
            'message' => 'Doctor updated successfully',
            'doctor' => $doctor
        ]);
    }

    public function destroy($id)
    {
        $doctor = Doctor::findOrFail($id);
        $doctor->delete();

        return response()->json([
            'message' => 'Doctor deleted successfully'
        ]);
    }

    public function getByDepartment($department)
    {
        $doctors = Doctor::where('department', $department)
            ->where('status', 'active')
            ->orderBy('name')
            ->get();
            
        return response()->json($doctors);
    }
}
