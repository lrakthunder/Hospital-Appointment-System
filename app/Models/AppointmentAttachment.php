<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppointmentAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointment_id',
        'file_name',
        'file_path',
        'file_type',
        'file_size'
    ];

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }
}
