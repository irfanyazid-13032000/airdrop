import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

const styles = {
  container: {
    maxWidth: '700px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
    fontFamily: 'sans-serif',
  },
  section: {
    marginBottom: '30px',
  },
  heading: {
    fontSize: '26px',
    marginBottom: '20px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subHeading: {
    fontSize: '20px',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  listItem: {
    backgroundColor: '#fff',
    padding: '14px 18px',
    borderRadius: '8px',
    marginBottom: '10px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
  },
  formGroup: {
    marginBottom: '14px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  select: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    padding: '10px 16px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: '#fff',
    marginRight: '10px',
  },
  removeBtn: {
    backgroundColor: '#dc3545',
    marginTop: '8px',
  },
};

export default function Home({ initialAirdrops = [] }) {
  const [airdrops, setAirdrops] = useState(initialAirdrops);
  const [name, setName] = useState('');
  const [claimRewardAt, setClaimRewardAt] = useState('');
  const [startedAt, setStartedAt] = useState('');
  const [type, setType] = useState('daily');
  const [schedules, setSchedules] = useState([]);

  const today = new Date().toISOString().split('T')[0];
  const todayTasks = airdrops.filter(
    (d) => d.type === 'daily' || (d.schedules && d.schedules.includes(today))
  );

  function handleAddSchedule() {
    setSchedules([...schedules, '']);
  }

  function handleRemoveSchedule(index) {
    setSchedules(schedules.filter((_, i) => i !== index));
  }

  function handleScheduleChange(index, value) {
    const updated = [...schedules];
    updated[index] = value;
    setSchedules(updated);
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
    if ((type === 'weekly' || type === 'monthly') && schedules.length === 0) {
      alert('Jadwal garap harus diisi untuk tipe weekly atau monthly');
      return false;
    }
    if ((type === 'weekly' || type === 'monthly') && schedules.some((d) => !d)) {
      alert('Semua jadwal garap harus diisi');
      return false;
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
    tasks: [
      {
        type,
        description: '', // atau tambahkan form input jika perlu
        dates: type === 'daily' ? [] : schedules,
      },
    ],
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
        setType('daily');
        setSchedules([]);
      }
    },
    onError: (errors) => {
      alert('Terjadi error saat menyimpan airdrop');
      console.error(errors);
    },
  });
}


  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Airdrop Management</h1>

      <section style={styles.section}>
        <h2 style={styles.subHeading}>To-Do Hari Ini ({today})</h2>
        {todayTasks.length === 0 ? (
          <p>Tidak ada airdrop yang perlu dikerjakan hari ini.</p>
        ) : (
          todayTasks.map(({ id, name, type }) => (
            <div key={id} style={styles.listItem}>
              <strong>{name}</strong> <span>({type})</span>
            </div>
          ))
        )}
      </section>

      <section style={styles.section}>
        <h2 style={styles.subHeading}>Tambah Airdrop Baru</h2>
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
            <label style={styles.label}>Tanggal Claim Reward</label>
            <input
              type="date"
              style={styles.input}
              value={claimRewardAt}
              onChange={(e) => setClaimRewardAt(e.target.value)}
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
            <label style={styles.label}>Jenis Airdrop</label>
            <select
              style={styles.select}
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {(type === 'weekly' || type === 'monthly') && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Jadwal Garap</label>
              {schedules.map((date, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <input
                    type="date"
                    value={date}
                    style={styles.input}
                    onChange={(e) => handleScheduleChange(index, e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    style={{ ...styles.button, ...styles.removeBtn }}
                    onClick={() => handleRemoveSchedule(index)}
                  >
                    Hapus
                  </button>
                </div>
              ))}
              <button
                type="button"
                style={styles.button}
                onClick={handleAddSchedule}
              >
                +
              </button>
            </div>
          )}

          <button type="submit" style={styles.button}>
            Simpan Airdrop
          </button>
        </form>
      </section>
    </div>
  );
}
