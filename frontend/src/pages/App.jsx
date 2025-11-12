import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Login from '../ui/Login'
import Dashboard from '../ui/Dashboard'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('tt_token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('tt_user')||'null'));

  useEffect(() => {
    if(token) axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  }, [token]);

  if(!token) return <Login onLogin={(t,u)=>{ setToken(t); setUser(u); localStorage.setItem('tt_token', t); localStorage.setItem('tt_user', JSON.stringify(u)); }} />

  return <Dashboard user={user} onLogout={() => { setToken(null); setUser(null); localStorage.removeItem('tt_token'); localStorage.removeItem('tt_user'); }} apiUrl={API} />
}
