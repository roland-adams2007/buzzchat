import { useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import { toast} from 'react-toastify';
import axios from "axios";
import Cookies from 'js-cookie';

const Verify_Phone = ({setIsVerified}) =>{

  const location=useLocation();
  const {email} =location.state || {};

   const [code,setCode]=useState('');
   const [isDisabled, setIsDisabled] = useState(false);
   const [userId,setUserId]=useState('');
   const [isLoading,setIsLoading]=useState(false)

   const navigate = useNavigate();


   const handleSubmit = async (e)=>{
    e.preventDefault();

    if(!code){
      toast.error('Field must not be empty',{
        autoClose:5000
      })
      return;
    }

    setIsLoading(true)
    
    try {
      const response=await fetch("http://localhost/buzzchat_backend/action/verify_code_action.php",{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
    })
    const data = await response.json();


    if(data.status){
       toast.success(data.msg,{
        autoClose:5000
       })
       setUserId(data.data)
       setIsVerified(true);
        Cookies.set('isVerified', true, { expires: 15 }); 
        navigate('/home', { state: { email: data.data } })
    }else{
      toast.error(data.msg,{
        autoClose:5000
      })
    }
      
    } catch (error) {
      console.log(error);
    } finally{
      setIsLoading(false);
    }


   }

  const handleResend = () => {


    if (isDisabled) {
      toast.error('You have to wait 2 minutes to resend another code', {
        autoClose: 5000,
      });
      return;
    }

    if (!email) {
      toast.error('Email not available', {
        autoClose: 5000,
      });
      return;
    }

    setIsDisabled(true);

    axios.post("http://localhost/buzzchat_backend/action/resend_code_action.php", { email })
      .then(response => {
        const res = response.data;
        if (res.status) {
          toast.success(res.msg, {
            autoClose: 5000,
          });
        } else {
          toast.error(res.msg, {
            autoClose: 5000,
          });
        }
      })
      .catch(error => {
        console.log(error);
        toast.error('There is an error', {
          autoClose: 5000,
        });
      })
      .finally(() => {
        setTimeout(() => {
          setIsDisabled(false);
        }, 120000); 
      });
    }

    return(
        <>
  <title>Verify Email | BuzzChat</title>
  <div className="wrapper w-full flex items-center justify-center min-h-screen">
    <div className="form w-full max-w-md p-8 bg-white shadow-md md:w-1/2 p-4">
      <div className="form-header w-full text-center mb-5">
        <h1 className="flex flex-wrap items-center gap-x-3 justify-center text-2xl font-regular mb-2 text-center">
          <img src="assets/images/bee.png" className="w-12" alt="" />
          BuzzChat
        </h1>
        <h3 className="text-xl mb-2">Verify</h3>
        <p className="text-md text-gray-700">Code will be sent to you soon.</p>
        {/* {error && <p className="alert alert-danger">{error}</p>} */}
      </div>
      <div className="form-body mb-5">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div>
              <label
                htmlFor="verify-code"
                className="block text-gray-700 text-sm font-regular mb-2"
              >
                Code sent to your email
              </label>
              <input
                type="text"
                id="verify-code"
                className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:none"
                name="verify-code"
                placeholder="Enter Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div>
              <button type="button" className="text-grey-500 font-regular text-sm" onClick={handleResend}>
                Resend code
              </button>
            </div>
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
              "Verify & Continue"
            )}
          </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</>

    )
}

export default Verify_Phone;