import React, { useState } from 'react';

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '24px',
  },
  listItem: {
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '12px',
    transition: 'box-shadow 0.3s',
  },
  listItemHover: {
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  subHeading: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '16px',
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
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
};

export default function Home() {
  const [airdrops, setAirdrops] = useState([
    { id: 1, name: 'Airdrop 1', claim_reward_at: '2025-06-05', started_at: '2025-06-01' },
    { id: 2, name: 'Airdrop 2', claim_reward_at: '2025-06-10', started_at: '2025-06-02' },
  ]);

  const [name, setName] = useState('');
  const [claimRewardAt, setClaimRewardAt] = useState('');
  const [startedAt, setStartedAt] = useState('');
  const [hoveredId, setHoveredId] = useState(null);
  const [buttonHover, setButtonHover] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const newAirdrop = {
      id: airdrops.length + 1,
      name,
      claim_reward_at: claimRewardAt,
      started_at: startedAt,
    };
    setAirdrops([...airdrops, newAirdrop]);

    setName('');
    setClaimRewardAt('');
    setStartedAt('');
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Airdrop List</h1>

      <ul style={{ paddingLeft: 0 }}>
        {airdrops.map(({ id, name, claim_reward_at, started_at }) => (
          <li
            key={id}
            style={{
              ...styles.listItem,
              ...(hoveredId === id ? styles.listItemHover : {}),
              listStyle: 'none',
            }}
            onMouseEnter={() => setHoveredId(id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <h2>{name}</h2>
            <p><strong>Claim Reward Date:</strong> {claim_reward_at}</p>
            <p><strong>Started At:</strong> {started_at}</p>
          </li>
        ))}
      </ul>

      <h2 style={styles.subHeading}>Add New Airdrop</h2>

      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label htmlFor="name" style={styles.label}>Name</label>
          <input
            id="name"
            type="text"
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="claimRewardAt" style={styles.label}>Claim Reward Date</label>
          <input
            id="claimRewardAt"
            type="date"
            style={styles.input}
            value={claimRewardAt}
            onChange={(e) => setClaimRewardAt(e.target.value)}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="startedAt" style={styles.label}>Started At</label>
          <input
            id="startedAt"
            type="date"
            style={styles.input}
            value={startedAt}
            onChange={(e) => setStartedAt(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          style={buttonHover ? { ...styles.button, ...styles.buttonHover } : styles.button}
          onMouseEnter={() => setButtonHover(true)}
          onMouseLeave={() => setButtonHover(false)}
        >
          Add Airdrop
        </button>
      </form>
    </div>
  );
}
