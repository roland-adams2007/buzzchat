import axios from "axios";
import { useState,useEffect } from "react";
import { toast } from "react-toastify";
const Modal = ({userDetails, handleClose, show }) =>{

  const userId=userDetails.user_id;
  const [members,setMembers]=useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [groupName,setGroupName]=useState("")
  const [groupMembers,setGroupMembers]=useState([])
  const [groupBio,setGroupBio]=useState("")
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setGroupMembers([...groupMembers, value]);
    } else {
      setGroupMembers(groupMembers.filter(member => member !== value));
    }
  };
  

  const handleSubmit = async (e) =>{
    e.preventDefault();

    setLoading(true);

    if(!selectedFile || !groupBio || !groupMembers || !groupName){
          toast.error("All fields are  required",{
            autoClose:5000,
          })
          setLoading(false);
          return;
    }

        const formData = new FormData();
      formData.append("group_profile", selectedFile);
      formData.append("group_name",groupName)
      formData.append("group_members",groupMembers.join(","))
      formData.append("group_bio",groupBio)
      formData.append("created_by",userId);

      try {
       const response= await axios.post("http://localhost/buzzchat_backend/action/create_group.php",formData);
        const res = response.data;
        if(res.status){
          toast.success(res.msg,{
            autoClose:5000
          })
          setGroupName("");
          setGroupBio("");
          handleClose()
        }else{
          toast.error(res.msg,{
            autoClose:5000
          })
        }
      } catch (error) {
        console.log(error);
      }finally{
        setLoading(false)
      }

  }



  useEffect(()=>{
       if(userId){
        const fetchContactMember = async () =>{
          fetch(`http://localhost/buzzchat_backend/action/fetch_member.php?user_id=${userId}`)
          .then(response=>response.json())
          .then(data=>{
            setMembers(data);
          })
          .catch(error=>console.log(error))
   }
   fetchContactMember();
       }
  },[userId]);

  const showHideClassName = show ? "modal1 block relative z-50 " : "modal1 hidden relative z-50";
  const [selectMember,setSelectMember]=useState(false);

     const handleShowMember = () =>{
      setSelectMember(!selectMember);
     }

     const showSelectMember = selectMember ? "block absolute top-0 left-0 mt-10 w-48 max-h-64 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-y-scroll scroll-bar px-5" : "hidden absolute top-0 left-0 mt-10 w-48 max-h-64 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-y-scroll scroll-bar px-5";
    return(
        <>
  {/*Modal 1*/}
  <div className={showHideClassName} id="modal">
    <div className="w-full h-screen fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 transition-opacity bg-black bg-opacity-50 modal-overlay">
        <div className="flex w-full h-full justify-center items-center">
          <form
            action="#"
            method="post"
            className=" max-w-xs md:max-w-md mx-3 rounded-md shadow-md min-h-96 flex flex-col gap-y-4"
            style={{ backgroundColor: "#f7f7fb" }}
            onSubmit={handleSubmit}
          >
            <div className="border-b w-full flex flex-row justify-between items-center px-3 h-14">
              <h3 className="text-grey-700">Create new group</h3>
              <button type="button" onClick={handleClose} id="closemodalbutton">
                <i className="bx bx-x text-2xl" />
              </button>
            </div>
            <div className="w-full flex flex-col gap-y-1 px-4">
              <label htmlFor="group-profile">Group Profile</label>
              <input
                type="file"
                accept="image/*"
                placeholder="Choose Group Profile"
                className="border p-2 rounded-md"
                style={{ backgroundColor: "lavender" }}
                onChange={handleFileChange}
              />
            </div>
            <div className="w-full flex flex-col gap-y-1 px-4">
              <label htmlFor="group-name">Group name</label>
              <input
                type="text"
                name="group-name"
                id="group-name"
                placeholder="Enter Group name"
                className="border p-2 rounded-md focus:outline-none"
                style={{ backgroundColor: "lavender" }}
                value={groupName}
                onChange={(e)=>setGroupName(e.target.value)}
              />
            </div>
            <div className="w-full flex flex-col gap-y-1 px-4">
              <label htmlFor="">Group members</label>
              <div className="relative w-full">
                <button
                  type="button"
                  className="text-left border p-2 rounded-md "
                   onClick={handleShowMember}
                  style={{ backgroundColor: "lavender" }}
                >
                  Select members
                </button>
                <div className={showSelectMember}>
                  {members.length === 0 ? (
                    <div>
                      <p>No member available</p>
                    </div>
                  ) : (
                    members.map(member=>(
                      <div key={member.contact_id} className="flex w-full flex-row justify-between px-2 mb-3 mt-2">
                      <input
                        type="checkbox"
                        name="group-members"
                        id={`group-member${member.other_user_id}`}
                        value={member.other_user_id}
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor={`group-member${member.other_user_id}`} className="text-sm">
                        {member.contact_name}
                      </label>
                    </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col gap-y-1 px-4">
              <label htmlFor="group-bio">Group Bio</label>
              <textarea
                name="group-bio"
                id="group-bio"
                placeholder="Enter Group Bio"
                className="border p-2 rounded-md focus:outline-none resize-none"
                style={{ backgroundColor: "lavender" }}
                value={groupBio}
                onChange={(e)=>setGroupBio(e.target.value)}
              />
            </div>
            <div className="border-t w-full h-14 px-3 text-right mb-2">
              <button
                type="submit"
                className="border p-2 mt-3 rounded-md text-white text-sm"
                style={{ backgroundColor: "#007BFF" }}
                disabled={loading}
              >
                 {loading ? (
              <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Create Group"
            )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  {/*Modal 3*/}

</>

    )

}

export default Modal