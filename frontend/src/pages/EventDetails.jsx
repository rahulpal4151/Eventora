import { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { AuthContext } from '../context/authContextValue';
import toast from 'react-hot-toast';

const EventDetails = () => {
    const { id } = useParams(); // URL se event ID nikalna
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [applying, setApplying] = useState(false);

    const fetchEventDetails = useCallback(async () => {
        setError('');
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/events/${id}`);
            setEvent(response.data.event || response.data);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to load event details.');
            toast.error("Failed to load event details");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        const timeoutId = setTimeout(fetchEventDetails, 0);
        return () => clearTimeout(timeoutId);
    }, [fetchEventDetails]);

    // Apply karne ka function
    const handleApply = async () => {
        // Agar user login nahi hai, toh pehle login page par bhejo
        if (!user) {
            toast.error("Please login to apply for this event");
            navigate('/login');
            return;
        }

        // Sirf Participants apply kar sakte hain
        if (user.role !== 'Participant') {
            toast.error("Only participants can apply for events");
            return;
        }

        setApplying(true);
        try {
            // Yahan apna exact booking endpoint daalein
            await axiosInstance.post(`/bookings/apply/${id}`);
            toast.success("Successfully applied for the event!");
            navigate('/participant/dashboard'); // Apply hone ke baad dashboard bhej do
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to apply. You might have already applied.");
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <div className="page-container"><div className="surface-panel h-96 animate-pulse" /></div>;
    if (error) {
        return (
            <div className="page-container text-center">
                <div className="empty-state">
                <p className="mb-4 text-lg text-rose-500">{error}</p>
                <button type="button" onClick={fetchEventDetails} className="button-primary">
                    Try again
                </button>
                </div>
            </div>
        );
    }
    if (!event) return <div className="page-container text-center text-xl text-rose-500">Event not found!</div>;

    return (
        <main className="page-container max-w-5xl">
            <div className="surface-panel overflow-hidden">
                {event.bannerImage ? (
                    <img src={event.bannerImage} alt={event.title} className="h-64 w-full bg-slate-100 object-cover sm:h-80 lg:h-[26rem]" />
                ) : (
                    <div className="event-image-placeholder flex h-64 items-end p-8 text-lg font-semibold text-white sm:h-80 lg:h-[26rem]">An Eventora experience</div>
                )}

                <div className="p-6 sm:p-9 lg:p-12">
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="eyebrow">Featured experience</p>
                            <h1 className="mt-3 min-w-0 break-words text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-5xl">{event.title}</h1>
                        </div>
                        <span className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold ${event.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-400/10 dark:text-amber-300'}`}>
                            {event.status || 'Pending'}
                        </span>
                    </div>

                    <div className="mb-8 flex flex-wrap gap-3 border-b border-slate-200 pb-6 text-slate-600 dark:border-slate-800 dark:text-slate-300">
                        <div className="flex min-w-0 items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/70">
                            <span className="text-lg">📅</span>
                            <span className="font-medium text-sm">{new Date(event.date).toDateString()}</span>
                        </div>
                        <div className="flex min-w-0 items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/70">
                            <span className="text-lg">📍</span>
                            <span className="break-words text-sm font-medium">{event.location}</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="mb-3 text-xl font-bold text-slate-950 dark:text-white">About the event</h2>
                        <p className="whitespace-pre-wrap text-base leading-8 text-slate-600 dark:text-slate-300">{event.description}</p>
                    </div>

                    <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5 text-center dark:border-indigo-400/15 dark:bg-indigo-400/5">
                        {user?.role === 'Organizer' || user?.role === 'SuperAdmin' ? (
                            <p className="text-sm text-slate-600 dark:text-slate-300">You are logged in as {user.role}. Only Participants can apply.</p>
                        ) : (
                            <button 
                                onClick={handleApply}
                                disabled={applying || event.status !== 'Approved'}
                                className="button-primary w-full"
                            >
                                {applying ? 'Applying...' : event.status !== 'Approved' ? 'Event not active' : 'Apply Now'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default EventDetails;