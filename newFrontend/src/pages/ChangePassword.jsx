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
            console.error("Error requesting OTP:", error);
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
            console.error("Error resetting password:", error);
        } finally {
            setLoading(false);
        }
    };

    // Shared Styles
    const inputClasses = "w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/50 placeholder-gray-500 transition-all font-light tracking-wide";

    return (
        <div className="min-h-screen bg-[#080312] p-6 text-white relative overflow-hidden flex items-center justify-center">
            
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_60%)] pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10">
                
                {/* Header with Back Button */}
                <div className="flex items-center mb-8">
                    <button
                        onClick={() => navigate('/dashboard/profile')}
                        className="group p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 mr-4 transition-all"
                        title="Back to Profile"
                    >
                        <FaArrowLeft size={16} className="text-neutral-400 group-hover:text-white transition-colors" />
                    </button>
                    <h1 className="text-2xl font-thin tracking-wide text-white">Change Password</h1>
                </div>

                {/* Main Card */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 sm:p-8 rounded-2xl shadow-xl">
                    <div className="flex items-center mb-8 pb-4 border-b border-white/10">
                        <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20 mr-3">
                            <FaLock className="text-pink-400 text-lg" />
                        </div>
                        <h2 className="text-lg font-light text-white tracking-wide">
                            {step === 1 ? 'Security Verification' : 'Set New Password'}
                        </h2>
                    </div>

                    {step === 1 ? (
                        <div className="space-y-6">
                            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                                <p className="text-neutral-300 text-sm font-light leading-relaxed">
                                    To secure your account, we need to verify your identity. We will send a One-Time Password (OTP) to:
                                </p>
                                <p className="text-indigo-300 font-medium mt-2 break-all">{user?.email}</p>
                            </div>
                            
                            <button
                                onClick={handleRequestOTP}
                                disabled={loading}
                                className="w-full btn py-3 text-sm tracking-wide"
                            >
                                {loading ? 'Sending OTP...' : 'Send OTP Code'}
                            </button>
                        </div>
                    ) : (
                        <form 
                            onSubmit={handlePasswordReset} 
                            className="space-y-5"
                            // Prevent browser autofill settings
                            autoComplete="off" 
                        >
                            {/* Hidden inputs to trick aggressive browser autofill */}
                            <input type="text" style={{display: 'none'}} />
                            <input type="password" style={{display: 'none'}} />

                            <div>
                                <label className="block text-neutral-300 text-xs uppercase tracking-wider font-medium mb-2 pl-1">
                                    Enter OTP
                                </label>
                                <input
                                    type="text"
                                    name="otp_code_field"
                                    value={formData.otp}
                                    onChange={(e) => setFormData(prev => ({ ...prev, otp: e.target.value }))}
                                    className={`${inputClasses} text-center tracking-[0.5em] text-lg`}
                                    placeholder="000000"
                                    maxLength="6"
                                    required
                                    autoComplete="one-time-code" // Explicitly tells browser this is an OTP
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-neutral-300 text-xs uppercase tracking-wider font-medium mb-2 pl-1">
                                    New Password
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="new_password_field"
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                                    className={`${inputClasses} pr-12`}
                                    placeholder="••••••••"
                                    required
                                    minLength="5"
                                    autoComplete="new-password" // Prevents autofilling existing password
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-[2.2rem] text-neutral-500 hover:text-white transition-colors p-1"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>

                            <div className="relative">
                                <label className="block text-neutral-300 text-xs uppercase tracking-wider font-medium mb-2 pl-1">
                                    Confirm New Password
                                </label>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirm_new_password_field"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className={`${inputClasses} pr-12`}
                                    placeholder="••••••••"
                                    required
                                    minLength="5"
                                    autoComplete="new-password" // Prevents autofilling existing password
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-[2.2rem] text-neutral-500 hover:text-white transition-colors p-1"
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 px-4 py-3 bg-white/5 text-neutral-300 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all text-sm font-medium"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 btn py-3 text-sm tracking-wide"
                                >
                                    {loading ? 'Updating...' : 'Update Password'}
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