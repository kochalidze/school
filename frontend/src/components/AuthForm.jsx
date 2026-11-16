import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Field from './Field.jsx';
// mode: 'login' | 'register'
export default function AuthForm({ mode, action }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); setError(''); setBusy(true);
    try { await action(form); nav('/'); } catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  return (
    <form className="form-card" onSubmit={submit}>
      <h1>{mode === 'register' ? 'რეგისტრაცია' : 'შესვლა'}</h1>
      {mode === 'register' && <>
        <Field label="სახელი" value={form.firstName} onChange={set('firstName')} required />
        <Field label="გვარი" value={form.lastName} onChange={set('lastName')} required />
      </>}
      <Field label="ელფოსტა" type="email" value={form.email} onChange={set('email')} required />
      <Field label="პაროლი" type="password" minLength={8} value={form.password} onChange={set('password')} required />
      {error && <p className="error">{error}</p>}
      <button className="btn" disabled={busy}>{busy ? '...' : mode === 'register' ? 'რეგისტრაცია' : 'შესვლა'}</button>
    </form>
  );
}
