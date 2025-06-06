<?php

namespace App\Http\Controllers;

use App\Models\Airdrop;
use App\Models\Task;
use App\Models\TaskSchedule;
use App\Models\TaskChecklist;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AirdropController extends Controller
{
    public function index()
    {
         $today = Carbon::today()->toDateString(); // format: '2025-06-04'

    $tasks = Task::with(['airdrop', 'checklists' => function ($q) use ($today) {
        $q->where('checklist_date', $today);
    }])
    ->where(function ($query) use ($today) {
        $query->where('type', 'daily')
            ->orWhere(function ($q) use ($today) {
                $q->whereIn('type', ['weekly', 'monthly'])
                  ->whereHas('checklists', function ($sub) use ($today) {
                      $sub->where('checklist_date', $today);
                  });
            });
    })
    ->get()
    ->map(function ($task) use ($today) {
        return [
            'id' => $task->id,
            'description' => $task->description,
            'type' => $task->type,
            'checked' => $task->checklists->first()?->is_checked ?? false,
            'airdrop' => [
                'id' => $task->airdrop->id,
                'name' => $task->airdrop->name,
            ],
        ];
    });

    return Inertia::render('Airdrop/Home', [
        'tugasHariIni' => $tasks,
        'today' => $today,
    ]);
    }

    public function tolol()
    {
        $today = Carbon::today()->toDateString(); // format: '2025-06-04'

    $tasks = Task::with(['airdrop', 'checklists' => function ($q) use ($today) {
        $q->where('checklist_date', $today);
    }])
    ->where(function ($query) use ($today) {
        $query->where('type', 'daily')
            ->orWhere(function ($q) use ($today) {
                $q->whereIn('type', ['weekly', 'monthly'])
                  ->whereHas('checklists', function ($sub) use ($today) {
                      $sub->where('checklist_date', $today);
                  });
            });
    })
    ->get()
    ->map(function ($task) use ($today) {
        return [
            'id' => $task->id,
            'description' => $task->description,
            'type' => $task->type,
            'checked' => $task->checklists->first()?->is_checked ?? false,
            'airdrop' => [
                'id' => $task->airdrop->id,
                'name' => $task->airdrop->name,
            ],
        ];
    });

        return $tasks;
    }
    
  public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string',
        'claim_reward_at' => 'required|date',
        'started_at' => 'required|date',
        'tasks' => 'required|array',
        'tasks.*.type' => 'required|string|in:daily,weekly,monthly',
        'tasks.*.description' => 'nullable|string',
        'tasks.*.dates' => 'array',
        'tasks.*.dates.*' => 'date',
    ]);

    $airdrop = Airdrop::create($request->only(['name', 'claim_reward_at', 'started_at']));

    foreach ($request->tasks as $taskData) {
        $task = $airdrop->tasks()->create([
            'type' => $taskData['type'],
            'description' => $taskData['description'] ?? null,
        ]);

        // Jika tipe weekly/monthly, buat jadwalnya
        if (in_array($task->type, ['weekly', 'monthly']) && !empty($taskData['dates'])) {
            foreach ($taskData['dates'] as $date) {
                $task->schedules()->create(['schedule_date' => $date]);
            }
        }
    }

    return response()->json([
        'success' => true,
        'airdrop' => $airdrop->load('tasks.schedules'),
    ]);
}



    public function checklist(Request $request, $taskId)
    {
        $today = Carbon::today()->toDateString();

        TaskChecklist::updateOrCreate(
            [
                'task_id' => $taskId,
                'checklist_date' => $today,
            ],
            [
                'is_checked' => $request->input('is_checked', true),
            ]
        );

        return back();
    }
}
