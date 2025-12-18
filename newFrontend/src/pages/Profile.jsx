import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_PROFILE, UPLOAD_PROFILE_IMAGE } from '../graphql/mutations/user.mutations';
import { toast } from 'react-hot-toast';
import { FaUser, FaCamera, FaLock, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import LoadingSkeleton from '../components/Skeletons/LoadingSkeleton';

const Profile = () => {
    const navigate = useNavigate();
    const { user, loading, updateUser } = useUser();
    const [updateProfile] = useMutation(UPDATE_PROFILE);
    const [uploadProfileImage] = useMutation(UPLOAD_PROFILE_IMAGE);

    const [formData, setFormData] = useState({
        fullName: ''
    });
    const [uploading, setUploading] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState('');

    React.useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || ''
            });
            setTempName(user.fullName || '');
        }
    }, [user]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        setUploading(true);
        try {
            const { data } = await uploadProfileImage({
                variables: { file }
            });
            await updateUser({ profilePicture: data.uploadProfileImage.url });
            toast.success(data.uploadProfileImage.message);
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleNameEdit = () => {
        setIsEditingName(true);
        setTempName(user.fullName);
    };

    const handleNameSave = async () => {
        try {
            const { data } = await updateProfile({
                variables: { input: { fullName: tempName } }
            });
            await updateUser(data.updateProfile);
            setIsEditingName(false);
            toast.success('Name updated successfully!');
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handleNameCancel = () => {
        setTempName(user.fullName);
        setIsEditingName(false);
    };

    // Strict Landing Page Theme Styles
    const inputClasses = "w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/50 placeholder-gray-500 transition-all font-light tracking-wide";
    const disabledInputClasses = "w-full px-4 py-3 bg-white/5 border border-white/5 text-neutral-400 rounded-xl cursor-not-allowed font-light";

    if (loading) return <LoadingSkeleton />;

    return (
        // Added bg-[#080312] to match Landing/Login pages
        <div className="min-h-screen bg-space-dark p-4 md:p-6 text-white relative overflow-hidden">
            
            {/* Added Radial Gradient Glow to match Landing/Login */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_60%)] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-thin tracking-wide bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 inline-block text-transparent bg-clip-text">
                        My Profile
                    </h1>
                    <p className="text-neutral-400 text-sm mt-2 font-light">Manage your account settings and preferences</p>
                </div>
                
                <div className="max-w-2xl mx-auto space-y-6">
                    {/* Profile Information Card */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 sm:p-8 rounded-2xl shadow-xl">
                        <div className="flex items-center mb-8 pb-4 border-b border-white/10">
                            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 mr-3">
                                <FaUser className="text-indigo-400 text-lg" />
                            </div>
                            <h2 className="text-xl font-light text-white tracking-wide">Profile Information</h2>
                        </div>
                        
                        <div className="space-y-8">
                            {/* Profile Picture Section */}
                            <div className="flex flex-col items-center">
                                <div className="relative group">
                                    {/* Gradient Border Ring */}
                                    <div className="w-32 h-32 rounded-full p-[2px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                                        <img
                                            src={user?.profilePicture || '/default-avatar.png'}
                                            alt="Profile"
                                            className="w-full h-full rounded-full object-cover border-4 border-[#080312]"
                                        />
                                    </div>
                                    
                                    {/* Edit Button */}
                                    <label className="absolute bottom-1 right-1 bg-indigo-600 p-2.5 rounded-full cursor-pointer hover:bg-indigo-500 transition-all shadow-lg hover:scale-110 border border-[#080312]">
                                        <FaCamera className="text-white text-sm" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>
                                {uploading && (
                                    <div className="mt-3 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                                        <p className="text-indigo-400 text-xs font-light tracking-wide">Uploading...</p>
                                    </div>
                                )}
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-5">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-neutral-300 text-xs uppercase tracking-wider font-medium mb-2 pl-1">
                                        Full Name
                                    </label>
                                    {isEditingName ? (
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <input
                                                type="text"
                                                value={tempName}
                                                onChange={(e) => setTempName(e.target.value)}
                                                className={inputClasses}
                                                autoFocus
                                            />
                                            <div className="flex gap-2 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={handleNameSave}
                                                    className="px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/50 rounded-xl hover:bg-indigo-500/20 transition-all flex items-center justify-center"
                                                    title="Save"
                                                >
                                                    <FaCheck />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleNameCancel}
                                                    className="px-4 py-2 bg-white/5 text-neutral-400 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all flex items-center justify-center"
                                                    title="Cancel"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                value={user?.fullName || ''}
                                                className={`${disabledInputClasses} text-neutral-200`}
                                                disabled
                                            />
                                            <button
                                                type="button"
                                                onClick={handleNameEdit}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-500 hover:text-indigo-400 transition-colors p-2"
                                                title="Edit Name"
                                            >
                                                <FaEdit className="text-lg" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Email (Read-only) */}
                                <div>
                                    <label className="block text-neutral-300 text-xs uppercase tracking-wider font-medium mb-2 pl-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        className={disabledInputClasses}
                                        disabled
                                    />
                                </div>

                                {/* Gender (Read-only) */}
                                <div>
                                    <label className="block text-neutral-300 text-xs uppercase tracking-wider font-medium mb-2 pl-1">
                                        Gender
                                    </label>
                                    <input
                                        type="text"
                                        value={user?.gender || ''}
                                        className={disabledInputClasses}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Card */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl shadow-xl">
                        <div className="flex items-center mb-4 border-b border-white/10 pb-4">
                            <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20 mr-3">
                                <FaLock className="text-pink-400 text-lg" />
                            </div>
                            <h2 className="text-xl font-light text-white tracking-wide">Security</h2>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                            <p className="text-neutral-400 text-sm font-light">
                                Ensure your account is secure by using a strong password.
                            </p>
                            
                            <button
                                onClick={() => navigate('/dashboard/change-password')}
                                className="w-auto btn"
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;