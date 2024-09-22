import { useState, useEffect } from 'react';
import { useEmail } from './EmailContext';
import Nav from './Nav';
import Chat from './Chat';
import Profile from './Profile';
import Group from './Group';
import Contact from './Contact';
import Setting from './Setting';
import Converstion from './Converstion';
import Modal from './Modal';
import axios from 'axios';
import Modal2 from './Modal2';
import Modal3 from './Modal3';
import Group_conversation from './Group_Conversation';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const Home = () => {
  const { email } = useEmail();
  const [userDetails, setUserDetails] = useState("");
  const [activeTab, setActiveTab] = useState('chat');
  const [activeContact, setActiveContact] = useState(null);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const userId=userDetails.user_id;
  const [userStatus,setUserStatus]=useState("")
  const [activeGroup,setActiveGroup]=useState(null)

  const showModal = () => setShow(true);
  const hideModal = () => setShow(false);
  const showModal2 = () => setShow2(true);
  const hideModal2 = () => setShow2(false);
  const showModal3 = () => setShow3(true);
  const hideModal3 = () => setShow3(false);

  const showTab = (tab) => {
    setActiveTab(tab);
    window.history.pushState(null, '', `#${tab}`);
  };

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      setActiveTab(hash);
    }
  }, []);

  useEffect(() => {
    if (email) {
      const fetchDetails = async () => {
        try {
          const response = await axios.get(
            `http://localhost/buzzchat_backend/action/fetch_user.php?email=${email}`
          );
          if((response.data)){
            setUserDetails(response.data);
          }else{
            Cookies.remove('isRegistered');
            Cookies.remove('isVerified');
            toast.error("An error occurred",{
              autoClose:5000
            })
          }

        } catch (error) {
          console.log("There is an error: " + error);
        }
      };
      fetchDetails();
    }
  }, [email]);


  const handleMessageClick = (e,contactId) => {
    e.preventDefault();
    setActiveGroup(null)
    setActiveContact(contactId);
  };

  const handleBackClick = () => {
    setActiveContact(null);
  };

  const handleGroupMessageClick = (e,groupId) =>{
    e.preventDefault();
    setActiveContact(null);
    setActiveGroup(groupId);

  };
  const handleGroupBackClick = () =>{
    setActiveGroup(null);
  }

  const updateUserStatus = async (userId, isOnline) => {
    try {
        const response = await fetch('http://localhost/buzzchat_backend/action/update_user_status.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, isOnline }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        await response.json();
    } catch (error) {
        console.log('Error updating user status:', error);
    }
};

useEffect(() => {
    const interval = setInterval(async () => {
        await updateUserStatus(userId, true);
    }, 1000);

    return () => clearInterval(interval);
}, [userId]);

useEffect(() => {
    const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
            const payload = JSON.stringify({ userId, isOnline: false });
            navigator.sendBeacon('http://localhost/buzzchat_backend/action/update_user_status.php', payload);
        }
    };

    const handleBeforeUnload = (event) => {
        const payload = JSON.stringify({ userId, isOnline: false });
        navigator.sendBeacon('http://localhost/buzzchat_backend/action/update_user_status.php', payload);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('beforeunload', handleBeforeUnload);
    };
}, [userId]);

const updateStatus = async (isOnline) => {
    await updateUserStatus(userId, isOnline);
};


  useEffect(() => {
   if(userId){
    const fetchUserStatus = async (userId) => {
      const response = await fetch('http://localhost/buzzchat_backend/action/get_user_status.php', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      setUserStatus(data);
  };

  fetchUserStatus(userId); // Initial fetch

  const interval = setInterval(() => {
      fetchUserStatus(userId);
  }, 5000); // Poll every 5 seconds

  return () => clearInterval(interval);
   }
}, [userId]);





  return (
    <>
      <div className="wrapper flex flex-col sm:flex-col md:flex-row w-full bg-white h-lvh lg:overflow-hidden">
        <Nav updateStatus={updateStatus} showTab={showTab} activeTab={activeTab} activeGroup={activeGroup} activeContact={activeContact} />
        <div className="w-full h-full flex flex-col lg:flex-row" style={{ backgroundColor: "#f7f7fb" }}>
          <div className="lg:w-1/4 h-full relative">
            {activeTab === 'chat' && <Chat userDetails={userDetails} onMessageClick={handleMessageClick} />}
            {activeTab === 'profile' && <Profile  userDetails={userDetails} userStatus={userStatus} />}
            {activeTab === 'group' && <Group userDetails={userDetails} showModal={showModal} onMessageClick={handleGroupMessageClick} />}
            {activeTab === 'contact' && <Contact userDetails={userDetails} showModal2={showModal2} onMessageClick={handleMessageClick} />}
            {activeTab === 'setting' && <Setting userDetails={userDetails} showModal3={showModal3} />}
          </div>
          <div className="w-full lg:w-3/4 h-full">
            {activeContact ? (
              <Converstion userDetails={userDetails} contactId={activeContact} onBackClick={handleBackClick} />
            ) : (

              <div className='w-full h-full'>
                {activeGroup ? (
                  <Group_conversation userDetails={userDetails} groupId={activeGroup} onBackClick={handleGroupBackClick} />
                ) : (
                  <div className="w-full h-screen bg-white relative hidden lg:flex flex flex-col items-center justify-center text-center p-4">
                    <div className="animate-bounce mb-4">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">Welcome to BuzzChat</h2>
                    <p className="text-gray-500">Select a contact to start a conversation</p>
                  </div>
            )}
              </div>
            )
            }
          </div>
        </div>
      </div>
      <Modal  userDetails={userDetails} show={show} handleClose={hideModal} />
      <Modal2 userDetails={userDetails} show={show2} handleClose={hideModal2} />
      <Modal3 userDetails={userDetails} show={show3} handleClose={hideModal3} />
    </>
  );
};

export default Home;
