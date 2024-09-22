import React, { useEffect } from 'react';
import axios from 'axios';

const ChatMessage = ({ message, currentUser }) => {
  useEffect(() => {
    if (message) {
      let readByArray = message.read_by;
      if (typeof readByArray === 'string') {
        try {
          readByArray = JSON.parse(readByArray);
        } catch (error) {
          console.error('Error parsing read_by:', error);
          readByArray = [];
        }
      }
      if (Array.isArray(readByArray)) {
        if (!readByArray.includes(currentUser.id)) {
          axios.post('http://localhost/buzzchat_backend/action/update_group_read_status.php', {
            message_id: message.message_id,
            user_id: currentUser.id
          }).then(response => {
            console.log('Read status updated:', response.data);
          }).catch(error => {
            console.error('There was an error updating the read status!', error);
          });
        }
      }
    } 
  }, [message, currentUser]);

  return (
    <div className={`message ${message && Array.isArray(message.read_by) && message.read_by.includes(currentUser.id) ? 'read' : 'unread'}`}>
      <p className={message.user_id === currentUser.id ? 'text-white text-left break-words' : 'text-gray-800 break-words'}>{message.message}</p>
    </div>
  );
};

export default ChatMessage;
