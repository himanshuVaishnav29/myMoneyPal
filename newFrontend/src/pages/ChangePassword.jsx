import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { REQUEST_PASSWORD_RESET, VERIFY_OTP_AND_RESET_PASSWORD } from '../graphql/mutations/user.mutations';
import { toast } from 'react-hot-toast';
import { FaLock, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ChangePassword = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [requestPasswordReset] = useMutation(REQUEST_PASSWORD_RESET);
    const [verifyOTPAndResetPassword] = useMutation(VERIFY_OTP_AND_RESET_PASSWORD);

    const [step, setStep] = useState(1); // 1: Request OTP, 2: Enter OTP & New Password
    const [formData, setFormData] = useState({
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRequestOTP = async () => {
        setLoading(true);
        try {
            await requestPasswordReset({
                variables: { email: user.email }
            });
            setStep(2);
            toast.success('OTP sent to your email!');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (formData.newPassword.length < 5) {
            toast.error('Password must be at least 5 characters long');
            return;
        }

        setLoading(true);
        try {
            await verifyOTPAndResetPassword({
                variables: {
                    input: {
                        email: user.email,
                        otp: formData.otp,
                        newPassword: formData.newPassword
                    }
                }
            });
            toast.success('Password changed successfully!');
            navigate('/dashboard/profile');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-md mx-auto">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate('/dashboard/profile')}
                        className="text-pink-500 hover:text-pink-400 mr-4"
                    >
                        <FaArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-white">Change Password</h1>
                </div>

                <div className="form-Background p-6 rounded-lg">
                    <div className="flex items-center mb-6">
                        <FaLock className="text-pink-500 mr-3" />
                        <h2 className="text-xl font-semibold text-white">
                            {step === 1 ? 'Request OTP' : 'Enter New Password'}
                        </h2>
                    </div>

                    {step === 1 ? (
                        <div className="space-y-4">
                            <p className="text-gray-300 text-sm">
                                We'll send an OTP to your registered email address: <strong>{user?.email}</strong>
                            </p>
                            <button
                                onClick={handleRequestOTP}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
                            >
                                {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handlePasswordReset} className="space-y-4">
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Enter OTP
                                </label>
                                <input
                                    type="text"
                                    value={formData.otp}
                                    onChange={(e) => setFormData(prev => ({ ...prev, otp: e.target.value }))}
                                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="Enter 6-digit OTP"
                                    maxLength="6"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-white text-sm font-medium mb-2">
                                    New Password
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 pr-12"
                                    required
                                    minLength="5"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-10 text-gray-400 hover:text-white"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>

                            <div className="relative">
                                <label className="block text-white text-sm font-medium mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 pr-12"
                                    required
                                    minLength="5"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-10 text-gray-400 hover:text-white"
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>

                            <div className="flex space-x-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
                                >
                                    {loading ? 'Updating...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;