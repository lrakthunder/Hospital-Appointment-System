<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function index(Request $request)
    {
        $feedback = $request->user()->feedback()->latest()->with('appointment')->get();
        return response()->json($feedback);
    }

    public function store(Request $request)
    {
        // Check if user already submitted feedback today
        $todayFeedback = $request->user()->feedback()
            ->whereDate('created_at', today())
            ->first();

        if ($todayFeedback) {
            return response()->json([
                'message' => 'You have already submitted feedback today. You can edit your existing feedback instead.',
                'feedback' => $todayFeedback
            ], 422);
        }

        $validated = $request->validate([
            'appointment_id' => 'nullable|exists:appointments,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
            'department' => 'nullable|string|max:255',
        ]);

        $feedback = $request->user()->feedback()->create($validated);

        return response()->json([
            'message' => 'Feedback submitted successfully',
            'feedback' => $feedback
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $feedback = $request->user()->feedback()->with('appointment')->findOrFail($id);
        return response()->json($feedback);
    }

    public function update(Request $request, $id)
    {
        $feedback = $request->user()->feedback()->findOrFail($id);

        // Check if feedback is older than 1 day
        if ($feedback->created_at->diffInDays(now()) >= 1) {
            return response()->json([
                'message' => 'You can only edit feedback within 24 hours of submission.'
            ], 403);
        }

        $validated = $request->validate([
            'rating' => 'sometimes|required|integer|min:1|max:5',
            'comment' => 'nullable|string',
            'department' => 'nullable|string|max:255',
        ]);

        $feedback->update($validated);

        return response()->json([
            'message' => 'Feedback updated successfully',
            'feedback' => $feedback
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $feedback = $request->user()->feedback()->findOrFail($id);
        $feedback->delete();

        return response()->json([
            'message' => 'Feedback deleted successfully'
        ]);
    }

    public function myFeedback(Request $request)
    {
        $feedback = $request->user()->feedback()->latest()->with('appointment')->get();
        return response()->json($feedback);
    }
}
