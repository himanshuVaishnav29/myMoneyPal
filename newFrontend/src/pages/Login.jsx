import React, { useState } from "react";
import { Link ,useNavigate} from 'react-router-dom';
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { LOGIN } from "../graphql/mutations/user.mutations";
import { GET_AUTHETICATED_USER } from "../graphql/queries/user.query";

const Login = () => {

  const navigate=useNavigate();
  const [loginData, setLoginData] = useState({
		email: "",
		password: "",
	});

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
      if(response){
        navigate("/");
			  toast.success("Login successful!");
      }else{
        toast.error("Login failed!");
      }
			// console.log("Login Response: ", response);
      // navigate("/");
			// toast.success("Login successful!");

		} catch (error) {
			console.log("error  in handleSubmit login",error);
			toast.error(error.message);
		}
	};

  return (
    <section className="">
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
              Sign in to your account
            </h1>
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
                <input
                  id='password'
                  name='password'
                  type='password'
                  value={loginData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-Background border border-gray-300 rounded-lg focus:text-neutral-100 focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                // className="w-full text-white hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  bg-pink-500"
                className="w-full btn"
                disabled={loading}
              >
                {loading?"Loading...":"Login"}
              </button>
              <p className="text-sm font-light text-neutral-100 ">
                Don’t have an account yet?{" "}
                <Link
                  to='/signup'
                  className="font-medium text-primary-600 hover:underline  hover: text-purple-400 cursor-pointer"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
