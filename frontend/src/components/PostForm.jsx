import { useState } from 'react';
import Field from './Field.jsx';
const empty = { title: '', body: '', date: '', location: '' };
export default function PostForm({ kind, initial, onSave, onCancel }) {
  const [f, setF] = useState(initial || empty);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <form className="form-card wide" onSubmit={(e) => { e.preventDefault(); onSave(f); }}>
      <h3>{initial ? 'რედაქტირება' : 'ახლის დამატება'}</h3>
      <Field label="სათაური" value={f.title} onChange={set('title')} required />
      <Field label="თარიღი" type="date" value={(f.date || '').slice(0, 10)} onChange={set('date')} required />
      {kind === 'events' && <Field label="ადგილმდებარეობა" value={f.location || ''} onChange={set('location')} />}
      <Field label="ტექსტი" as="textarea" value={f.body} onChange={set('body')} required />
      <div className="row"><button className="btn">შენახვა</button><button type="button" className="btn btn-ghost" onClick={onCancel}>გაუქმება</button></div>
    </form>
  );
}
