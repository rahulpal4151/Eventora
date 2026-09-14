import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
        <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <h2 className="mb-3 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Verify your email</h2>
                <p className="mb-6 text-center text-sm leading-6 text-gray-600 dark:text-slate-400">
                    Enter the 6-digit code sent to your email address.
                </p>
                <form onSubmit={handleVerify} className="space-y-5">
                    <div>
                        <label htmlFor="verification-email" className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">Email Address</label>
                        <input id="verification-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-cyan-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label htmlFor="verification-otp" className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">Verification Code</label>
                        <input id="verification-otp" type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength="6" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))} required className="w-full rounded-lg border border-gray-300 p-3 text-center text-2xl tracking-[0.35em] outline-none focus:ring-2 focus:ring-cyan-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white" placeholder="000000" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full rounded-lg bg-slate-950 py-3 font-semibold text-white transition hover:bg-cyan-500 hover:text-slate-950 disabled:opacity-70 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300">
                        {loading ? 'Verifying...' : 'Verify email'}
                    </button>
                </form>
                <button type="button" onClick={handleResend} disabled={resending || !email} className="mt-4 w-full text-sm font-semibold text-cyan-600 transition hover:text-cyan-700 disabled:opacity-50 dark:text-cyan-400 dark:hover:text-cyan-300">
                    {resending ? 'Sending...' : 'Resend code'}
                </button>
                <p className="mt-6 text-center text-sm text-gray-600 dark:text-slate-400">
                    Already verified? <Link to="/login" className="font-semibold text-cyan-600 hover:underline dark:text-cyan-400">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default VerifyEmail;
