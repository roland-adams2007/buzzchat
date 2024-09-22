import { useState, useEffect } from 'react';
import { Oval } from "react-loader-spinner";

const Chat = ({ userDetails, onMessageClick }) =>{
    const userId=userDetails.user_id;
    const [chats,setChats]=useState([]);
    const [search,setSearch]=useState("");
    const [filteredChats,setFilteredChats]=useState([]);
    const [isLoading, setIsLoading] = useState(true);



      

      function formatTime(date) {
        const options = { hour: '2-digit', minute: '2-digit', hour12: true };
        return new Date(date).toLocaleTimeString('en-US', options);
    }
    

    useEffect(() => {
  const interval = setInterval(async () => {
    if (userId) {
      try {
        const response = await fetch(`http://localhost/buzzchat_backend/action/fetch_existing_chat.php?user_id=${userId}`);
        const data = await response.json();
        setChats(data);
        setFilteredChats(data.filter(chat =>
          chat.contact_name.toLowerCase().includes(search.toLowerCase())
        ));
      } catch (error) {
        console.log("An error occurred: ", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, 1000);

  return () => clearInterval(interval);
}, [userId, search]);


    return(
        <>
        <div className="lg:w-full min-h-screen relative " id="chat">
            <div
                className="mb-4 flex flex-col gap-y-4 w-full sticky top-0 left-0 py-4 px-5"
                style={{ backgroundColor: "#f7f7fb" }}
            >
                <h2 className="text-xl font-semibold">Chats</h2>
                <form action="#" method="post" onSubmit={(e)=>e.preventDefault()} className="w-full">
                <input
                    type="search"
                    name="search"
                    id="search"
                    className="px-5 py-2 w-full focus:outline-none rounded-sm"
                    placeholder="Search user"
                    style={{ backgroundColor: "lavender" }}
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                />
                </form>
                <h3 className="text-md font-semibold">Recent</h3>
            </div>
            <div className="h-calc2 overflow-y-scroll scroll-bar">
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
                <h3>Fetching chats...</h3>
                    </div>
                ) : (
                    <>
                {chats.length === 0 ? (
                    <div className="w-full h-16 flex flex-col items-center justify-center text-gray-500">
                        <svg
                            className="w-12 h-12 mb-2 fill-current text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                        </svg>
                        <h3>Chat list is empty</h3>
                    </div>
                ) : (
                    <>
                    {filteredChats.length === 0 ? (
                          <div className="w-full h-16 flex flex-col items-center justify-center text-gray-500">
                          <svg
                              className="w-12 h-12 mb-2 fill-current text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                          >
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                          </svg>
                          <h3>No chat found</h3>
                        </div>
                    ) : (
                       filteredChats.map(chat=>(
                        <a
                        key={chat.user_id}
                    href="#"
                    onClick={(e) => onMessageClick(e,chat.chat_user_id)}
                    className="flex flex-row px-4 py-2 rounded-sm max-w-full h-20 mx-1 justify-between items-center user-link"
                    >
                    <div className="flex flex-row gap-x-2 items-center">
                        <img
                        src={`http://localhost/buzzchat_backend/assets/${chat.user_profile}`}
                        className="max-w-10 max-h-10 rounded-full object-cover mb-1"
                        />
                        <div>
                        <h4 className="text-sm font-bold">{chat.contact_name ? chat.contact_name : chat.user_phone}
                        </h4>
                        <span className="text-sm text-gray-600">{(chat.last_message).length >= 23 ? (chat.last_message).slice(0,23)+".." : chat.last_message}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-1">
                        <span className="text-xs text-gray-600">{formatTime(chat.sent_at)}</span>
                        {chat.unread_count===0 ? (<span></span>) : (
                            <span className="inline-flex items-center justify-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                            {chat.unread_count}
                            </span>
                        ) }
                    </div>
                    </a>
                    ))
                    )}
                    </>
                   ) }
                    </>
                )}
            </div>
        </div>

        </>
    )

}

export default Chat;  