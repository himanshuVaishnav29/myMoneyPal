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
    const { user, loading, updateUser, refreshUser } = useUser();
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

        console.log('File selected:', file);

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
            console.log('Starting upload...');
            const { data } = await uploadProfileImage({
                variables: { file }
            });
            console.log('Upload response:', data);
            await updateUser({ profilePicture: data.uploadProfileImage.url });
            toast.success(data.uploadProfileImage.message);
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image: ' + error.message);
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
            toast.error(error.message);
        }
    };

    const handleNameCancel = () => {
        setTempName(user.fullName);
        setIsEditingName(false);
    };



    if (loading) return <LoadingSkeleton />;

    return (
        <div className="min-h-screen p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">My Profile</h1>
                </div>
                
                <div className="max-w-2xl mx-auto">
                    {/* Profile Information Card */}
                    <div className="form-Background p-4 md:p-6 rounded-lg mb-6">
                        <div className="flex items-center mb-6">
                            <FaUser className="text-pink-500 mr-3" />
                            <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                        </div>
                        
                        <div className="space-y-6">
                            {/* Profile Picture */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="relative">
                                    <img
                                        src={user?.profilePicture || '/default-avatar.png'}
                                        alt="Profile"
                                        className="w-24 h-24 rounded-full object-cover border-4 border-pink-500"
                                    />
                                    <label className="absolute bottom-0 right-0 bg-pink-500 p-2 rounded-full cursor-pointer hover:bg-pink-600 transition-colors">
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
                                {uploading && <p className="text-pink-500 text-sm mt-2">Uploading...</p>}
                            </div>

                            {/* Full Name */}
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Full Name
                                </label>
                                {isEditingName ? (
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                        <input
                                            type="text"
                                            value={tempName}
                                            onChange={(e) => setTempName(e.target.value)}
                                            className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                            autoFocus
                                        />
                                        <div className="flex space-x-2">
                                            <button
                                                type="button"
                                                onClick={handleNameSave}
                                                className="flex-1 sm:flex-none p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                <FaCheck />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleNameCancel}
                                                className="flex-1 sm:flex-none p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={user?.fullName || ''}
                                            className="w-full px-4 py-3 pr-12 bg-gray-600 text-gray-300 rounded-lg cursor-not-allowed"
                                            disabled
                                        />
                                        <button
                                            type="button"
                                            onClick={handleNameEdit}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pink-500 hover:text-pink-400 transition-colors"
                                        >
                                            <FaEdit className="text-sm md:text-base" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Email (Read-only) */}
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    className="w-full px-4 py-3 bg-gray-600 text-gray-300 rounded-lg cursor-not-allowed"
                                    disabled
                                />
                            </div>

                            {/* Gender (Read-only) */}
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Gender
                                </label>
                                <input
                                    type="text"
                                    value={user?.gender || ''}
                                    className="w-full px-4 py-3 bg-gray-600 text-gray-300 rounded-lg cursor-not-allowed"
                                    disabled
                                />
                            </div>

                        </div>
                    </div>

                    {/* Change Password Card */}
                    <div className="form-Background p-4 md:p-6 rounded-lg">
                        <div className="flex items-center mb-6">
                            <FaLock className="text-pink-500 mr-3" />
                            <h2 className="text-xl font-semibold text-white">Password Settings</h2>
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-4">
                            Keep your account secure by updating your password regularly.
                        </p>
                        
                        <button
                            onClick={() => navigate('/change-password')}
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 text-sm sm:text-base"
                        >
                            Change Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;