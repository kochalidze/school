import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client.js';
import AdminTable from '../components/AdminTable.jsx';
import PostForm from '../components/PostForm.jsx';

const TABS = { news: 'სიახლეები', events: 'ღონისძიებები' };
export default function Admin() {
  const [tab, setTab] = useState('news');
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null); // null | 'new' | item
  const [error, setError] = useState('');
  const load = useCallback(() => api('/' + tab).then(setItems).catch((e) => setError(e.message)), [tab]);
  useEffect(() => { setEditing(null); setError(''); load(); }, [load]);

  const save = async (data) => {
    try {
      if (editing === 'new') await api('/' + tab, { method: 'POST', body: data });
      else await api(`/${tab}/${editing.id}`, { method: 'PUT', body: data });
      setEditing(null); load();
    } catch (e) { setError(e.message); }
  };
  const remove = async (item) => {
    if (!confirm(`წაიშალოს „${item.title}“?`)) return;
    try { await api(`/${tab}/${item.id}`, { method: 'DELETE' }); load(); } catch (e) { setError(e.message); }
  };
  return (
    <div className="container admin">
      <h1>ადმინისტრირება</h1>
      <div className="tabs">{Object.entries(TABS).map(([k, v]) => <button key={k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)}>{v}</button>)}</div>
      {error && <p className="error">{error}</p>}
      {editing ? <PostForm kind={tab} initial={editing === 'new' ? null : editing} onSave={save} onCancel={() => setEditing(null)} />
        : <><button className="btn" onClick={() => setEditing('new')}>+ დამატება</button>
          <AdminTable items={items} onEdit={setEditing} onDelete={remove} /></>}
    </div>
  );
}
