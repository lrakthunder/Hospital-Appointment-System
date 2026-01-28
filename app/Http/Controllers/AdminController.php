<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Feedback;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function dashboardStats()
    {
        $stats = [
            'total_users' => User::where('role', 'user')->count(),
            'total_appointments' => Appointment::count(),
            'pending_appointments' => Appointment::where('status', 'pending')->count(),
            'confirmed_appointments' => Appointment::where('status', 'confirmed')->count(),
            'completed_appointments' => Appointment::where('status', 'completed')->count(),
            'cancelled_appointments' => Appointment::where('status', 'cancelled')->count(),
            'total_feedback' => Feedback::count(),
            'average_rating' => round(Feedback::avg('rating'), 2),
        ];

        return response()->json($stats);
    }

    public function allAppointments(Request $request)
    {
        $query = Appointment::with('user');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('date')) {
            $query->whereDate('appointment_date', $request->date);
        }

        if ($request->has('department')) {
            $query->where('department', $request->department);
        }

        $appointments = $query->latest()->paginate(20);

        return response()->json($appointments);
    }

    public function updateAppointmentStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,completed,cancelled',
            'notes' => 'nullable|string',
        ]);

        $appointment = Appointment::findOrFail($id);
        $appointment->update($validated);

        return response()->json([
            'message' => 'Appointment status updated successfully',
            'appointment' => $appointment
        ]);
    }

    public function allFeedback(Request $request)
    {
        $query = Feedback::with('user', 'appointment');

        if ($request->has('rating')) {
            $query->where('rating', $request->rating);
        }


        $feedback = $query->latest()->paginate(20);

        return response()->json($feedback);
    }

    public function toggleFeedbackVisibility($id)
    {
        $feedback = Feedback::findOrFail($id);
        $feedback->save();

        return response()->json([
            'message' => 'Feedback updated successfully',
            'feedback' => $feedback
        ]);
    }

    public function allUsers(Request $request)
    {
        $users = User::where('role', 'user')
            ->withCount('appointments', 'feedback')
            ->latest()
            ->paginate(20);

        return response()->json($users);
    }

    public function chartsData()
    {
        // Appointments by status
        $appointmentsByStatus = Appointment::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        // Appointments by department
        $appointmentsByDepartment = Appointment::select('department', DB::raw('count(*) as count'))
            ->groupBy('department')
            ->get();

        // Appointments by month (last 6 months)
        $appointmentsByMonth = Appointment::select(
            DB::raw('DATE_FORMAT(appointment_date, "%Y-%m") as month'),
            DB::raw('count(*) as count')
        )
            ->where('appointment_date', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Feedback ratings distribution
        $feedbackDistribution = Feedback::select('rating', DB::raw('count(*) as count'))
            ->groupBy('rating')
            ->orderBy('rating')
            ->get();


        return response()->json([
            'appointments_by_status' => $appointmentsByStatus,
            'appointments_by_department' => $appointmentsByDepartment,
            'appointments_by_month' => $appointmentsByMonth,
            'feedback_distribution' => $feedbackDistribution,
        ]);
    }

    public function calendarAppointments(Request $request)
    {
        $query = Appointment::with('user:id,name,email');

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('appointment_date', [$request->start_date, $request->end_date]);
        }

        $appointments = $query->get();

        return response()->json($appointments);
    }
}
