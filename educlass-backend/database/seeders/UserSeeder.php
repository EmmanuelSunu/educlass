<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => Hash::make('pass123'),
                'role' => 'admin',
            ],
            [
                'name' => 'Lecturer User',
                'email' => 'lecturer@example.com',
                'password' => Hash::make('pass123'),
                'role' => 'lecturer',
            ],
            [
                'name' => 'Student User',
                'email' => 'student@example.com',
                'password' => Hash::make('pass123'),
                'role' => 'student',
            ],
        ]);
    }
}
