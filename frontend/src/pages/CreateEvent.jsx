import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';

const CreateEvent = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: '', description: '', date: '', location: ''});
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // Form inputs handle karne ke liye
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // File input handle karne ke liye
    const handleFileChange = (e) => setImageFile(e.target.files[0]);
    
    // Cloudinary par image upload karne ka function
    const uploadImageToCloudinary = async (file) => {
        const data = new FormData();
        data.append("file", file);

        // .env se variables fetch karein
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
        
        // Yahan Cloudinary Dashboard se "Upload Preset" ka naam daalein
        data.append("upload_preset", uploadPreset);
        // Yahan Cloudinary Dashboard se "Cloud Name" daalein
        data.append("cloud_name", cloudName);

        try {
            // Yahan URL mein bhi apna "Cloud Name" replace karein
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: "POST",
                body: data
            });
            const uploadedData = await response.json();
            return uploadedData.secure_url;
        } catch (error) {
            console.error("Cloudinary Upload Error:", error);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = "";
            // 1. Agar user ne image select ki hai, toh pehle Cloudinary pe upload karo
            if (imageFile) {
                toast.loading("Uploading image...", { id: "upload" });
                imageUrl = await uploadImageToCloudinary(imageFile);

                // Agar Cloudinary fail ho jaye toh form yahin rok do
                if (!imageUrl) {
                    toast.error("Image upload failed. Please try again.", { id: "upload" });
                    setLoading(false);
                    return; 
                }
                toast.success("Image uploaded!", { id: "upload" });
            }
            // 2. Ab poora data prepare karo jaisa backend expect kar raha hai
            const eventData = {
                ...formData,
                bannerImage: imageUrl
            };
            // 3. Apne backend API par final data bhejo (Endpoint verify kar lein)
            toast.loading("Creating event...", { id: "create" });
            await axiosInstance.post('/events/create-events', eventData);
            
            toast.success("Event created successfully! Waiting for Admin approval.", { id: "create" });
            navigate('/organizer/dashboard');

        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Failed to create event", { id: "create" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="page-container max-w-4xl">
            <div className="surface-panel p-6 sm:p-9 lg:p-10">
                <p className="eyebrow">Give your idea a stage</p>
                <h1 className="page-title mt-3">Create an event</h1>
                <p className="mb-8 mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Share the details and send your event for review.</p>
    
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="event-title" className="field-label">Event title</label>
                        <input id="event-title" type="text" name="title" required onChange={handleChange} className="input-control" placeholder="e.g. Global Tech Hackathon" />
                    </div>

                    <div>
                        <label htmlFor="event-description" className="field-label">Description</label>
                        <textarea id="event-description" name="description" required rows="5" onChange={handleChange} className="input-control resize-y" placeholder="Tell people what makes your event worth attending..." />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="event-date" className="field-label">Date</label>
                            <input id="event-date" type="date" name="date" required onChange={handleChange} className="input-control" />
                        </div>
                        <div>
                            <label htmlFor="event-location" className="field-label">Location</label>
                            <input id="event-location" type="text" name="location" required onChange={handleChange} className="input-control" placeholder="e.g. New Delhi, India" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="event-banner" className="field-label">Banner image <span className="font-normal text-slate-400">(optional)</span></label>
                        <input id="event-banner" type="file" accept="image/*" onChange={handleFileChange} className="input-control file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-xs file:font-bold file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-400/10 dark:file:text-indigo-300" />
                    </div>

                    <button type="submit" disabled={loading} className="button-primary mt-4 w-full">
                        {loading ? 'Preparing your event...' : 'Submit event for approval'}
                    </button>
                </form>
            </div>
        </main>
    );
};

export default CreateEvent;