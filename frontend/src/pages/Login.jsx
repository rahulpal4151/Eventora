import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';
import { AuthContext } from '../context/authContextValue';

const Login = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Apna exact login endpoint yahan verify karein (e.g., /auth/login)
            const response = await axiosInstance.post('/auth/login', formData);
            
            if (response.data.success || response.status === 200) {
                const loggedInUser = response.data.user;
                
                // Context update karna (ye automatically localStorage me save ho jayega)
                setUser(loggedInUser); 
                toast.success(`Welcome back, ${loggedInUser.name}!`);

                // Role ke hisaab se sahi dashboard par bhejna
                if (loggedInUser.role === 'SuperAdmin') navigate('/admin/dashboard');
                else if (loggedInUser.role === 'Organizer') navigate('/organizer/dashboard');
                else navigate('/participant/dashboard');
            }
        } catch (error) {
            if (error.response?.data?.code === 'EMAIL_NOT_VERIFIED') {
                sessionStorage.setItem('verificationEmail', formData.email);
                toast.error('Please verify your email before logging in.');
                navigate('/verify-email');
                return;
            }
            toast.error(error.response?.data?.message || "Invalid credentials. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-layout">
            <aside className="auth-aside">
                <div>
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-xl font-black">E</span>
                    <p className="mt-12 text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">Welcome back to Eventora</p>
                    <h1 className="mt-4 max-w-md text-5xl font-bold leading-tight tracking-[-0.05em]">Your next great experience is waiting.</h1>
                    <p className="mt-5 max-w-md leading-7 text-indigo-100/75">Sign in to find your community, manage your events, and keep every opportunity in reach.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                    <p className="text-sm font-semibold text-white">One place for every possibility.</p>
                    <p className="mt-2 text-sm leading-6 text-indigo-100/70">Discover events, connect with people, and make your next idea count.</p>
                </div>
                <span className="pointer-events-none absolute -bottom-20 -right-12 h-72 w-72 rounded-full border border-white/10" aria-hidden="true" />
            </aside>
            <section className="auth-card">
                <p className="eyebrow">Your community is here</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Welcome back</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Sign in to continue where you left off.</p>
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                        <label htmlFor="login-email" className="field-label">Email address</label>
                        <input id="login-email" type="email" name="email" required autoComplete="email" onChange={handleChange} className="input-control" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label htmlFor="login-password" className="field-label">Password</label>
                        <input id="login-password" type="password" name="password" required autoComplete="current-password" onChange={handleChange} className="input-control" placeholder="Enter your password" />
                    </div>
                    <button type="submit" disabled={loading} className="button-primary w-full">
                        {loading ? 'Signing in...' : 'Sign in to Eventora'}
                    </button>
                </form>
                <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">
                    New to Eventora? <Link to="/signup" className="font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-300">Create an account</Link>
                </p>
            </section>
        </main>
    );
};

export default Login;