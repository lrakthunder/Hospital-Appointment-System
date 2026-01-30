<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'patient_name',
        'patient_email',
        'patient_phone',
        'doctor_id',
        'doctor_name',
        'appointment_date',
        'appointment_time',
        'department',
        'reason',
        'status',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'appointment_date' => 'datetime',
            'appointment_time' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function feedback()
    {
        return $this->hasOne(Feedback::class);
    }

    public function attachments()
    {
        return $this->hasMany(AppointmentAttachment::class);
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'doctor_id');
    }
}
