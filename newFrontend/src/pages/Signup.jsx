import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { SIGN_UP } from '../graphql/mutations/user.mutations';
import { GET_AUTHETICATED_USER } from '../graphql/queries/user.query';
import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
const Signup = () => {

  const [signUpData, setSignUpData] = useState({
		email: "",
		fullName: "",
		password: "",
		gender: "",
	});

	const navigate = useNavigate(); 
	const [signUp,{loading,error}]= useMutation(SIGN_UP, {
		refetchQueries: [{ query: GET_AUTHETICATED_USER }],
	});

  const validateForm = () => {
		const { email, fullName, password, gender } = signUpData;
		if (!email || !fullName || !password || !gender) {
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
		return true;
	};


	const handleSubmit = async (e) => {
		e.preventDefault();
		try{
			// console.log("signdata",signUpData);
      if (!validateForm()) return;

			await signUp({
				variables:{
					input:signUpData
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

      <div className="w-full form-Background rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
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
                className="bg-transparent text-neutral-200 border border-gray-300  rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
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
                className=" border border-gray-300 bg-transparent text-neutral-200 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
              <input
                id='password'
                name='password'
                type='password'
                value={signUpData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className=" border border-gray-300 bg-transparent text-neutral-200 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required
              />
            </div>



            <div>
                <span className="block mb-2 text-sm font-medium text-neutral-100 ">
                  Gender
                </span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
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
                      className="ml-2 text-sm font-medium text-neutral-100 "
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
                      className="ml-2 text-sm font-medium text-neutral-100"
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
              ALready have an account?{" "}
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