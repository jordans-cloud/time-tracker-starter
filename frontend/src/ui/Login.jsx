import React, { useState } from 'react'
import axios from 'axios'

export default function Login({ onLogin }){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  async function submit(e){
    e.preventDefault();
    try{
      const res = await axios.post('http://localhost:4000/api/auth/login', { email, password });
      onLogin(res.data.token, res.data.user);
    }catch(e){
      setErr(e?.response?.data?.error || 'Login failed');
    }
  }

  return (
    <div className="center">
      <h2>Time Tracker — Login</h2>
      <form onSubmit={submit}>
        <div><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
        <div><input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
        <div><button>Login</button></div>
        {err && <div className="err">{err}</div>}
      </form>
      <p>Tip: create an admin via backend /api/auth/signup or create an employee in DB.</p>
    </div>
  )
}
