import { Link,useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { toast} from 'react-toastify';
import axios from "axios";
import Cookies from 'js-cookie';
import { useEmail } from "./EmailContext";
import Profile from "./Profile";

const Register = ({setIsRegistered}) =>{

    const[formData,setFormData]=useState({
        fname:"",
        lname:"",
        email:"",
        country_dialing_code:"",
        phone:"",
        password:"",
        country:"",
    })



    const[countries,setCountries]=useState([])
    const[dialingCodes,setDialingCodes]=useState([])
    const { updateEmail } = useEmail();
    
   const [isLoading,setIsLoading]=useState(false)

    const navigate = useNavigate();

     const handleChange = (e) =>{
      setFormData({
          ...formData,
          [e.target.name]:e.target.value          
      })
  }

    const handleSubmit = (e)=>{
         e.preventDefault();




         if( !(formData.fname) ||  !(formData.lname) || !(formData.email)  || !(formData.country_dialing_code) ||  !(formData.phone) || !(formData.password)){
          toast.error('Field must not be empty',{
            autoClose:5000
          })
          return;
        }

        setIsLoading(true)

         try{
          axios.post("http://localhost/buzzchat_backend/action/register_action.php",formData)
          .then(response=>{
            const res=response.data
            if(res.status){
              setIsRegistered(true);
              updateEmail(formData.email);
            Cookies.set('isRegistered', true, { expires: 15 });
            toast.success(res.msg, {
              autoClose: 5000
            });
            navigate('/verify-email', { state: { email: formData.email } });
            }else{
              toast.error(res.msg,{
                autoClose:5000
              } )
            }
          })
          .catch(error=>{
            console.log(error)
            toast.error('There is an error, Try again',{
              autoClose:5000
            } )
          })
          .finally(()=>{
            setIsLoading(false);
          })
         }
         catch(error){
           console.log(error)
           toast.error('There is an error, Try again',{
            autoClose:5000
          } )
         }

    }

    useEffect(()=>{
        fetch("http://localhost/buzzchat_backend/action/fetch_country.php")
        .then((response)=>response.json())
        .then((data)=>{
            setCountries(data);
        })
        .catch((error)=>{
            console.log(error)
        })
    },[])

    useEffect(()=>{
        fetch("http://localhost/buzzchat_backend/action/fetch_dialing_code.php")
        .then(response=>response.json())
        .then(data=>{
            setDialingCodes(data)
        })
        .catch(error=>{
            console.log(error);
            toast.error('There was an error',{
              autoClose:5000
            } )
        })
    })


    return(
        <>
        {/*Title*/}
        <title>Register | BuzzChat</title>
        <div className="wrapper2 w-full flex items-center justify-center min-h-screen">
          <div className="form w-full max-w-md p-8 bg-white shadow-md md:w-1/2 p-4">
            <div className="form-header w-full text-center mb-5">
              <h1 className="flex flex-wrap items-center gap-x-3 justify-center text-2xl font-regular mb-2 text-center">
                <img src="assets/images/bee.png" className="w-12" alt="" />
                BuzzChat
              </h1>
              <h3 className="text-xl mb-2">Sign up</h3>
              <p className="text-md text-gray-700">Get your BuzzChat account now.</p>
            </div>
            <div className="form-body mb-5">
              <form onSubmit={handleSubmit} method="post">

                
                <div className="mb-4 flex w-full gap-x-3">
                  <div>
                    <label
                      htmlFor="fname"
                      className="block text-gray-700 text-sm font-regular mb-2"
                    >
                      Firstname
                    </label>
                    <input
                      type="text"
                      id="fname"
                      className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:none"
                      name="fname"
                      placeholder="Enter Firstname"
                      value={formData.fname}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lname"
                      className="block text-gray-700 text-sm font-regular mb-2"
                    >
                      Lastname
                    </label>
                    <input
                      type="text"
                      id="lname"
                      className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:none"
                      name="lname"
                      placeholder="Enter Lastname"
                      value={formData.lname}
                      onChange={handleChange}
                    />
                  </div>
                </div>
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
                        htmlFor="phone"
                        className="block text-gray-700 text-sm font-regular mb-2"
                    >
                        Phone Number
                    </label>
                    <div className="w-full flex flex-row gap-x-1">
                        <select name="country_dialing_code" id="country_dialing_code" value={formData.country_dialing_code}
                      onChange={handleChange}>
                        <option value="">Select</option>
                        {dialingCodes.map((dialing_code)=>(
                            <option value={dialing_code.country_code_id} key={dialing_code.country_code_id}>{dialing_code.country_call_code}</option>
                        ))}
                        </select>
                        <input
                        type="text"
                        id="phone"
                        className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:none"
                        name="phone"
                        placeholder="Enter Phone Number"
                        value={formData.phone}
                      onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="country"
                    className="block text-gray-700 text-sm font-regular mb-2"
                    >Country</label>
                    <select name="country" id="country" className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:none" value={formData.country}
                      onChange={handleChange}>
                        <option value="">Select Country</option>
                        {countries.map((country)=>(
                            <option value={`${country.country_id}`} key={country.country_id}>{`${country.country_name}`}</option>
                        ))}
                    </select>
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
                <div className="flex items-center justify-between w-full">
                  <button
                    className={`bg-blue-500 w-full hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out ${isLoading ? 'cursor-not-allowed opacity-75' : ''}`}
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      "Register"
                    )}
                  </button>
                </div>
              </form>
            </div>
            <div className="form-footer flex justify-center items-center">
              <p>
                Already have an account?{" "}
                <Link to="/" className="text-blue-700 font-regular">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
     
      </>
      

    )
}

export  default Register