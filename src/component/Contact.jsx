import axios from "axios";
import { useState,useEffect } from "react";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";


const Contact = ({userDetails, showModal2,  onMessageClick}) =>{

  const userId = userDetails.user_id;
  const [contacts,setContacts]=useState([]);
  const [search,setSearch]=useState("");
  const [filteredContact,setFilteredContact]=useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=>{
    if (!userId) return;
    const fetchContact = async () =>{
     axios.post("http://localhost/buzzchat_backend/action/fetch_contact.php",userId)
    .then(response=>{
     const res=response.data;
     if(res.status){
         setContacts(res.data);
         setFilteredContact((res.data).filter(contact =>
          contact.contact_name.toLowerCase().includes(search.toLowerCase())
      ))
     }else{
         toast.error(res.msg,{
           autoClose:5000
         })
     }
    })
    .finally(()=>{
      setIsLoading(false);
    });
    }

    fetchContact();
},[userId,search])

  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (contactId) => {
    setActiveDropdown(activeDropdown === contactId ? null : contactId);
  };

  const deleteContact = (e, contactId) =>{
    e.preventDefault();
    axios.post("http://localhost/buzzchat_backend/action/delete_contact.php",contactId)
    .then(response=>{
      const res=response.data;
      if(res.status){
          toast.success(res.msg,{
            autoClose:5000
          })
      }else{
         toast.error(res.msg,{
          autoClose:5000
         })
      }
    })
    .catch(error=>{
      console.log(error)
      toast.error("An error occured",{
        autoClose:5000
      })
    })

  }


  return(
    <>
     <div id="contact" className="lg:w-full h-screen relative">
  <div
    className="flex flex-col gap-y-5  sticky top-0 left-0  px-5 py-4 mb-5 border-b"
    style={{ backgroundColor: "#f7f7fb" }}
  >
    <div className=" w-full flex flex-row justify-between items-center mt-5">
      <h3 className="text-xl font-semibold">Contacts</h3>
      <button type="button" onClick={showModal2} id="modalbutton2">
        <i className="bx bx-user-plus text-2xl text-gray-500" />
      </button>
    </div>
    <div className="w-full">
      <form action="#" onSubmit={(e)=>e.preventDefault()} method="post" className="w-full">
        <input
          type="search"
          name="search-contact"
          id="search-contact"
          placeholder="Search users"
          className="w-full rounded-sm focus:outline-none p-3 text-sm"
          style={{ backgroundColor: "lavender" }}
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />
      </form>
    </div>
  </div>
  <div className="w-full h-calc3 flex flex-col overflow-y-scroll scroll-bar px-5">
      {isLoading ? (
        <div className="w-full h-16 flex flex-col items-center justify-center text-gray-500">
        <Oval
       height={40}
       width={40}
       color="#007BFF"
       visible={true}
       ariaLabel="oval-loading"
       secondaryColor="#007BFF"
       strokeWidth={2}
       strokeWidthSecondary={2}
   />
   <h3>Fetching contacts...</h3>
       </div>
      ) : (
         <>
          {contacts.length === 0 ? (
        <div className="w-full h-16 flex flex-col items-center justify-center text-gray-500">
          <svg
            className="w-12 h-12 mb-2 fill-current text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
          <h3>Contact list is empty</h3>
        </div>
      ) : (
         <>
          {filteredContact.length === 0 ? (
            <div className="w-full h-16 flex flex-col items-center justify-center text-gray-500">
            <svg
                className="w-12 h-12 mb-2 fill-current text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
            >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
            <h3>No contact found</h3>
          </div>
          ) : (
              filteredContact.map((contact) => (
          <div key={contact.contact_id} className="w-full h-16 flex flex-row items-center justify-between rounded-sm px-2">
            <div className="flex flex-row items-center gap-x-3">
              <img
                 src={`http://localhost/buzzchat_backend/assets/${contact.user_profile}`}
                className="max-w-12 max-h-12 rounded-full object-cover"
              />
              <h3>{contact.contact_name}</h3>
            </div>
            <div className="relative">
              <button type="button" onClick={() => toggleDropdown(contact.contact_id)}>
                <i className="bx bx-dots-vertical-rounded" />
              </button>
              {activeDropdown === contact.contact_id && (
                <div className="absolute top-0 right-0 mt-10 w-48 max-h-64 bg-white border border-gray-200 rounded-md shadow-lg z-10 flex flex-col">
                  <a href="#" onClick={(e) => onMessageClick(e,contact.other_user_id)} className="flex flex-row w-full items-center gap-x-3 hover:bg-gray-100 p-2 rounded-sm">
                    <i className="bx bx-message-square-dots" /> <span>Message</span>
                  </a>
                  <a href="#" className="flex flex-row w-full items-center gap-x-3 hover:bg-gray-100 p-2 rounded-sm">
                    <i className="bx bx-edit-alt" /> <span>Rename</span>
                  </a>
                  <a href="#" className="flex flex-row w-full items-center gap-x-3 hover:bg-gray-100 p-2 rounded-sm">
                    <i className="bx bx-share-alt" /> Share
                  </a>
                  <a href="#" className="flex flex-row w-full items-center gap-x-3 hover:bg-gray-100 p-2 rounded-sm">
                    <i className="bx bx-block" /> Block
                  </a>
                  <a href="#" 
                    className="flex flex-row w-full items-center gap-x-3 hover:bg-gray-100 p-2 rounded-sm"
                    onClick={(e) => deleteContact(e, contact.contact_id)}
                  >
                    <i className="bx bx-trash" /> Delete
                  </a>

                </div>
              )}
            </div>
          </div>
        ))
          )}
           
         </>
      )}
         </>
      )}
  </div>

    </div>

    </>
  )
}

export default Contact;