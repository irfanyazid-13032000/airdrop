import React, { useState } from 'react';

const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    fontFamily: 'Arial, sans-serif',
  },
  section: {
    marginBottom: '30px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  taskItem: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  taskText: {
    fontSize: '16px',
    color: '#333',
  },
  checkbox: {
    width: '18px',
    height: '18px',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '600',
    color: '#444',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default function Home() {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const [airdrops, setAirdrops] = useState([
    {
      id: 1,
      name: 'Daily Task A',
      type: 'daily',
      started_at: '2025-06-01',
      claim_reward_at: '2025-06-10',
    },
    {
      id: 2,
      name: 'Special Task B',
      type: 'scheduled',
      started_at: '2025-06-03',
      claim_reward_at: '2025-06-03',
    },
  ]);
  const [checklist, setChecklist] = useState({});
  const [name, setName] = useState('');
  const [claimRewardAt, setClaimRewardAt] = useState('');
  const [startedAt, setStartedAt] = useState('');

  const todayTasks = airdrops.filter(
    (item) =>
      item.type === 'daily' ||
      item.claim_reward_at === today
  );

  const handleCheck = (id) => {
    setChecklist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAirdrop = {
      id: airdrops.length + 1,
      name,
      type: 'daily',
      started_at: startedAt,
      claim_reward_at: claimRewardAt,
    };
    setAirdrops([...airdrops, newAirdrop]);
    setName('');
    setClaimRewardAt('');
    setStartedAt('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <h2 style={styles.heading}>📅 Task Hari Ini - {today}</h2>
        {todayTasks.length === 0 ? (
          <p>Tidak ada task untuk hari ini.</p>
        ) : (
          todayTasks.map((task) => (
            <div key={task.id} style={styles.taskItem}>
              <div>
                <div style={styles.taskText}>{task.name}</div>
                <small>
                  Mulai: {task.started_at} | Klaim: {task.claim_reward_at}
                </small>
              </div>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={checklist[task.id] || false}
                onChange={() => handleCheck(task.id)}
              />
            </div>
          ))
        )}
      </div>

      <div style={styles.section}>
        <h2 style={styles.heading}>➕ Tambah Airdrop Baru</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nama Airdrop</label>
            <input
              style={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tanggal Mulai</label>
            <input
              type="date"
              style={styles.input}
              value={startedAt}
              onChange={(e) => setStartedAt(e.target.value)}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tanggal Klaim Hadiah</label>
            <input
              type="date"
              style={styles.input}
              value={claimRewardAt}
              onChange={(e) => setClaimRewardAt(e.target.value)}
              required
            />
          </div>
          <button type="submit" style={styles.button}>
            Simpan Airdrop
          </button>
        </form>
      </div>
    </div>
  );
}
