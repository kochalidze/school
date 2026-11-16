import { Link, NavLink, useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';
import { useAuth } from '../store/authStore.js';

export default function Header() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <header className="header">
      <div className="container header-row">
        <Link to="/" className="brand"><Logo /><span>წალკის N2 საჯარო სკოლა</span></Link>
        <nav className="nav">
          <NavLink to="/" end>მთავარი</NavLink>
          {user?.role === 'admin' && <NavLink to="/admin">ადმინი</NavLink>}
          {user ? (
            <button className="link-btn" onClick={async () => { await logout(); nav('/'); }}>გასვლა</button>
          ) : (<><NavLink to="/login">შესვლა</NavLink><NavLink to="/register" className="btn btn-sm">რეგისტრაცია</NavLink></>)}
        </nav>
      </div>
    </header>
  );
}
