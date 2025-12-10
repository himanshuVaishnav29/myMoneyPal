import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { SIGN_UP, SEND_SIGNUP_OTP, VERIFY_SIGNUP_OTP } from '../graphql/mutations/user.mutations';
import { GET_AUTHETICATED_USER } from '../graphql/queries/user.query';
import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';

const Signup = () => {
  const [signUpData, setSignUpData] = useState({
		email: "",
		fullName: "",
		password: "",
		confirmPassword: "",
		gender: "",
	});
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: form, 2: OTP verification
  const [countdown, setCountdown] = useState(0);

	const navigate = useNavigate(); 
    
    // Note: The SIGN_UP mutation seems unused here as you are using the OTP flow, 
    // but I'll leave it in case you need it later.
	const [signUp,{loading,error}]= useMutation(SIGN_UP, {
		refetchQueries: [{ query: GET_AUTHETICATED_USER }],
	});
    
  const [sendOTP, { loading: otpLoading }] = useMutation(SEND_SIGNUP_OTP);
  const [verifyOTP, { loading: verifyLoading }] = useMutation(VERIFY_SIGNUP_OTP);

  const validateForm = () => {
		const { email, fullName, password, confirmPassword, gender } = signUpData;
		if (!email || !fullName || !password || !confirmPassword || !gender) {
			toast.error("All fields are required.");
			return false;
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			toast.error("Please enter a valid email.");
			return false;
		}
		if (password.length < 5) {
			toast.error("Password must be at least 5 characters long.");
			return false;
		}
		if (password !== confirmPassword) {
			toast.error("Passwords do not match.");
			return false;
		}
		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
        if (!validateForm()) return; // Local validation still needs local toasts

		try {
			await sendOTP({
				variables: { input: signUpData }
			});
			
			toast.success("OTP sent to your email!");
			setStep(2);
			startCountdown();
		} catch (error) {
			// Removed toast.error -> Global Handler in main.jsx catches this
			console.log("Error sending OTP:", error);
		}
	};

  const handleVerifyOTP = async (e) => {
		e.preventDefault();
		try {
			if (!otp || otp.length !== 6) {
				toast.error("Please enter a valid 6-digit OTP");
				return;
			}
			
			await verifyOTP({
				variables: {
					input: { 
						email: signUpData.email, 
						otp, 
						password: signUpData.password 
					}
				}
			});
			
			toast.success("Account created successfully!");
			navigate("/login");
		} catch (error) {
			// Removed toast.error -> Global Handler in main.jsx catches this
			console.log("Error verifying OTP:", error);
		}
	};

	const startCountdown = () => {
		setCountdown(60);
		const timer = setInterval(() => {
			setCountdown(prev => {
				if (prev <= 1) {
					clearInterval(timer);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	};

	const handleResendOTP = async () => {
		try {
			await sendOTP({
				variables: { input: signUpData }
			});
			toast.success("OTP resent!");
			startCountdown();
		} catch (error) {
            // Removed toast.error -> Global Handler in main.jsx catches this
            console.error("Error resending OTP", error);
		}
	};

	const handleChange = (e) => {
		const { name, value, type } = e.target;

		if (type === "radio") {
			setSignUpData((prevData) => ({
				...prevData,
				gender: value,
			}));
		} else {
			setSignUpData((prevData) => ({
				...prevData,
				[name]: value,
			}));
		}
	};

  return (
    <section className="">
      <Link
        to="/"
        className="fixed top-4 left-4 z-10 p-2 sm:p-3 text-neutral-200 hover:text-white 
        border border-neutral-600 rounded-xl hover:border-indigo-500 
        transition-all duration-300 bg-white/5 backdrop-blur-sm"
        title="Back to Home"
      >
        <FaHome size={16} className="sm:w-5 sm:h-5" />
      </Link>
    <div className="flex flex-col items-center justify-center px-4 sm:px-6 py-4 sm:py-8 mx-auto min-h-screen lg:py-0">
        <a
          href=""
          className="flex items-center mb-4 sm:mb-6 text-2xl sm:text-3xl font-thin tracking-wide text-neutral-200 hover:text-neutral-100 transition duration-200 ease-in-out bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          style={{ letterSpacing: '0.05em', padding: '10px' }}
        >
          My MoneyPal
        </a>

        <div className='relative mb-6 sm:mb-10 w-1/2 mx-auto hidden md:block'>
          <div className='absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm' />
          <div className='absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4' />
          <div className='absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm' />
          <div className='absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4' />
        </div> 

      <div className="w-full max-w-sm sm:max-w-md form-Background rounded-lg shadow dark:border xl:p-0 dark:border-gray-700">
        <div className="p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4 md:space-y-3">
          <h1 className="text-lg sm:text-xl md:text-2xl font-thin leading-tight tracking-tight text-neutral-100 mb-4 sm:mb-6 text-center sm:text-left">
            {step === 1 ? "Register Now !" : "Verify Your Email"}
          </h1>
          
          {step === 1 ? (
          <form className="space-y-4 md:space-y-3" onSubmit={handleSubmit}>
          <div>
              <label
                htmlFor="fullName"
                className="block mb-2 text-sm font-medium text-neutral-100"
              >
                Full Name
              </label>
              <input
                id='fullName'
                name='fullName'
                value={signUpData.fullName}
                onChange={handleChange}
                className="form-Background border bg-transparent text-neutral-200 border-gray-300  rounded-lg focus:text-neutral-100 focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Thomas Shelby"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-neutral-100 "
              >
                Your email
              </label>
              <input
                id='email'
                name='email'
                type='email'
                value={signUpData.email}
                onChange={handleChange}
                className="form-Background border bg-transparent text-neutral-200 border-gray-300  rounded-lg focus:text-neutral-100 focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="shelby@gmail.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-neutral-100 "
              >
                Password
              </label>
              <div className="relative">
                <input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  value={signUpData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-Background border bg-transparent text-neutral-200 border-gray-300  rounded-lg focus:text-neutral-100 focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-200"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block mb-2 text-sm font-medium text-neutral-100 "
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id='confirmPassword'
                  name='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={signUpData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-Background border bg-transparent text-neutral-200 border-gray-300  rounded-lg focus:text-neutral-100 focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-200"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
                <span className="block mb-2 text-sm font-medium text-neutral-100 ">
                  Gender
                </span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center ">
                    <input
                      type='radio'
                      id='male'
                      name='gender'
                      value='Male'
                      onChange={handleChange}
                      checked={signUpData.gender === "Male"}
                      className="w-4 h-4 bg-transparent text-neutral-200 border-gray-300 focus:ring-primary-500  hover:cursor-pointer"
                    />
                    <label
                      htmlFor="male"
                      className="ml-2 text-sm font-medium text-neutral-100 hover:cursor-pointer"
                    >
                      Male
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type='radio'
                      id='female'
                      name='gender'
                      value='Female'
                      onChange={handleChange}
                      checked={signUpData.gender === "Female"}
                      className="w-4 h-4  border-gray-300 focus:ring-primary-500  hover:cursor-pointer"
                    />
                    <label
                      htmlFor="female"
                      className="ml-2 text-sm font-medium text-neutral-100 hover:cursor-pointer"
                    >
                      Female
                    </label>
                  </div>
                </div>
              </div>

            <button
              type="submit"
              className='w-full btn py-3 text-sm sm:text-base'
              disabled={otpLoading}
            >
              {otpLoading ? "Let's verify you...." : "Register"}
            </button>
            <p className="text-sm font-light text-neutral-100 ">
              Already have an account?{" "}
              <Link
                to='/login'
                className="font-medium text-primary-600 hover:underline hover: text-purple-400 cursor-pointer"
              >
                Login
              </Link>
            </p>
          </form>
          ) : (
          <form className="space-y-4 md:space-y-3" onSubmit={handleVerifyOTP}>
            <div className="text-center mb-4 sm:mb-6">
              <p className="text-neutral-300 text-xs sm:text-sm mb-2 sm:mb-4 px-2">
                We've sent a 6-digit verification code to
              </p>
              <p className="text-white font-medium text-sm sm:text-base break-all px-2">{signUpData.email}</p>
            </div>
            
            <div>
              <label htmlFor="otp" className="block mb-2 text-xs sm:text-sm font-medium text-neutral-100">
                Verification Code
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="form-Background border bg-transparent text-neutral-200 border-gray-300 rounded-lg focus:text-neutral-100 focus:ring-primary-600 focus:border-primary-600 block w-full p-3 sm:p-2.5 text-center text-xl sm:text-2xl tracking-widest"
                placeholder="000000"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={verifyLoading}
              className="w-full btn disabled:opacity-50 py-3 text-sm sm:text-base"
            >
              {verifyLoading ? "Verifying..." : "Verify & Create Account"}
            </button>
            
            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-neutral-400 text-xs sm:text-sm">
                  Resend code in {countdown}s
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={otpLoading}
                  className="px-4 py-2 text-xs sm:text-sm text-indigo-400 hover:text-indigo-300 border border-indigo-400 hover:border-indigo-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {otpLoading ? "Sending..." : "Resend Code"}
                </button>
              )}
            </div>
            
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-neutral-400 hover:text-white text-xs sm:text-sm underline py-2"
            >
              ← Back to registration
            </button>
          </form>
          )}
        </div>
      </div>
    </div>
  </section>
  )
}

export default Signup