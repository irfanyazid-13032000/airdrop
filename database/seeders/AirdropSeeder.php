<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AirdropSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
          $airdrop = Airdrop::create([
            'name' => 'Airdrop Project X',
            'claim_reward_at' => now()->addDays(10),
            'started_at' => now(),
        ]);

        // Daily Task
        $airdrop->tasks()->create([
            'type' => 'daily',
            'description' => 'Login dan retweet setiap hari',
        ]);

        // Weekly Task (dengan jadwal di hari Senin dan Kamis)
        $weekly = $airdrop->tasks()->create([
            'type' => 'weekly',
            'description' => 'Join weekly AMA di Discord',
        ]);

        TaskSchedule::insert([
            ['task_id' => $weekly->id, 'schedule_date' => now()->next('Monday')],
            ['task_id' => $weekly->id, 'schedule_date' => now()->next('Thursday')],
        ]);

        // Monthly Task (jadwal tanggal 5 dan 20 bulan ini)
        $monthly = $airdrop->tasks()->create([
            'type' => 'monthly',
            'description' => 'Submit KYC bulanan',
        ]);

        TaskSchedule::insert([
            ['task_id' => $monthly->id, 'schedule_date' => now()->startOfMonth()->addDays(4)],
            ['task_id' => $monthly->id, 'schedule_date' => now()->startOfMonth()->addDays(19)],
        ]);
    }
}
