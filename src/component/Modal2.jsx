import axios from "axios";
import { useState,useEffect } from "react";
import { toast } from "react-toastify";

const Modal2 = ({ userDetails, handleClose, show }) =>{

  const[modalinfo,setModalInfo]=useState([]);


  const userId = userDetails.user_id;
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const[dialingCodes,setDialingCodes]=useState([])
  const [addButton,setAddButton]=useState(false);
      const [formData,setFormData]=useState({
             country_code_id:"",
             contact_phone:"",
             contact_name:"",
             current_user_id: "",

      });

      useEffect(()=>{
        setFormData({
          country_code_id:"",
          contact_phone:"",
          contact_name:"",
          current_user_id: userId,
        })
      },[userId])



      const handleChange = (e) =>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value          
        })
    }

   

       const handleSearch = (e) =>{
        e.preventDefault();

        if(!(formData.country_code_id) || !(formData.contact_phone)){
          toast.error("Input Phone Number ",{
            autoClose:5000
          })
          setAddButton(false)
          return;

        }
        setLoading(true)

        axios.post("http://localhost/buzzchat_backend/action/search_contact_action.php",formData)
       .then(response=>{
        const res=response.data;
         if(res.status){
          toast.success(res.msg,{
            autoClose:5000
           })
           setAddButton(true)
         }else{
          toast.error(res.msg,{
          autoClose:5000
         })
         setAddButton(false)
         }
       })
       .catch(()=>{
         toast.error("An error occured, Try again",{
          autoClose:5000
         })
       })
       .finally(()=>setLoading(false))
       }

       const handleAdd = (e) =>{
           e.preventDefault();

           if(!addButton){
            toast.error("User must be found first",{
              autoClose:5000
            })
            return;
           }
           if(!(formData.contact_name)){
            toast.error("Input contact name",{
              autoClose:5000
            })
            return;
           }

           setLoading2(true)

           axios.post("http://localhost/buzzchat_backend/action/add_contact_action.php",formData)
           .then(response=>{
            const res = response.data;
            if(res.status){
               toast.success(res.msg,{
                autoClose:5000
               })
               setFormData({
                country_code_id:"",
                contact_phone:"",
                contact_name:"",
               })
               setAddButton(false)
               handleClose();
            }else{
              toast.error(res.msg,{
                autoClose:5000
              })
            }
           })
           .catch(()=>{
            toast.error("An error occurred, Try again",{
             autoClose:5000
            })
          })
          .finally(()=>{
            setLoading2(false)
          })

       }

       useEffect(()=>{
        fetch("http://localhost/buzzchat_backend/action/fetch_dialing_code.php")
        .then(response=>response.json())
        .then(data=>{
            setDialingCodes(data)
        })
        .catch(()=>{
            toast.error('An error occurred, Try again',{
              autoClose:5000
            } )
        })
    })

    const showHideClassName = show ? "modal1 block relative z-50 " : "modal1 hidden relative z-50";

       return(
        <>
        <div className={showHideClassName} id="modal2">
          <div className="w-full h-screen fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 transition-opacity bg-black bg-opacity-50 modal-overlay">
              <div className="flex w-full h-full justify-center items-center">
                <form
                  action="#"
                  method="post"
                  className=" max-w-xs md:max-w-md mx-3 rounded-md shadow-md min-h-96 flex flex-col gap-y-4"
                  style={{ backgroundColor: "#f7f7fb" }}
                  
                >
                  <div className="border-b w-full flex flex-row justify-between items-center px-3 h-14">
                    <h3 className="text-grey-700">Add contact</h3>
                    <button type="button" onClick={handleClose} id="closemodalbutton2">
                      <i className="bx bx-x text-2xl" />
                    </button>
                  </div>
                  <div className="w-full flex flex-col gap-y-1 px-4">
                    <label htmlFor="">Contact Phone</label>
                    <div className="flex w-full flex-row gap-x-2">
                      <select
                        name="country_code_id"
                        id="country_code_id"
                        className="border p-2 rounded-md focus:outline-none"
                        style={{ backgroundColor: "lavender" }}
                        value={formData.country_code_id}
                        onChange={handleChange}
                      > 
                        <option value="">Select</option>
                        {dialingCodes.map((dialing_code)=>(
                                  <option value={dialing_code.country_code_id} key={dialing_code.country_code_id}>{dialing_code.country_call_code}</option>
                              ))}
                      </select>
                      <input
                        type="text"
                        name="contact_phone"
                        id="contact_phone"
                        className="border p-2 rounded-md focus:outline-none"
                        style={{ backgroundColor: "lavender" }}
                        placeholder="Enter Contact Number"
                        value={formData.contact_phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-y-1 px-4">
                    <label htmlFor="contact-name">Contact name</label>
                    <input
                      type="text"
                      name="contact_name"
                      id="contact_name"
                      placeholder="Enter Contact name"
                      className="border p-2 rounded-md focus:outline-none"
                      style={{ backgroundColor: "lavender" }}
                      value={formData.contact_name}
                        onChange={handleChange}
                    />
                  </div>
                  <div className="border-t w-full h-14 px-3 mb-2 text-right">
                  <button
                      type="button"
                      className="border p-2 mt-3 rounded-md text-white text-sm"
                      style={{ backgroundColor: "#007BFF" }}
                      disabled={loading}
                      onClick={(e)=>handleSearch(e)}
                    >
                      {loading ? (
                    <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    "Search"
                  )}
                    </button>
                    <button
                      type="button"
                      className="border p-2 mt-3 rounded-md text-white text-sm"
                      style={{ backgroundColor: "#007BFF" }}
                      disabled={loading2}
                      onClick={handleAdd}
                    >
                       {loading2 ? (
                    <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    "Add contact"
                  )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
       </div>
        </>
       )
}

export default Modal2;