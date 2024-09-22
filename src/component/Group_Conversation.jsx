import axios from "axios";
import { useEffect, useState,useRef } from "react";
import EmojiPicker from 'emoji-picker-react';
import { toast } from "react-toastify";
import ChatMessage from "./ChatMessage";

 
 const Group_conversation = ({userDetails, groupId, onBackClick}) =>{
  const userId = userDetails.user_id;
    const [groupInfo,setGroupInfo]=useState("");
    const [groupMenu,setGroupMenu]=useState(false);
    const [emoji, setEmoji] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [messages,setMessages]=useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [sending,setSending]=useState(false)

    const handleGroupMenu = () => {
        setGroupMenu(!groupMenu)
      }

      const handleEmoji = () => {
        setEmoji(!emoji);
      };
    
      const onEmojiClick = (emojiObject, event) => {
        if (emojiObject && emojiObject.emoji) {
          setNewMessage(prevMessage => prevMessage + emojiObject.emoji);
        } else {
          console.log('Invalid emoji object');
        }
      };

      const showGroupMenu = groupMenu ? "block absolute top-0 right-0 mt-7 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10" :"hidden absolute top-0 right-0 mt-7 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10";

      const showEmojiContainer = emoji
      ? "w-full border h-80 overflow-hidden flex flex-col gap-y-1 emoji-container"
      : "w-full border h-20 overflow-hidden flex flex-col gap-y-1 emoji-container";
  
    const showEmoji = emoji
      ? "w-full block h-full emoji px-5"
      : "w-full hidden h-full emoji px-5";
    
    useEffect(()=>{
        if(groupId){
           const fetchGroupInfo = async () =>{
            try {
              const response = await axios.get(`http://localhost/buzzchat_backend/action/fetch_group_details.php?group_id=${groupId}`)
              const res= response.data;
              setGroupInfo(res);
            } catch (error) {
                console.log(error);
            }
           }
           fetchGroupInfo();
        }
    },[groupId])

    const sendMessage = (e) =>{
        e.preventDefault();
        setSending(true)
        fetch('http://localhost/buzzchat_backend/action/send_group_message.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `sender=${userId}&group=${groupId}&message=${newMessage}`,
        })
        .then(response => response.json())
        .then(data => {
          if (data.status === true) {
            setMessages([...messages, { user_id:userId,user_profile:userDetails.user_profile, message: newMessage, sent_at: new Date().toISOString() }]);
            setNewMessage('');
          }
        })
        .catch(error => console.error('Error sending message:', error))
        .finally(()=>setSending(false))
    }

    useEffect(()=>{
      const interval = setInterval(()=>{
        const fetchGroupMessage = async () => {
          const response = await axios.get(`http://localhost/buzzchat_backend/action/fetch_group_message.php?group=${groupId}&sender=${userId}`);
           const data=response.data;
           setMessages(data);
        }
        fetchGroupMessage();
      },1000)
      return () => clearInterval(interval);
    },[groupId,userId])

    
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

function formatTime(date) {
  const options = { hour: '2-digit', minute: '2-digit', hour12: true };
  return new Date(date).toLocaleTimeString('en-US', options);
}

const lastMessageRef = useRef(null);
  const prevMessagesLength = useRef(messages.length);

  useEffect(() => {
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

  useEffect(()=>{

  },[userId])

 return(
    <>
      <div className="w-full lg:relative fixed top-0 left-0 h-full lg:z-10 z-20  border bg-white">
  <div className="max-w-full sticky top-0 left-0 bg-white border-b h-24 flex flex-row justify-between px-5 items-center z-10 gap-x-4">
    <div className="flex flex-row gap-x-3 justify-center items-center">
    <button type="button" onClick={onBackClick}>
        <i className="bx bx-left-arrow-alt text-2xl" />
      </button>
      <img
        src={`http://localhost/buzzchat_backend/assets/${groupInfo.group_profile}`}
        className="w-10 h-10 object-cover rounded-full"
      />
      <div className="flex flex-col ">
      <h4 className="text-sm md:text-md font-semibold">{groupInfo.group_name}</h4>
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
      <button type="button" onClick={handleGroupMenu}>
        <i className="bx bx-dots-horizontal-rounded  text-gray-500 text-xl md:text-2xl cursor-pointer" />
      </button>
      <div className={showGroupMenu}>
        <a
          href="#"
          className="block lg:hidden px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm flex flex-row items-center justify-between"
        >
          {" "}
          View Group <i className="bx bx-user" />
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
  <div className="w-full h-calc4 bg-white overflow-y-scroll overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 p-4">
     {messages.length===0 ? (
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
     ):(
      <div>
          {Object.keys(groupedMessages).map((date) => (
        <div key={date}>
          <div className="flex justify-center my-4">
            <span className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-full">
              {date}
            </span> 
          </div>
          {groupedMessages[date].map((message, index) => (
            <div key={index} className={`flex mb-4 ${message.user_id === userId ? 'justify-end' : ''}`}>
              {message.user_id !== userId && (
                <div className="flex-shrink-0 mr-3">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={`http://localhost/buzzchat_backend/assets/${message.user_profile}`}
                    alt="User Avatar"
                  />
                </div>
              )}
              <div
                className={`p-3 rounded-lg shadow-sm relative max-w-64 lg:max-w-96 ${message.user_id === userId ? 'text-right' : 'bg-gray-100'}`}
                style={{ backgroundColor: message.user_id === userId ? '#007BFF' : ''}}
                ref={index === messages.length - 1 ? lastMessageRef : null}
              >
                {message.user_id !== userId && (
                  <p className="text-sm text-gray-500 mb-1">{message.display_name}</p>
                )}
                <ChatMessage message={message} currentUser={{ id: userId }} />
                <div className="flex justify-between items-center mt-1">
                  <div className="relative">
                    <button
                      className={message.user_id === userId ? 'text-white hover:text-gray-700' : 'text-gray-500 hover:text-gray-700'}
                      onClick={() => toggleDropdown(message.message_id)}
                    >
                      <i className="bx bx-dots-horizontal-rounded" />
                    </button>
                    {activeDropdown === message.message_id && (
                      <div className={`absolute mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 ${message.user_id === userId ? 'text-left' : 'text-right'}`}>
                        <a
                          href="#"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                          onClick={(e) => copyText(e, message.message)}
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
                        {message.user_id === userId && (
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
                  <span className={`text-xs ${message.user_id === userId ? 'text-white' : 'text-gray-500'} flex items-center flex-row gap-x-1`}>
                    {message.user_id === userId ? (
                      <div>
                        {message.read_status === 'pending' && <i className="bx bx-time-five" />}
                        {message.read_status === 'unread' && <i className="bx bx-check" />}
                        {message.read_status === 'read' && <i className="bx bx-check-double" />}
                        <span> </span>
                        {formatTime(message.sent_at)}
                      </div>
                    ) : (
                      <div>{formatTime(message.sent_at)}</div>
                    )}
                  </span>
                </div>
              </div>
              {message.user_id === userId && (
                <div className="flex-shrink-0 ml-3">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={`http://localhost/buzzchat_backend/assets/${message.user_profile}`}
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

 <div className="w-full sticky bottom-16 left-0 lg:bottom-0 bg-white border-t">
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
            onClick={(e)=>sendMessage(e)}
              className="text-white font-bold py-1 px-3 rounded"
              style={{ backgroundColor: "#007BFF" }}
              disabled={sending}
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

    </>
 )
 }
 export default Group_conversation;