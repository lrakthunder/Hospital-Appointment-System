<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\DoctorAuthController;
use App\Http\Controllers\DoctorAppointmentController;
use App\Http\Controllers\DoctorProfileController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Doctor auth routes
Route::post('/doctor/login', [DoctorAuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Appointment routes
    Route::apiResource('appointments', AppointmentController::class);
    Route::get('/my-appointments', [AppointmentController::class, 'myAppointments']);
    Route::get('/appointment-history', [AppointmentController::class, 'history']);
    
    // Feedback routes
    Route::apiResource('feedback', FeedbackController::class);
    Route::get('/my-feedback', [FeedbackController::class, 'myFeedback']);
    
    // Doctor routes (public viewing)
    Route::get('/doctors', [DoctorController::class, 'index']);
    Route::get('/doctors/{id}', [DoctorController::class, 'show']);
    Route::get('/doctors/department/{department}', [DoctorController::class, 'getByDepartment']);
    
    // Admin routes
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/dashboard-stats', [AdminController::class, 'dashboardStats']);
        Route::get('/appointments', [AdminController::class, 'allAppointments']);
        Route::put('/appointments/{id}/status', [AdminController::class, 'updateAppointmentStatus']);
        Route::get('/feedback', [AdminController::class, 'allFeedback']);
        Route::put('/feedback/{id}/toggle-visibility', [AdminController::class, 'toggleFeedbackVisibility']);
        Route::get('/users', [AdminController::class, 'allUsers']);
        Route::get('/charts-data', [AdminController::class, 'chartsData']);
        Route::get('/calendar-appointments', [AdminController::class, 'calendarAppointments']);
        
        // Doctor management (admin only)
        Route::post('/doctors', [DoctorController::class, 'store']);
        Route::put('/doctors/{id}', [DoctorController::class, 'update']);
        Route::delete('/doctors/{id}', [DoctorController::class, 'destroy']);
        
        // Admin view doctor profile
        Route::get('/doctors/{id}/profile', [DoctorProfileController::class, 'showById']);
        Route::put('/doctors/{id}/profile', [DoctorProfileController::class, 'updateByAdmin']);
    });

    // Doctor portal routes
    Route::prefix('doctor')->group(function () {
        Route::post('/logout', [DoctorAuthController::class, 'logout']);
        Route::get('/me', [DoctorAuthController::class, 'me']);
        Route::get('/appointments', [DoctorAppointmentController::class, 'index']);
        Route::get('/appointments/{id}', [DoctorAppointmentController::class, 'show']);
        Route::put('/appointments/{id}/status', [DoctorAppointmentController::class, 'updateStatus']);
        Route::post('/appointments/{id}/decline', [DoctorAppointmentController::class, 'decline']);
        Route::post('/appointments/{id}/notes', [DoctorAppointmentController::class, 'addNotes']);
        Route::get('/stats', [DoctorAppointmentController::class, 'stats']);
        Route::get('/patient/{userId}', [DoctorAppointmentController::class, 'getPatientDetails']);
        
        // Doctor profile routes
        Route::get('/profile', [DoctorProfileController::class, 'show']);
        Route::put('/profile', [DoctorProfileController::class, 'update']);
        
        // Attachment routes
        Route::post('/appointments/{id}/attachments', [DoctorAppointmentController::class, 'uploadAttachment']);
        Route::get('/appointments/{appointmentId}/attachments/{attachmentId}', [DoctorAppointmentController::class, 'downloadAttachment']);
        Route::delete('/appointments/{appointmentId}/attachments/{attachmentId}', [DoctorAppointmentController::class, 'deleteAttachment']);
    });
});
