<?php

namespace App\Http\Controllers;

use App\Models\Devotion;
use App\Http\Requests\StoreDevotionRequest;
use App\Http\Requests\UpdateDevotionRequest;
use Inertia\Inertia;

class DevotionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('user/create-devotion');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDevotionRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Devotion $devotion)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Devotion $devotion)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDevotionRequest $request, Devotion $devotion)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Devotion $devotion)
    {
        //
    }
}
