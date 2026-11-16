import AuthForm from '../components/AuthForm.jsx';
import { useAuth } from '../store/authStore.js';
export default function Register() { 
	return <AuthForm mode="register" action={useAuth((s) => s.register)} />; 
}
