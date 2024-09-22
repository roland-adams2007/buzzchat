import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Modal3 = ({ userDetails, handleClose, show }) => {


    const [firstName, setFirstName] = useState(userDetails.user_fname || "");
    const [lastName, setLastName] = useState(userDetails.user_lname || "");
    const [email, setEmail] = useState(userDetails.user_email);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [isLoading,setIsLoading]=useState(false)

    useEffect(() => {
        setFirstName(userDetails.user_fname || "");
        setLastName(userDetails.user_lname || "");
        setEmail(userDetails.user_email || "");
    }, [userDetails]);

    const showHideClassName = show ? "modal1 block relative z-50" : "modal1 hidden relative z-50";

    const handleSubmit = async (e) => {
        e.preventDefault();


        if(!firstName || !lastName || !email){
            toast.error("All field are required",{
                autoClose:5000
            })
            return;

        }


        setIsLoading(true)

        try {
            const response = await axios.post("http://localhost/buzzchat_backend/action/update_verification_code.php", {
                email,
            });
             const res=response.data;
             if(res.status){
                toast.success(res.msg,{
                    autoClose:5000
                })
                
                setShowVerificationModal(true);
             }else{
                toast.error(res.msg,{
                    autoClose:5000
                });
             }
            
            
        } catch (error) {
            console.log(error)
            toast.error("Failed to send verification code.",{
                autoClose:5000
            });
        }
        finally{
                setIsLoading(false);
        }
    };

    const handleVerification = async (e) => {
        e.preventDefault();

      if(!verificationCode){
        toast.error("Input verificaton code to continue",{
            autoClose:5000
        })
        return;
      }

        setIsLoading(true)
        try {
            // Verify the code
            const response = await axios.post("http://localhost/buzzchat_backend/action/verify_update_code.php", {
                email,
                code:verificationCode,
            });
            const res=response.data;
            if(res.status){
                toast.success(res.msg,{
                    autoClose:5000
                })
                const response2  = await axios.post("http://localhost/buzzchat_backend/action/update_profile.php", {
                        firstName,
                        lastName,
                        currentemail:userDetails.user_email,
                    });
                        const res2=response2.data;
                        console.log(res2);
                    if(res2.status){
                       toast.success(res2.msg,{
                        autoClose:5000
                       })
                    }else{
                        toast.error(res2.msg,{
                            autoClose:5000
                           })
                    }
                    setShowVerificationModal(false);
                handleClose();
            }else{
                toast.error(res.msg,{
                    autoClose:5000
                })
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to verify code.");
        }
        finally{
            setIsLoading(false);
    }
    };


    return (
        <>
            <div className={showHideClassName} id="modal3">
                <div className="w-full h-screen fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 transition-opacity bg-black bg-opacity-50 modal-overlay">
                        <div className="flex w-full h-full justify-center items-center">
                            <form
                                onSubmit={handleSubmit}
                                className="max-w-xs md:max-w-md mx-3 rounded-md shadow-lg min-h-96 flex flex-col gap-y-4"
                                style={{ backgroundColor: "#f7f7fb" }}
                            >
                                <div className="border-b w-full flex flex-row justify-between items-center px-3 h-14 bg-gray-100">
                                    <h3 className="text-gray-700">Edit Info</h3>
                                    <button type="button" onClick={handleClose}>
                                        <i className="bx bx-x text-2xl" />
                                    </button>
                                </div>
                                <div className="w-full flex flex-col gap-y-1 px-4">
                                    <label htmlFor="user-fname">Firstname</label>
                                    <input
                                        type="text"
                                        name="user-fname"
                                        id="user-fname"
                                        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        style={{ backgroundColor: "lavender" }}
                                        placeholder="Enter firstname"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div className="w-full flex flex-col gap-y-1 px-4">
                                    <label htmlFor="user-lname">Lastname</label>
                                    <input
                                        type="text"
                                        name="user-lname"
                                        id="user-lname"
                                        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        style={{ backgroundColor: "lavender" }}
                                        placeholder="Enter lastname"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                                {/* <div className="w-full flex flex-col gap-y-1 px-4">
                                    <label htmlFor="user-email">Email</label>
                                    <input
                                        type="email"
                                        name="user-email"
                                        id="user-email"
                                        placeholder="Enter email"
                                        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        style={{ backgroundColor: "lavender" }}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div> */}
                                <div className="border-t w-full h-14 px-3 mb-2 text-right bg-gray-100">
                                    <button
                                        type="submit"
                                        className="border p-2 mt-3 rounded-md text-white text-sm"
                                        style={{ backgroundColor: "#007BFF" }}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                        <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        ) : (
                                        "Save"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {showVerificationModal && (
                <div className="modal1 block relative z-50" id="modal4">
                    <div className="w-full h-screen fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 transition-opacity bg-black bg-opacity-50 modal-overlay">
                            <div className="flex w-full h-full justify-center items-center">
                                <form
                                    onSubmit={handleVerification}
                                    className="max-w-xs md:max-w-md mx-3 rounded-md shadow-lg min-h-96 flex flex-col gap-y-4"
                                    style={{ backgroundColor: "#f7f7fb" }}
                                >
                                    <div className="border-b w-full flex flex-row justify-between items-center px-3 h-14 bg-gray-100">
                                        <h3 className="text-gray-700">Verification Code</h3>
                                        <button type="button" onClick={() => setShowVerificationModal(false)}>
                                            <i className="bx bx-x text-2xl" />
                                        </button>
                                    </div>
                                    <div className="w-full flex flex-col gap-y-1 px-4">
                                        <label htmlFor="verification-code">Enter Verification Code</label>
                                        <input
                                            type="text"
                                            name="verification-code"
                                            id="verification-code"
                                            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            style={{ backgroundColor: "lavender" }}
                                            placeholder="Enter verification code"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                        />
                                    </div>
                                    <div className="border-t w-full h-14 px-3 mb-2 text-right bg-gray-100">
                                    <button
                                        type="submit"
                                        className="border p-2 mt-3 rounded-md text-white text-sm"
                                        style={{ backgroundColor: "#007BFF" }}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                        <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        ) : (
                                        "Verify"
                                        )}
                                    </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Modal3;
