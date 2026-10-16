import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState(() => sessionStorage.getItem('verificationEmail') || '');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    const handleVerify = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            await axiosInstance.post('/auth/verify-email', { email, otp });
            sessionStorage.removeItem('verificationEmail');
            toast.success('Email verified successfully. You can now log in.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Verification failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        try {
            await axiosInstance.post('/auth/resend-verification', { email });
            toast.success('A new OTP has been sent to your email.');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Could not resend OTP.');
        } finally {
            setResending(false);
        }
    };

    return (
        <main className="flex min-h-[75vh] items-center justify-center px-4 py-10">
            <section className="auth-card">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300"><MailCheck size={24} /></div>
                <p className="eyebrow text-center">One last step</p>
                <h2 className="mb-3 mt-2 text-center text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Verify your email</h2>
                <p className="mb-6 text-center text-sm leading-6 text-slate-600 dark:text-slate-400">
                    Enter the 6-digit code sent to your email address.
                </p>
                <form onSubmit={handleVerify} className="space-y-5">
                    <div>
                        <label htmlFor="verification-email" className="field-label">Email address</label>
                        <input id="verification-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="input-control" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label htmlFor="verification-otp" className="field-label">Verification code</label>
                        <input id="verification-otp" type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength="6" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))} required className="input-control text-center text-2xl tracking-[0.35em]" placeholder="000000" />
                    </div>
                    <button type="submit" disabled={loading} className="button-primary w-full">
                        {loading ? 'Verifying...' : 'Verify email'}
                    </button>
                </form>
                <button type="button" onClick={handleResend} disabled={resending || !email} className="mt-4 w-full text-sm font-semibold text-indigo-600 transition hover:text-indigo-700 disabled:opacity-50 dark:text-indigo-300">
                    {resending ? 'Sending...' : 'Resend code'}
                </button>
                <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                    Already verified? <Link to="/login" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-300">Log in</Link>
                </p>
            </section>
        </main>
    );
};

export default VerifyEmail;
