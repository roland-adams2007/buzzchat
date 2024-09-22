import { useState,useEffect,useRef } from "react";
import EmojiPicker from 'emoji-picker-react';
import axios from "axios";
import { toast } from "react-toastify";


const Converstion = ({userDetails,contactId, onBackClick}) =>{


  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [emoji, setEmoji] = useState(false);
  const fromUser=userDetails.user_id;
  const toUser=contactId;
  const [contactInfo,setContactInfo]=useState("");
  const [userStatus,setUserStatus]=useState("")
  const [profileMenu,setProfileMenu]=useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [show, setShow] = useState(false);
  const showModal = () => setShow(true);
  const hideModal = () => setShow(false);
  const [contactName,setContactName]=useState("");

    const handleAddContact = (e) =>{
      e.preventDefault();
      axios.post("http://localhost/buzzchat_backend/action/add_exising_contact.php",{
        fromUser:fromUser,
        contactPhone:contactInfo.phone_name,
        contactName:contactName
      })
      .then(response=>{
        const res = response.data;
       if(res.status){
        toast.success(res.msg,{
          autoClose:5000
         })
       }else{
        toast.error(res.msg,{
          autoClose:5000
         })
         setContactName("");
         hideModal();
       }

      })
      .catch(error=>{
        console.log(error);
      })
    }


  const showHideClassName = show ? "modal1 block relative z-50 " : "modal1 hidden relative z-50";

  useEffect(()=>{
    const interval = setInterval(()=>{
     fetch(`http://localhost/buzzchat_backend/action/fetch_other_user_details.php?contact_id=${contactId}`)
     .then(response => response.json())
     .then(data => {
       setContactInfo(data);
     }); 
    },1000)
    return () => clearInterval(interval);
   },[contactId])


  const handleEmoji = () => {
    setEmoji(!emoji);
  };

  const showEmojiContainer = emoji
    ? "w-full border h-80 overflow-hidden flex flex-col gap-y-1 emoji-container"
    : "w-full border h-20 overflow-hidden flex flex-col gap-y-1 emoji-container";

  const showEmoji = emoji
    ? "w-full block h-full emoji px-5"
    : "w-full hidden h-full emoji px-5";

    const onEmojiClick = (emojiObject, event) => {
      if (emojiObject && emojiObject.emoji) {
        setNewMessage(prevMessage => prevMessage + emojiObject.emoji);
      } else {
        console.log('Invalid emoji object');
      }
    };

    const sendMessage = (e) => {
      e.preventDefault();
      fetch('http://localhost/buzzchat_backend/action/send_message.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `sender=${fromUser}&receiver=${toUser}&message=${newMessage}`,
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === true) {
          setMessages([...messages, { sender_img: userDetails.user_profile, from_user_id: fromUser, to_user_id: toUser, message_text: newMessage, sent_at: new Date().toISOString() }]);
          setNewMessage('');
        }
      })
      .catch(error => console.error('Error sending message:', error));
    };
    


  useEffect (()=>{
   const interval = setInterval(()=>{
    const fetchMessages = async () =>{
      const response= await axios.get(`http://localhost/buzzchat_backend/action/fetch_message.php?sender=${fromUser}&receiver=${toUser}`)
      const data= response.data;
      setMessages(data);
     }
     fetchMessages();
   },1000)
   return () => clearInterval(interval);
  },[fromUser,toUser])

  useEffect(() => {
    const fetchUserStatus = async (contactId) => {
        const response = await fetch('http://localhost/buzzchat_backend/action/get_user_status.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId:contactId }),
        });
        const data = await response.json();
        setUserStatus(data);
    };

    fetchUserStatus(contactId); // Initial fetch

    const interval = setInterval(() => {
        fetchUserStatus(contactId);
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
}, [contactId]);




  const isOnline  =  userStatus.is_online; 
  const last_active = userStatus.last_active; 
    
const handleProfileMenu = () => {
  setProfileMenu(!profileMenu)
}

const showProfileMenu = profileMenu ? "block absolute top-0 right-0 mt-7 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10" :"hidden absolute top-0 right-0 mt-7 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10";
   
const toggleDropdown = (messageId) => {
  setActiveDropdown(activeDropdown === messageId ? null : messageId);
};


   const copyText = async (e,messgae) =>{
    e.preventDefault();
    try {
      await
      navigator.clipboard.writeText(messgae);
      toast.success("Copied",{
        autoClose:5000
      })
    } catch (error) {
      toast.error("Failed to copy text",{
        autoClose:5000
      })
    }
   }

   useEffect(()=>{
    const updateReadStatus = async () =>{
        try {
                await axios.post('http://localhost/buzzchat_backend/action/update_read_status.php', {
                from_user_id: fromUser,
                to_user_id: toUser
            });
        } catch (error) {
            console.error('Error marking messages as read', error);
        }
    }
    updateReadStatus();
},[fromUser, toUser])


function formatTime(date) {
  const options = { hour: '2-digit', minute: '2-digit', hour12: true };
  return new Date(date).toLocaleTimeString('en-US', options);
}


const lastMessageRef = useRef(null);
  const prevMessagesLength = useRef(messages.length);

  useEffect(() => {
    // Scroll to the last message only if a new message is added
    if (messages.length > prevMessagesLength.current) {
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView();
      }
    }
    prevMessagesLength.current = messages.length;
  }, [messages]);

  const groupedMessages = messages.reduce((acc, message) => {
    const date = new Date(message.sent_at).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {});

    return(
        <>
        <div className="w-full lg:relative fixed top-0 left-0 h-full lg:z-10 z-20  border bg-white">
      <div className="max-w-full sticky top-0 left-0 bg-white border-b h-24 flex flex-row justify-between px-5 items-center z-10 gap-x-4">
        <div className="flex flex-row gap-x-3 justify-center items-center">
          <button type="button" onClick={onBackClick}>
            <i className="bx bx-left-arrow-alt text-2xl" />
          </button>
          <img
             src={`http://localhost/buzzchat_backend/assets/${contactInfo.user_profile}`}
            className="max-w-10 max-h-10 rounded-full object-cover"
          />
          <div className="flex flex-col ">
            <h4 className="text-sm md:text-md font-semibold">{contactInfo.phone_name}</h4>
            <p className="text-xs text-gray-600 flex flex-row items-center gap-x-1">
            <span>
                {isOnline ? (
                    <>
                        <i className="bx bxs-circle text-green-500 text-md" /> Online
                    </>
                ) : (
                    <>
                        <span className="text-xs lg:text-md"><i className="bx bxs-circle text-red-500 text-xs lg:text-md" /> Last active at {formatTime(last_active)}</span>
                    </>
                )}
            </span>

            </p>
          </div>
        </div>
        <div className="flex flex-row  gap-x-7 justify-center items-center relative">
          <a href="">
            <i className="bx bx-search text-gray-500 text-xl md:text-2xl" />
          </a>
          <a href="" className="hidden lg:block">
            <i className="bx bx-phone  text-gray-500 text-xl md:text-2xl" />
          </a>
          <a href="" className="hidden lg:block">
            <i className="bx bx-video-recording  text-gray-500 text-xl md:text-2xl" />
          </a>
          <a href="" className="hidden lg:block">
            <i className="bx bx-group  text-gray-500 text-xl md:text-2xl" />
          </a>
          <button onClick={handleProfileMenu}>
            <i className="bx bx-dots-horizontal-rounded  text-gray-500 text-xl md:text-2xl cursor-pointer" />
          </button>
          <div className={showProfileMenu}>
            <a
              href="#"
              className="block lg:hidden px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm flex flex-row items-center justify-between"
            >
              {" "}
              View Profile <i className="bx bx-user" />
            </a>
            <a
              href="#"
              className="block lg:hidden px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm flex flex-row items-center justify-between"
            >
              Audio <i className="bx bx-phone" />
            </a>
            <a
              href="#"
              className="block lg:hidden px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm flex flex-row items-center justify-between"
            >
              Video <i className="bx bx-video-recording" />
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm flex flex-row items-center justify-between"
            >
              Archive <i className="bx bx-archive" />
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm flex flex-row items-center justify-between"
            >
              Mute <i className="bx bx-volume-mute" />
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm flex flex-row items-center justify-between"
            >
              Delete <i className="bx bx-trash" />
            </a>
          </div>
        </div>
      </div>
      {!(contactInfo.contact_id) && (
        <div className="max-w-full h-12 lg:h-16 border flex flex-row">
        <button type="button" className="w-full h-full border text-red-600 text-lg">Block</button>
        <button type="button" onClick={showModal} className="w-full h-full border text-lg bg-white" style={{color:"#007BFF"}}>Add</button>
        </div>
      )}
      <div className="w-full h-calc4 bg-white overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 p-4">
  {messages.length === 0 ? (
     <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <svg
          className="mb-4 w-24 h-24 rounded-full shadow-lg border-2 border-gray-300"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        <p className="text-lg font-semibold">No conversation</p>
        <p className="text-sm text-gray-400 mb-4">Start a new chat to see messages here.</p>
      </div>


  ) : (
     <div>
       {Object.keys(groupedMessages).map((date) => (
             <div key={date}>
                <div className="flex justify-center my-4">
                  <span className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-full">
                    {date}
                  </span>
                </div>
                 {groupedMessages[date].map((message, index) => (
      <div key={index} className={`flex mb-4 ${message.from_user_id === fromUser ? 'justify-end' : ''}`}>
        {message.from_user_id !== fromUser && (
          <div className="flex-shrink-0 mr-3">
            <img
              className="h-10 w-10 rounded-full"
              src={`http://localhost/buzzchat_backend/assets/${contactInfo.user_profile}`}
              alt="User Avatar"
            />
          </div>
        )}
        <div
          className={`p-3 rounded-lg shadow-sm relative max-w-64 lg:max-w-96 ${message.from_user_id === fromUser ? 'text-right' : 'bg-gray-100'}`}
          style={{ backgroundColor: message.from_user_id === fromUser ? '#007BFF' : ''}}
          ref={index === messages.length - 1 ? lastMessageRef : null}
        >
          <p className={message.from_user_id === fromUser ? 'text-white text-left break-words' : 'text-gray-800 break-words'}>{message.message_text}</p>
          <div className="flex justify-between items-center mt-1">
            <div className="relative">
              <button
                className={message.from_user_id === fromUser ? 'text-white hover:text-gray-700' : 'text-gray-500 hover:text-gray-700'}
                onClick={() => toggleDropdown(message.message_id)}
              >
                <i className="bx bx-dots-horizontal-rounded" />
              </button>
              {activeDropdown === message.message_id && (
                <div className={`absolute mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 ${message.from_user_id === fromUser ? 'text-left' : 'text-right'}`}>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={(e) => copyText(e, message.message_text)}
                  >
                    Copy
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Reply
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Forward
                  </a>
                  {message.from_user_id === fromUser && (
                    <a
                    href="#"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Delete
                  </a>
                  )}
                </div>
              )}
            </div>
            <span className={`text-xs ${message.from_user_id === fromUser ? 'text-white' : 'text-gray-500'} flex items-center flex-row gap-x-1`}>
            {message.from_user_id === fromUser ? (
              <div>
                {message.read_status === 'pending' && <i className="bx bx-time-five" />}
                {message.read_status === 'unread' && <i className="bx bx-check" />}
                {message.read_status === 'read' && <i className="bx bx-check-double" />}
                <span> </span>
                {formatTime(message.sent_at)}
              </div>
            ):(<div>{formatTime(message.sent_at)}</div>)}
            </span>
          </div>
        </div>
        {message.from_user_id === fromUser && (
          <div className="flex-shrink-0 ml-3">
            <img
              className="h-10 w-10 rounded-full"
              src={`http://localhost/buzzchat_backend/assets/${message.sender_img}`}
              alt="User Avatar"
            />
          </div>
        )}
      </div>
      
                    ))}
             </div>
       ))}
     </div>

        )}

      </div>

  <div className="w-full sticky bottom-0 left-0 lg:bottom-0 bg-white border-t">
      <div className={showEmojiContainer}>
        <form
          action=""
          method="post"
          className="w-full flex flex-row items-center justify-center lg:gap-x-5 gap-x-2 h-20 lg:px-5 px-2"
        >
          <div className="w-5/6">
            <textarea
              name=""
              id=""
              className="w-full focus:outline-none resize-none rounded-md px-5 py-3 flex items-center h-12 overflow-y-scroll scroll-bar"
              style={{ backgroundColor: "lavender" }}
              placeholder="Enter Message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
          </div>
          <div className="lg:w-1/6 w-1/3 flex flex-row justify-around lg:justify-between items-center h-full">
            <button type="button" onClick={handleEmoji} id="emoji-button">
              <i
                className="bx bx-smile text-xl cursor-pointer"
                style={{ color: "#007BFF" }}
              />
            </button>
            <label className="md:block hidden" htmlFor="text-file">
              <i
                className="bx bx-folder-open text-xl cursor-pointer"
                style={{ color: "#007BFF" }}
              />
            </label>
            <input
              type="file"
              name="text-file"
              id="text-file"
              className="hidden"
            />
            <button
              className="text-white font-bold py-1 px-3 rounded"
              style={{ backgroundColor: "#007BFF" }}
              onClick={sendMessage}
            >
              <i className="bx bxs-send text-xl" />
            </button>
          </div>
        </form>
        <div className={showEmoji}>
          {emoji && <EmojiPicker onEmojiClick={onEmojiClick} style={{width: "100%", height:"100%"}}  />}

        </div>
      </div>
    </div>
        </div>
       

        <div className={showHideClassName} id="modal4">
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
                    <button type="button" onClick={hideModal} id="closemodalbutton4">
                      <i className="bx bx-x text-2xl" />
                    </button>
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
                      value={contactName}
                      onChange={(e)=>setContactName(e.target.value)}
                    />
                  </div>
                  <div className="border-t w-full h-14 px-3 mb-2 text-right">
                    <button
                      type="button"
                      className="border p-2 mt-3 rounded-md text-white text-sm"
                      style={{ backgroundColor: "#007BFF" }}
                      onClick={handleAddContact}
                    >
                      Add
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

export default Converstion;

