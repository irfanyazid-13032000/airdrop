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
        $today = Carbon::today();

        // Ambil semua task yang aktif hari ini
        $dailyTasks = Task::with('airdrop')
            ->where('type', 'daily')
            ->get();

        $scheduledTasks = Task::with('airdrop')
            ->whereHas('schedules', function ($q) use ($today) {
                $q->where('schedule_date', $today);
            })->get();

        $tasks = $dailyTasks->merge($scheduledTasks)->map(function ($task) use ($today) {
            $task->checked = $task->checklists()
                ->where('checklist_date', $today)
                ->value('is_checked') ?? false;
            return $task;
        });

        return Inertia::render('Airdrop/Home', [
            'tasks' => $tasks,
            'today' => $today->toDateString(),
        ]);
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
