<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PostPrivacyController extends Controller
{
    public function index()
    {
        return Inertia::render('user/privacy');
    }
}
