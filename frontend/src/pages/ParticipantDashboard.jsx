import { useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/authContextValue';

const ParticipantDashboard = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchBookings = async () => {
        setError('');
        setLoading(true);
        try {
            const response = await axiosInstance.get('/bookings/my-bookings');
            setBookings(response.data.bookings || response.data);
        } catch (error) {
            setError('We could not load your applications right now.');
            toast.error("Failed to load your bookings");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(fetchBookings, 0);
        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <main className="page-container">
            <div className="mb-9">
                <p className="eyebrow">Your event journey</p>
                <h1 className="page-title mt-3">My bookings</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">Hello {user?.name}, here are the events you applied for.</p>
            </div>

            {loading ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((item) => <div key={item} className="surface-panel h-64 animate-pulse" />)}</div>
            ) : error ? (
                <div className="empty-state">
                    <p className="mb-4 text-rose-600 dark:text-rose-300">{error}</p>
                    <button type="button" onClick={fetchBookings} className="button-primary">
                        Try again
                    </button>
                </div>
            ) : bookings.length === 0 ? (
                <div className="empty-state">
                    <p className="text-lg font-semibold text-slate-800 dark:text-white">Your next experience is out there.</p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">You haven&apos;t applied for any events yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {bookings.map((booking) => (
                        <article key={booking._id} className="surface-panel overflow-hidden p-5 transition hover:-translate-y-1">
                            {booking.eventId?.bannerImage && (
                                <img src={booking.eventId.bannerImage} alt={booking.eventId.title} className="mb-5 h-40 w-full rounded-2xl object-cover" />
                            )}
                            <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">{booking.eventId?.title || 'Unknown Event'}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{booking.eventId?.location || 'Location pending'}</p>
                            <p className="mb-5 mt-2 text-sm text-slate-500 dark:text-slate-400">
                                {booking.eventId?.date ? new Date(booking.eventId.date).toLocaleDateString() : 'Date pending'}
                                {' · '}Applied {new Date(booking.createdAt).toLocaleDateString()}
                            </p>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${booking.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300' : booking.status === 'Rejected' ? 'bg-rose-100 text-rose-800 dark:bg-rose-400/10 dark:text-rose-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-400/10 dark:text-amber-300'}`}>
                                    {booking.status}
                                </span>
                                {booking.eventId?._id && (
                                    <a href={`/event/${booking.eventId._id}`} className="text-sm font-bold text-indigo-600 hover:underline dark:text-indigo-300">
                                        View event
                                    </a>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
};

export default ParticipantDashboard;