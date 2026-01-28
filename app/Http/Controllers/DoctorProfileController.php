<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class DoctorProfileController extends Controller
{
    /**
     * Get authenticated doctor's profile
     */
    public function show(Request $request)
    {
        $doctor = $request->user();
        return response()->json($doctor);
    }

    /**
     * Get doctor profile by ID (for admin view)
     */
    public function showById($id)
    {
        $doctor = Doctor::findOrFail($id);
        return response()->json($doctor);
    }

    /**
     * Update doctor profile
     */
    public function update(Request $request)
    {
        $doctor = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:doctors,email,' . $doctor->id,
            'phone' => 'sometimes|string|max:20',
            'department' => 'sometimes|string|max:255',
            'specialization' => 'sometimes|string|max:255',
            'license_number' => 'sometimes|string|max:100|unique:doctors,license_number,' . $doctor->id,
            'years_of_experience' => 'sometimes|integer|min:0',
            'consultation_fee' => 'sometimes|numeric|min:0',
            'available_days' => 'sometimes|string',
            'available_time_start' => 'sometimes|date_format:H:i',
            'available_time_end' => 'sometimes|date_format:H:i',
            'bio' => 'nullable|string',
            'qualifications' => 'nullable|string',
            'education' => 'nullable|string',
            'medical_school' => 'nullable|string|max:255',
            'graduation_year' => 'nullable|integer|min:1950|max:' . (date('Y') + 10),
            'certifications' => 'nullable|string',
            'languages_spoken' => 'nullable|string',
            'office_address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'zip_code' => 'nullable|string|max:10',
            'emergency_contact' => 'nullable|string|max:255',
            'emergency_phone' => 'nullable|string|max:20',
            'awards_recognition' => 'nullable|string',
            'research_interests' => 'nullable|string',
            'accepting_new_patients' => 'sometimes|boolean',
            'gender' => 'nullable|string|in:Male,Female,Other',
            'date_of_birth' => 'nullable|date',
            'current_password' => 'nullable|string',
            'new_password' => 'nullable|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Handle password change
        if ($request->filled('current_password') && $request->filled('new_password')) {
            if (!Hash::check($request->current_password, $doctor->password)) {
                return response()->json([
                    'errors' => ['current_password' => ['Current password is incorrect']]
                ], 422);
            }
            $doctor->password = Hash::make($request->new_password);
        }

        // Update only provided fields
        $fieldsToUpdate = array_filter($request->except(['current_password', 'new_password', 'new_password_confirmation']));
        $doctor->update($fieldsToUpdate);

        return response()->json([
            'message' => 'Profile updated successfully',
            'doctor' => $doctor
        ]);
    }

    /**
     * Update doctor profile by admin
     */
    public function updateByAdmin(Request $request, $id)
    {
        $doctor = Doctor::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:doctors,email,' . $doctor->id,
            'phone' => 'sometimes|string|max:20',
            'department' => 'sometimes|string|max:255',
            'specialization' => 'sometimes|string|max:255',
            'license_number' => 'sometimes|string|max:100|unique:doctors,license_number,' . $doctor->id,
            'years_of_experience' => 'sometimes|integer|min:0',
            'consultation_fee' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:active,inactive',
            'available_days' => 'sometimes|string',
            'available_time_start' => 'sometimes|date_format:H:i',
            'available_time_end' => 'sometimes|date_format:H:i',
            'bio' => 'nullable|string',
            'qualifications' => 'nullable|string',
            'education' => 'nullable|string',
            'medical_school' => 'nullable|string|max:255',
            'graduation_year' => 'nullable|integer|min:1950|max:' . (date('Y') + 10),
            'certifications' => 'nullable|string',
            'languages_spoken' => 'nullable|string',
            'office_address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'zip_code' => 'nullable|string|max:10',
            'emergency_contact' => 'nullable|string|max:255',
            'emergency_phone' => 'nullable|string|max:20',
            'awards_recognition' => 'nullable|string',
            'research_interests' => 'nullable|string',
            'accepting_new_patients' => 'sometimes|boolean',
            'gender' => 'nullable|string|in:Male,Female,Other',
            'date_of_birth' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $doctor->update($request->all());

        return response()->json([
            'message' => 'Doctor profile updated successfully',
            'doctor' => $doctor
        ]);
    }
}
