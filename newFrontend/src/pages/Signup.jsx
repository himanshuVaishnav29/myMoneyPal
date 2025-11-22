import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { SIGN_UP } from '../graphql/mutations/user.mutations';
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const navigate = useNavigate(); 
	const [signUp,{loading,error}]= useMutation(SIGN_UP, {
		refetchQueries: [{ query: GET_AUTHETICATED_USER }],
	});

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
		try{
			// console.log("signdata",signUpData);
      if (!validateForm()) return;

			const { confirmPassword, ...submitData } = signUpData;
			await signUp({
				variables:{
					input:submitData
				}
			})
			toast.success("Sign up successful!");
			navigate("/login");
		}catch(error){
			console.log("error in handleSubmit in signUp",error);
			toast.error(error.message);
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
    <div className="flex flex-col items-center justify-center mt-4 px-6 py-8 mx-auto md:h-full lg:py-0">
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

      <div className="w-full form-Background rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0  dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-3 sm:p-8">
          <h1 className="text-xl font-thin leading-tight tracking-tight text-neutral-100 md:text-2xl mb-6">
            Register Now !
          </h1>
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
              // className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              className='w-full btn'
              disabled={loading}
            >
              {loading?"Loading...":"Register"}
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
        </div>
      </div>
    </div>
  </section>
  )
}

export default Signup