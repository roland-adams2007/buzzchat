import { Link,useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { toast} from 'react-toastify';
import axios from "axios";
import Cookies from 'js-cookie';
import { useEmail } from "./EmailContext";

const Login = ({setIsRegistered}) =>{


 const navigate = useNavigate();
 const [userId,setUserId]=useState('');
 const { updateEmail } = useEmail();
 
 const [loading, setLoading] = useState(false);

  const [formData,setFormData]=useState({
    email:"",
    password:"",
  })

  const handleChange = (e) =>{
    setFormData({
        ...formData,
        [e.target.name]:e.target.value          
    })
}

const handleSubmit = (e) =>{
  e.preventDefault();

    if(!(formData.email) || !(formData.password)){
      toast.error('Field must not be empty',{
        autoClose:5000
      })
      return;
    }

    setLoading(true);

  axios.post('http://localhost/buzzchat_backend/action/login_action.php',formData)
  .then(response=>{
    const res=response.data;
    setIsRegistered(true);
    Cookies.set('isRegistered', true, { expires: 15 });
    if(res.status){
      setUserId(res.data.userId);
      updateEmail(formData.email);
      toast.success(res.msg, { autoClose: 5000 });
      navigate('/verify-email', { state: { email: formData.email } });
    }else{
      toast.error(res.msg, { autoClose: 5000 });
      if (res.msg === 'You need to verify your email') {
        navigate('/verify-email', { state: { email: formData.email } });
      }
    }
  })
  .catch(error=>{
    console.log(error)
    toast.error('An error occurred',{
      autoClose:5000
    })
  })
  .finally (()=>{
    setLoading(false);
  })

}


    return(
        <>
        <>
     <title>Login | BuzzChat</title>
  <div className="wrapper2 w-full flex items-center justify-center min-h-screen">
    <div className="form w-full max-w-md p-8 bg-white shadow-md md:w-1/2 p-4">
      <div className="form-header w-full text-center mb-5">
        <h1 className="flex flex-wrap items-center gap-x-3 justify-center text-2xl font-regular mb-2 text-center">
          <img src="assets/images/bee.png" className="w-12" alt="" />
          BuzzChat
        </h1>
        <h3 className="text-xl mb-2">Sign in</h3>
        <p className="text-md text-gray-700">
          Sign in to continue to BuzzChat.
        </p>
      </div>
      <div className="form-body mb-5">
        <form action="#" method="post" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-regular mb-2"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:none"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-regular mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:none"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4 flex flex-wrap justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 text-sm font-medium text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="mt-2 sm:mt-0">
              <a href="#" className="text-gray-700 text-sm font-regular">
                Forgot password?
              </a>
            </div>
          </div>
          <div className="flex items-center justify-between w-full">
          <button
            className={`bg-blue-500 w-full hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out ${loading ? 'cursor-not-allowed opacity-75' : ''}`}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Login"
            )}
          </button>



          </div>
        </form>
      </div>
      <div className="form-footer flex justify-center items-center">
        <p>
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-700 font-regular">Sign up</Link>
        </p>
      </div>
    </div>
  </div>
</>

        </>
    )

}

export default Login