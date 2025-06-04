<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Task;


class Airdrop extends Model
{
     use HasFactory;

    protected $guarded = ['id'];

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }


}
