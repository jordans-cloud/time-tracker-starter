import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Dashboard({ user, onLogout }) {
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ categoryId: '', notes: '', lat: '', lng: '' });

  useEffect(()=>{ fetchEmployees(); fetchCategories(); fetchEntries(); }, []);

  async function fetchEmployees(){
    const res = await axios.get('http://localhost:4000/api/employees');
    setEmployees(res.data);
  }
  async function fetchCategories(){
    const res = await axios.get('http://localhost:4000/api/categories');
    setCategories(res.data);
  }
  async function fetchEntries(){
    const res = await axios.get('http://localhost:4000/api/entries');
    setEntries(res.data);
  }
  async function clockIn(){
    await axios.post('http://localhost:4000/api/entries', { notes: form.notes, categoryId: form.categoryId || null, lat: form.lat || null, lng: form.lng || null });
    fetchEntries();
  }
  return (
    <div className="app">
      <header>
        <h1>Time Tracker</h1>
        <div>
          <strong>{user?.name}</strong> (<em>{user?.role}</em>) <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      <section className="panel">
        <h3>Quick Clock-In</h3>
        <label>Category
          <select value={form.categoryId} onChange={e=>setForm({...form, categoryId: e.target.value})}>
            <option value="">-- none --</option>
            {categories.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label>Notes
          <input value={form.notes} onChange={e=>setForm({...form, notes: e.target.value})} />
        </label>
        <label>Lat
          <input value={form.lat} onChange={e=>setForm({...form, lat: e.target.value})} />
        </label>
        <label>Lng
          <input value={form.lng} onChange={e=>setForm({...form, lng: e.target.value})} />
        </label>
        <div><button onClick={clockIn}>Clock In (create entry with now)</button></div>
      </section>

      <section className="panel">
        <h3>Employees</h3>
        <ul>
          {employees.map(emp => <li key={emp.id}>{emp.name} — {emp.email} — {emp.role}</li>)}
        </ul>
      </section>

      <section className="panel">
        <h3>Recent Entries</h3>
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Category</th><th>ClockIn</th><th>Notes</th></tr></thead>
          <tbody>
            {entries.map(en => <tr key={en.id}><td>{en.id}</td><td>{en.employee?.name}</td><td>{en.category?.name}</td><td>{new Date(en.clockIn).toLocaleString()}</td><td>{en.notes}</td></tr>)}
          </tbody>
        </table>
      </section>
    </div>
  )
}
