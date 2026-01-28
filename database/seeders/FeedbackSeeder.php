<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Feedback;
use App\Models\User;

class FeedbackSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('role', 'user')->first();
        
        if (!$user) {
            echo "No user found. Please create a user first.\n";
            return;
        }

        $feedbackData = [
            [
                'user_id' => $user->id,
                'rating' => 5,
                'department' => 'Cardiology',
                'comment' => 'Excellent service! The doctor was very professional and attentive.',
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(5),
            ],
            [
                'user_id' => $user->id,
                'rating' => 4,
                'department' => 'Orthopedics',
                'comment' => 'Good experience overall. Waiting time could be improved.',
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(3),
            ],
            [
                'user_id' => $user->id,
                'rating' => 5,
                'department' => 'Pediatrics',
                'comment' => 'Amazing staff! Very friendly and caring towards children.',
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
            [
                'user_id' => $user->id,
                'rating' => 3,
                'department' => 'General Medicine',
                'comment' => 'Average experience. The facilities need some upgrades.',
                'created_at' => now()->subDays(1),
                'updated_at' => now()->subDays(1),
            ],
            [
                'user_id' => $user->id,
                'rating' => 5,
                'department' => 'Cardiology',
                'comment' => 'Dr. Smith was fantastic! Highly recommend this hospital.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($feedbackData as $feedback) {
            Feedback::create($feedback);
        }

        echo "Sample feedback data created successfully!\n";
    }
}
