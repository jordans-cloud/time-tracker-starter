import React, { useState } from 'react';
import logo from './assets/arbor-nature-logo.png';

function Dashboard() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [users, setUsers] = useState([]);

  const handleAddUser = (e) => {
    e.preventDefault();
    setUsers([...users, { name, email, role }]);
    setName(''); setEmail(''); setRole('');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <img src={logo} alt="Arbor Nature Logo" style={{ maxWidth: '300px', marginTop: '20px' }} />
      <h1>Time Tracker Dashboard</h1>

      <form onSubmit={handleAddUser} style={{ marginTop: '30px' }}>
        <h2>Add User</h2>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }} />
        <input placeholder="Role" value={role} onChange={e => setRole(e.target.value)} required style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }} />
        <button type="submit" style={{ padding: '10px 20px' }}>Add User</button>
      </form>

      <div style={{ marginTop: '40px', textAlign: 'left' }}>
        <h2>Users</h2>
        {users.length === 0 ? <p>No users yet.</p> : <ul>{users.map((user, i) => <li key={i}>{user.name} ({user.email}) - {user.role}</li>)}</ul>}
      </div>
    </div>
  );
}

export default Dashboard;
