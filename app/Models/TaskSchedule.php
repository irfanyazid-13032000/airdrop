<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Task; // ✅ ini yang kurang


class TaskSchedule extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}
