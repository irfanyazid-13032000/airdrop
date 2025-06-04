import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';

export default function Home({ initialAirdrops = [] }) {
  const [airdrops, setAirdrops] = useState(initialAirdrops);

  const [name, setName] = useState('');
  const [claimRewardAt, setClaimRewardAt] = useState('');
  const [startedAt, setStartedAt] = useState('');
  const [tasks, setTasks] = useState([{ type: 'daily', description: '', dates: [] }]);

  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode class on body
  useEffect(() => {
    if (darkMode) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  }, [darkMode]);

  const today = new Date().toISOString().split('T')[0];
  const todayTasks = airdrops.filter(
    (d) =>
      d.type === 'daily' ||
      (d.schedules && d.schedules.includes(today))
  );

  // Task management functions (add, remove, update) same as before
  function addTask() {
    setTasks([...tasks, { type: 'daily', description: '', dates: [] }]);
  }

  function removeTask(index) {
    setTasks(tasks.filter((_, i) => i !== index));
  }

  function updateTask(index, field, value) {
    const updated = [...tasks];
    updated[index][field] = value;
    if (field === 'type' && !['weekly', 'monthly'].includes(value)) {
      updated[index].dates = [];
    }
    setTasks(updated);
  }

  function addDate(index) {
    const updated = [...tasks];
    updated[index].dates.push('');
    setTasks(updated);
  }

  function removeDate(taskIndex, dateIndex) {
    const updated = [...tasks];
    updated[taskIndex].dates.splice(dateIndex, 1);
    setTasks(updated);
  }

  function updateDate(taskIndex, dateIndex, value) {
    const updated = [...tasks];
    updated[taskIndex].dates[dateIndex] = value;
    setTasks(updated);
  }

  function validateForm() {
    if (!name.trim()) {
      alert('Nama airdrop wajib diisi');
      return false;
    }
    if (!claimRewardAt) {
      alert('Tanggal claim reward wajib diisi');
      return false;
    }
    if (!startedAt) {
      alert('Tanggal mulai wajib diisi');
      return false;
    }
    if (tasks.length === 0) {
      alert('Minimal harus ada 1 task');
      return false;
    }
    for (const task of tasks) {
      if (!task.type) {
        alert('Tipe task wajib diisi');
        return false;
      }
      if (!task.description.trim()) {
        alert('Deskripsi task wajib diisi');
        return false;
      }
      if (['weekly', 'monthly'].includes(task.type)) {
        if (!task.dates.length) {
          alert('Jadwal tanggal wajib diisi untuk task weekly/monthly');
          return false;
        }
        if (task.dates.some((d) => !d)) {
          alert('Semua jadwal tanggal harus diisi');
          return false;
        }
      }
    }
    return true;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    const dataToSend = {
      name,
      claim_reward_at: claimRewardAt,
      started_at: startedAt,
      tasks,
    };

    console.log('Data dikirim ke server:', dataToSend);

    Inertia.post('/airdrop', dataToSend, {
      onSuccess: (page) => {
        alert('Airdrop berhasil disimpan!');
        if (page.props.airdrops) {
          setAirdrops(page.props.airdrops);
        } else {
          setName('');
          setClaimRewardAt('');
          setStartedAt('');
          setTasks([{ type: 'daily', description: '', dates: [] }]);
        }
      },
      onError: () => {
        alert('Terjadi error saat menyimpan airdrop');
      },
    });
  }

  return (
    <>
      <style>{`
        /* Reset and base */
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f0f2f5;
          color: #050505;
          margin: 0; padding: 0;
        }
        .dark-mode {
          background-color: #18191a;
          color: #e4e6eb;
        }
        h1, h2, h3 {
          font-weight: 700;
        }
        button {
          font-weight: 700;
          border-radius: 6px;
          cursor: pointer;
          border: none;
        }
        label {
          display: block;
          margin-bottom: 6px;
          font-weight: 600;
        }
        input[type="text"], input[type="date"], select, textarea {
          border-radius: 6px;
          border: 1px solid #ddd;
          padding: 8px;
          font-size: 16px;
          width: 100%;
          background-color: #fff;
          color: #050505;
          transition: border-color 0.2s;
        }
        input[type="text"]:focus, input[type="date"]:focus, select:focus, textarea:focus {
          border-color: #1877f2;
          outline: none;
          background-color: #fff;
        }
        .dark-mode input[type="text"], 
        .dark-mode input[type="date"], 
        .dark-mode select, 
        .dark-mode textarea {
          background-color: #3a3b3c;
          border-color: #555;
          color: #e4e6eb;
        }
        .dark-mode input[type="text"]:focus,
        .dark-mode input[type="date"]:focus,
        .dark-mode select:focus,
        .dark-mode textarea:focus {
          border-color: #1877f2;
          background-color: #3a3b3c;
          color: #e4e6eb;
        }
        .container {
          max-width: 720px;
          margin: 40px auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
        }
        .dark-mode .container {
          background-color: #242526;
          box-shadow: 0 2px 12px rgb(0 0 0 / 0.5);
        }
        .btn-primary {
          background-color: #1877f2;
          color: white;
          padding: 12px 20px;
          font-size: 16px;
          font-weight: 700;
          margin-top: 10px;
          transition: background-color 0.3s;
        }
        .btn-primary:hover {
          background-color: #165ec9;
        }
        .btn-danger {
          background-color: #e53935;
          color: white;
          padding: 8px 12px;
          font-weight: 700;
          margin-top: 10px;
          transition: background-color 0.3s;
        }
        .btn-danger:hover {
          background-color: #b02722;
        }
        .btn-success {
          background-color: #42b72a;
          color: white;
          padding: 8px 12px;
          font-weight: 700;
          margin-bottom: 20px;
          transition: background-color 0.3s;
        }
        .btn-success:hover {
          background-color: #368a20;
        }
        .task-card {
          background-color: #f5f6f7;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
        }
        .dark-mode .task-card {
          background-color: #3a3b3c;
          box-shadow: 0 1px 6px rgb(0 0 0 / 0.6);
        }
        .task-dates {
          margin-top: 10px;
        }
        .task-dates input[type="date"] {
          width: auto;
          flex-grow: 1;
        }
        .date-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .toggle-darkmode {
          position: fixed;
          top: 15px;
          right: 15px;
          background-color: #1877f2;
          color: white;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          font-size: 18px;
          font-weight: 700;
          display: flex;
          justify-content: center;
          align-items: center;
          user-select: none;
          cursor: pointer;
          box-shadow: 0 0 10px #1877f2aa;
          transition: background-color 0.3s;
        }
        .toggle-darkmode:hover {
          background-color: #165ec9;
        }
      `}</style>

      <div className="toggle-darkmode" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '☀️' : '🌙'}
      </div>

      <div className="container" style={{ fontWeight: '600' }}>
        <h1 style={{ color: '#1877f2', textAlign: 'center' }}>Airdrop Management</h1>

        <section>
          <h2>To-Do Hari Ini ({today})</h2>
          {todayTasks.length === 0 ? (
            <p>Tidak ada airdrop yang perlu dikerjakan hari ini.</p>
          ) : (
            todayTasks.map(({ id, name, type }) => (
              <div key={id} className="task-card">
                <strong>{name}</strong> <small>({type})</small>
              </div>
            ))
          )}
        </section>

        <section style={{ marginTop: 40 }}>
          <h2>Tambah Airdrop Baru</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 15 }}>
              <label>Nama Airdrop</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: 15 }}>
              <label>Tanggal Claim Reward</label>
              <input
                type="date"
                value={claimRewardAt}
                onChange={(e) => setClaimRewardAt(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: 15 }}>
              <label>Tanggal Mulai</label>
              <input
                type="date"
                value={startedAt}
                onChange={(e) => setStartedAt(e.target.value)}
                required
              />
            </div>

            <hr />

            <h3>Tasks</h3>

            {tasks.map((task, index) => (
              <div key={index} className="task-card">
                <div style={{ marginBottom: 8 }}>
                  <label>Type Task</label>
                  <select
                    value={task.type}
                    onChange={(e) => updateTask(index, 'type', e.target.value)}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div style={{ marginBottom: 8 }}>
                  <label>Description</label>
                  <textarea
                    value={task.description}
                    onChange={(e) => updateTask(index, 'description', e.target.value)}
                    required
                    rows={3}
                  />
                </div>

                {(task.type === 'weekly' || task.type === 'monthly') && (
                  <div className="task-dates">
                    <label>Schedule Dates</label>
                    {task.dates.map((date, i) => (
                      <div key={i} className="date-row">
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => updateDate(index, i, e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removeDate(index, i)}
                          className="btn-danger"
                          style={{ padding: '6px 10px' }}
                        >
                          Hapus
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addDate(index)}
                      className="btn-success"
                    >
                      Tambah Jadwal
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => removeTask(index)}
                  className="btn-danger"
                >
                  Hapus Task
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addTask}
              className="btn-success"
            >
              Tambah Task Baru
            </button>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%' }}
            >
              Simpan Airdrop
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
