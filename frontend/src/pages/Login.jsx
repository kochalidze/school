import AuthForm from '../components/AuthForm.jsx';
import { useAuth } from '../store/authStore.js';
export default function Login() { return <AuthForm mode="login" action={useAuth((s) => s.login)} />; }
