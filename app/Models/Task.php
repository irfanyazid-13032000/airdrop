<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Airdrop; // ✅ ini yang kurang
use App\Models\TaskSchedule; // ✅ ini yang kurang
use App\Models\TaskChecklist; // ✅ ini yang kurang


class Task extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function airdrop()
    {
        return $this->belongsTo(Airdrop::class);
    }

    public function schedules()
    {
        return $this->hasMany(TaskSchedule::class);
    }

    public function checklists()
    {
        return $this->hasMany(TaskChecklist::class);
    }
}
