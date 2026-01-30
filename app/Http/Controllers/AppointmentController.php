<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $appointments = $request->user()->appointments()->latest()->get();
        return response()->json($appointments);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_name' => 'required|string|max:255',
            'patient_email' => 'required|email|max:255',
            'patient_phone' => 'required|string|max:20',
            'appointment_date' => 'required|date|after_or_equal:today',
            'appointment_time' => 'required',
            'department' => 'required|string|max:255',
            'doctor' => 'nullable|integer|exists:doctors,id',
            'reason' => 'nullable|string',
        ]);

        // Map 'doctor' (id) to 'doctor_id' for database storage
        $appointmentData = $validated;
        if (isset($validated['doctor'])) {
            $appointmentData['doctor_id'] = $validated['doctor'];
            unset($appointmentData['doctor']);
        }

        // Check if user already has an appointment with this doctor today
        if (!empty($validated['doctor'])) {
            $existingAppointment = $request->user()->appointments()
                ->whereDate('appointment_date', $validated['appointment_date'])
                ->where('doctor_id', $validated['doctor'])
                ->first();

            if ($existingAppointment) {
                $doctorName = \App\Models\Doctor::find($validated['doctor'])->name ?? 'the selected doctor';
                return response()->json([
                    'message' => 'You already have an appointment with ' . $doctorName . ' on this date.'
                ], 422);
            }
        }

        $appointment = $request->user()->appointments()->create($appointmentData);

        return response()->json([
            'message' => 'Appointment booked successfully',
            'appointment' => $appointment
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $appointment = $request->user()->appointments()->findOrFail($id);
        return response()->json($appointment);
    }

    public function update(Request $request, $id)
    {
        $appointment = $request->user()->appointments()->findOrFail($id);

        $validated = $request->validate([
            'patient_name' => 'sometimes|required|string|max:255',
            'patient_email' => 'sometimes|required|email|max:255',
            'patient_phone' => 'sometimes|required|string|max:20',
            'appointment_date' => 'sometimes|required|date|after_or_equal:today',
            'appointment_time' => 'sometimes|required',
            'department' => 'sometimes|required|string|max:255',
            'doctor' => 'nullable|integer|exists:doctors,id',
            'reason' => 'nullable|string',
        ]);

        // If doctor id provided, map to doctor_id field
        if (isset($validated['doctor'])) {
            $validated['doctor_id'] = $validated['doctor'];
            unset($validated['doctor']);
        }

        $appointment->update($validated);

        return response()->json([
            'message' => 'Appointment updated successfully',
            'appointment' => $appointment
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $appointment = $request->user()->appointments()->findOrFail($id);
        $appointment->delete();

        return response()->json([
            'message' => 'Appointment cancelled successfully'
        ]);
    }

    public function myAppointments(Request $request)
    {
        $appointments = $request->user()->appointments()
            ->where('status', '!=', 'cancelled')
            ->latest()
            ->get();

        return response()->json($appointments);
    }

    public function history(Request $request)
    {
        $appointments = $request->user()->appointments()
            ->whereIn('status', ['completed', 'cancelled'])
            ->latest()
            ->with('feedback')
            ->get();

        return response()->json($appointments);
    }
}
