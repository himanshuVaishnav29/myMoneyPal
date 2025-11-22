import React, { useState } from "react";
import { Link ,useNavigate} from 'react-router-dom';
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { FaHome } from "react-icons/fa";
import { LOGIN, REQUEST_PASSWORD_RESET, VERIFY_OTP_AND_RESET_PASSWORD } from "../graphql/mutations/user.mutations";
import { GET_AUTHETICATED_USER } from "../graphql/queries/user.query";

const Login = () => {

  const navigate=useNavigate();
  const [loginData, setLoginData] = useState({
		email: "",
		password: "",
	});

  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
		const { name, value } = e.target;
		setLoginData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	
	const [login, { loading }] = useMutation(LOGIN, {
		refetchQueries: [{ query: GET_AUTHETICATED_USER }],
	});

  const [requestPasswordReset, { loading: resetLoading }] = useMutation(REQUEST_PASSWORD_RESET);
  const [verifyOTPAndResetPassword, { loading: verifyLoading }] = useMutation(VERIFY_OTP_AND_RESET_PASSWORD, {
    refetchQueries: [{ query: GET_AUTHETICATED_USER }],
  });


  const handleSubmit = async (e) => {
		e.preventDefault();
		if (!loginData.email || !loginData.password){
			return toast.error("Please fill in all fields");
		} 
		try {
			console.log("Login Data: ", loginData);
			const response = await login({
				 variables:{
					input: loginData
				}
			});
      if(response?.data?.login){
        navigate("/dashboard");
			  toast.success("Login successful!");
      }else{
        toast.error("Login failed - Invalid credentials");
      }

		} catch (error) {
			console.log("error  in handleSubmit login",error);
			toast.error(error.message);
		}
	};

  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!forgotPasswordData.email) {
      return toast.error("Please enter your email");
    }
    try {
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const response = await requestPasswordReset({
        variables: { 
          email: forgotPasswordData.email,
          timezone: userTimezone
        }
      });
      if (response.data.requestPasswordReset.success) {
        toast.success("OTP sent to your email!");
        setForgotPasswordStep(2);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!forgotPasswordData.otp || !forgotPasswordData.newPassword || !forgotPasswordData.confirmPassword) {
      return toast.error("Please fill in all fields");
    }
    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if(forgotPasswordData.confirmPassword.length<5){
      return toast.error("Password must be at least 5 characters long");
    }
    try {
      const response = await verifyOTPAndResetPassword({
        variables: {
          input: {
            email: forgotPasswordData.email,
            otp: forgotPasswordData.otp,
            newPassword: forgotPasswordData.newPassword
          }
        }
      });
      if (response.data.verifyOTPAndResetPassword) {
        toast.success("Password reset successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resetForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotPasswordStep(1);
    setForgotPasswordData({
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: ""
    });
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
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 ">
        <a
          href=""
          className="flex items-center mb-6 text-3xl font-thin tracking-wide text-neutral-200 hover:text-neutral-100 transition duration-200 ease-in-out "
          style={{ letterSpacing: '0.05em', padding: '10px' }}
        >
          My MoneyPal
        </a>
        <div className='relative mb-10 w-1/2 mx-auto hidden md:block'>
				
          <div className='absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm' />
          <div className='absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4' />
          <div className='absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm' />
          <div className='absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4' />
        </div> 
        <div className="w-full form-Background rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-thin leading-tight tracking-tight text-neutral-100 md:text-2xl dark:text-white">
              {showForgotPassword ? "Reset Password" : "Sign in to your account"}
            </h1>
            {!showForgotPassword ? (
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-neutral-100 "
                >
                  Email
                </label>
                <input
                  id='email'
                  name='email'
                  value={loginData.email}
                  onChange={handleChange}
                  className="form-Background border bg-transparent text-neutral-200 border-gray-300  rounded-lg focus:text-neutral-100 focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="john@gmail.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-neutral-100  "
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="form-Background border border-gray-300 rounded-lg focus:text-neutral-100 focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-primary-600 hover:underline  hover: text-purple-400 cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <button
                type="submit"
                className="w-full btn"
                disabled={loading}
              >
                {loading?"Loading...":"Login"}
              </button>
              <p className="text-sm font-light text-neutral-100 ">
                Don’t have an account yet? {" "}
                <Link
                  to='/signup'
                  className="font-medium text-primary-600 hover:underline  hover: text-purple-400 cursor-pointer"
                >
                  Sign up
                </Link>
              </p>
            </form>
            ) : (
            <div className="space-y-4 md:space-y-6">
              {forgotPasswordStep === 1 ? (
                <form onSubmit={handleRequestReset} className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-100">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={forgotPasswordData.email}
                      onChange={handleForgotPasswordChange}
                      className="form-Background border bg-transparent text-neutral-200 border-gray-300 rounded-lg focus:text-neutral-100 focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full btn"
                    disabled={resetLoading}
                  >
                    {resetLoading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-100">
                      OTP Code
                    </label>
                    <input
                      name="otp"
                      type="text"
                      value={forgotPasswordData.otp}
                      onChange={handleForgotPasswordChange}
                                                                className="form-Background border bg-transparent text-neutral-200 border-gray-300  rounded-lg focus:text-neutral-100 focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"

                      // className="form-Background border bg-transparent text-neutral-200 border-gray-300 rounded-lg focus:text-neutral-100 focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      placeholder="Enter OTP from email"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-100">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        name="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={forgotPasswordData.newPassword}
                        onChange={handleForgotPasswordChange}
                        // className="form-Background border border-gray-300 rounded-lg focus:text-neutral-100 focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10"
                        className="form-Background border bg-transparent text-neutral-200 border-gray-300  rounded-lg focus:text-neutral-100 focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"

                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-200"
                      >
                        {showNewPassword ? (
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
                    <label className="block mb-2 text-sm font-medium text-neutral-100">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={forgotPasswordData.confirmPassword}
                        onChange={handleForgotPasswordChange}
                        // className="form-Background border border-gray-300 rounded-lg focus:text-neutral-100 focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10"
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
                  <button
                    type="submit"
                    className="w-full btn"
                    disabled={verifyLoading}
                  >
                    {verifyLoading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              )}
              <button
                type="button"
                onClick={resetForgotPassword}
                className="w-full text-sm text-neutral-400 hover:text-neutral-200 hover:underline"
              >
                Back to Login
              </button>
            </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
