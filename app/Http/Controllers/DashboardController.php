<?php

namespace App\Http\Controllers;

use App\Models\Devotion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('user/dashboard', ['userDevotion' => Devotion::with('user')->latest()->get()]);
    }
}
