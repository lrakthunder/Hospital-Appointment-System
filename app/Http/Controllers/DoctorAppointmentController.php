<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\AppointmentAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class DoctorAppointmentController extends Controller
{
    public function index(Request $request)
    {
        $doctor = $request->user();
        
        $query = Appointment::where('doctor_id', $doctor->id)->with('attachments');

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->has('date_from')) {
            $query->whereDate('appointment_date', '>=', $request->date_from);
        }
        
        if ($request->has('date_to')) {
            $query->whereDate('appointment_date', '<=', $request->date_to);
        }

        $appointments = $query->orderBy('appointment_date')
            ->orderBy('appointment_time')
            ->get();

        return response()->json($appointments);
    }

    public function show(Request $request, $id)
    {
        $doctor = $request->user();
        $appointment = Appointment::where('doctor_id', $doctor->id)
            ->findOrFail($id);
            
        return response()->json($appointment);
    }

    public function updateStatus(Request $request, $id)
    {
        $doctor = $request->user();
        $appointment = Appointment::where('doctor_id', $doctor->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:confirmed,completed,cancelled',
            'doctor_notes' => 'nullable|string',
            'declined_reason' => 'nullable|string',
        ]);

        $appointment->update($validated);

        // Send email notification to patient
        if ($validated['status'] === 'confirmed') {
            $this->sendConfirmationEmail($appointment);
        } elseif ($validated['status'] === 'cancelled' && !empty($validated['declined_reason'])) {
            $this->sendDeclineEmail($appointment, $validated['declined_reason']);
        }

        return response()->json([
            'message' => 'Appointment status updated successfully',
            'appointment' => $appointment
        ]);
    }

    public function decline(Request $request, $id)
    {
        $doctor = $request->user();
        $appointment = Appointment::where('doctor_id', $doctor->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'declined_reason' => 'required|string|max:500',
        ]);

        $appointment->update([
            'status' => 'cancelled',
            'declined_reason' => $validated['declined_reason'],
        ]);

        // Send email notification
        $this->sendDeclineEmail($appointment, $validated['declined_reason']);

        return response()->json([
            'message' => 'Appointment declined and patient notified via email',
            'appointment' => $appointment
        ]);
    }

    public function addNotes(Request $request, $id)
    {
        $doctor = $request->user();
        $appointment = Appointment::where('doctor_id', $doctor->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'doctor_notes' => 'required|string',
        ]);

        $appointment->update($validated);

        return response()->json([
            'message' => 'Notes added successfully',
            'appointment' => $appointment
        ]);
    }

    public function stats(Request $request)
    {
        $doctor = $request->user();

        $totalAppointments = Appointment::where('doctor_id', $doctor->id)->count();
        $pending = Appointment::where('doctor_id', $doctor->id)->where('status', 'pending')->count();
        $confirmed = Appointment::where('doctor_id', $doctor->id)->where('status', 'confirmed')->count();
        $completed = Appointment::where('doctor_id', $doctor->id)->where('status', 'completed')->count();
        $cancelled = Appointment::where('doctor_id', $doctor->id)->where('status', 'cancelled')->count();

        $todayAppointments = Appointment::where('doctor_id', $doctor->id)
            ->with('attachments')
            ->whereDate('appointment_date', today())
            ->orderBy('appointment_time')
            ->get();

        $upcomingAppointments = Appointment::where('doctor_id', $doctor->id)
            ->with('attachments')
            ->whereDate('appointment_date', '>', today())
            ->where('status', '!=', 'cancelled')
            ->orderBy('appointment_date')
            ->orderBy('appointment_time')
            ->limit(10)
            ->get();

        return response()->json([
            'total' => $totalAppointments,
            'pending' => $pending,
            'confirmed' => $confirmed,
            'completed' => $completed,
            'cancelled' => $cancelled,
            'today_appointments' => $todayAppointments,
            'upcoming_appointments' => $upcomingAppointments,
        ]);
    }

    private function sendDeclineEmail($appointment, $reason)
    {
        try {
            $emailData = [
                'patient_name' => $appointment->patient_name,
                'doctor_name' => ($appointment->doctor?->name ?? $appointment->doctor_name),
                'appointment_date' => $appointment->appointment_date,
                'appointment_time' => $appointment->appointment_time,
                'department' => $appointment->department,
                'declined_reason' => $reason,
            ];

            // For now, just log the email (you can configure actual email later)
            Log::info('Appointment Decline Email', [
                'to' => $appointment->patient_email,
                'data' => $emailData
            ]);

            // Uncomment when email is configured:
            // Mail::send('emails.appointment-declined', $emailData, function($message) use ($appointment) {
            //     $message->to($appointment->patient_email)
            //         ->subject('Appointment Declined - ' . $appointment->doctor);
            // });

        } catch (\Exception $e) {
            Log::error('Failed to send decline email: ' . $e->getMessage());
        }
    }

    private function sendConfirmationEmail($appointment)
    {
        try {
            $emailData = [
                'patient_name' => $appointment->patient_name,
                'doctor_name' => ($appointment->doctor?->name ?? $appointment->doctor_name),
                'appointment_date' => $appointment->appointment_date,
                'appointment_time' => $appointment->appointment_time,
                'department' => $appointment->department,
                'doctor_notes' => $appointment->doctor_notes,
            ];

            // For now, just log the email (you can configure actual email later)
            Log::info('Appointment Confirmation Email', [
                'to' => $appointment->patient_email,
                'data' => $emailData
            ]);

            // Uncomment when email is configured:
            // Mail::send('emails.appointment-confirmed', $emailData, function($message) use ($appointment) {
            //     $message->to($appointment->patient_email)
            //         ->subject('Appointment Confirmed - ' . $appointment->doctor);
            // });

        } catch (\Exception $e) {
            Log::error('Failed to send confirmation email: ' . $e->getMessage());
        }
    }

    public function getPatientDetails(Request $request, $userId)
    {
        $doctor = $request->user();
        
        // Get user details
        $patient = \App\Models\User::find($userId);
        
        if (!$patient) {
            return response()->json(['message' => 'Patient not found'], 404);
        }
        
        // Get all appointments for this patient with this doctor
        $appointments = Appointment::where('user_id', $userId)
            ->where('doctor_id', $doctor->id)
            ->orderBy('appointment_date', 'desc')
            ->get();
        
        return response()->json([
            'patient' => $patient,
            'appointments' => $appointments,
            'total_appointments' => $appointments->count(),
            'completed_appointments' => $appointments->where('status', 'completed')->count(),
        ]);
    }

    public function uploadAttachment(Request $request, $id)
    {
        $doctor = $request->user();
        
        // Verify appointment belongs to this doctor
        $appointment = Appointment::where('doctor_id', $doctor->id)->findOrFail($id);
        
        try {
            $request->validate([
                'file' => 'required|file|max:25600', // 25MB in KB
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            $fileSize = $request->file('file') ? $request->file('file')->getSize() : 0;
            $fileSizeMB = round($fileSize / 1024 / 1024, 2);
            
            Log::error('File upload validation failed', [
                'file_size_bytes' => $fileSize,
                'file_size_mb' => $fileSizeMB,
                'max_allowed_kb' => 25600,
                'errors' => $e->errors()
            ]);
            
            return response()->json([
                'message' => "File size ({$fileSizeMB}MB) exceeds maximum allowed (25MB)",
                'file_size' => $fileSizeMB . 'MB',
                'max_allowed' => '25MB'
            ], 422);
        }

        $file = $request->file('file');
        
        // Store file in storage/app/public/appointment_attachments
        $path = $file->store('appointment_attachments', 'public');
        
        // Create attachment record
        $attachment = AppointmentAttachment::create([
            'appointment_id' => $appointment->id,
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'file_type' => $file->getClientMimeType(),
            'file_size' => $file->getSize(),
        ]);
        
        return response()->json($attachment, 201);
    }

    public function downloadAttachment(Request $request, $appointmentId, $attachmentId)
    {
        $doctor = $request->user();
        
        // Verify appointment belongs to this doctor
        $appointment = Appointment::where('doctor_id', $doctor->id)->findOrFail($appointmentId);
        
        $attachment = AppointmentAttachment::where('appointment_id', $appointment->id)
            ->findOrFail($attachmentId);
        
        return Storage::disk('public')->download($attachment->file_path, $attachment->file_name);
    }

    public function deleteAttachment(Request $request, $appointmentId, $attachmentId)
    {
        $doctor = $request->user();
        
        // Verify appointment belongs to this doctor
        $appointment = Appointment::where('doctor_id', $doctor->id)->findOrFail($appointmentId);
        
        $attachment = AppointmentAttachment::where('appointment_id', $appointment->id)
            ->findOrFail($attachmentId);
        
        // Delete file from storage
        Storage::disk('public')->delete($attachment->file_path);
        
        // Delete record
        $attachment->delete();
        
        return response()->json(['message' => 'Attachment deleted successfully']);
    }
}
