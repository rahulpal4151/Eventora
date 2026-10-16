import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        role: 'Participant' 
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosInstance.post('/auth/register', formData);
            if (response.data.success || response.status === 201) {
                sessionStorage.setItem('verificationEmail', formData.email);
                toast.success("Account created. Check your email for the OTP.");
                navigate('/verify-email');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-layout">
            <aside className="auth-aside">
                <div>
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-xl font-black">E</span>
                    <p className="mt-12 text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">Make room for what’s next</p>
                    <h1 className="mt-4 max-w-md text-5xl font-bold leading-tight tracking-[-0.05em]">Big ideas begin with showing up.</h1>
                    <p className="mt-5 max-w-md leading-7 text-indigo-100/75">Join a growing community of curious people, creative organizers, and future collaborators.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-2xl font-bold">Discover</p><p className="mt-1 text-xs text-indigo-100/70">Find your next event</p></div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-2xl font-bold">Connect</p><p className="mt-1 text-xs text-indigo-100/70">Meet your people</p></div>
                </div>
                <span className="pointer-events-none absolute -bottom-20 -right-12 h-72 w-72 rounded-full border border-white/10" aria-hidden="true" />
            </aside>
            <section className="auth-card">
                <p className="eyebrow">Start something meaningful</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Create your account</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">A few details and you’re in.</p>
                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <div>
                        <label htmlFor="signup-name" className="field-label">Full name</label>
                        <input id="signup-name" type="text" name="name" required autoComplete="name" onChange={handleChange} className="input-control" placeholder="Your name" />
                    </div>
                    <div>
                        <label htmlFor="signup-email" className="field-label">Email address</label>
                        <input id="signup-email" type="email" name="email" required autoComplete="email" onChange={handleChange} className="input-control" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label htmlFor="signup-password" className="field-label">Password</label>
                        <input id="signup-password" type="password" name="password" required autoComplete="new-password" onChange={handleChange} className="input-control" placeholder="Create a password" />
                    </div>
                    <div>
                        <label htmlFor="signup-role" className="field-label">I want to</label>
                        <select id="signup-role" name="role" onChange={handleChange} className="input-control">
                            <option value="Participant">Participant (Attend Events)</option>
                            <option value="Organizer">Organizer (Host Events)</option>
                        </select>
                    </div>
                    <button type="submit" disabled={loading} className="button-primary w-full">
                        {loading ? 'Creating your account...' : 'Create account'}
                    </button>
                </form>
                <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">
                    Already a member? <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-300">Sign in</Link>
                </p>
            </section>
        </main>
    );
};

export default Signup;