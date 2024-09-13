const MessagesList = () => {
  return (
    <div>MessagesList</div>
  )
}
export default MessagesList

// import { client, databases } from '@/lib/appwrite/config';
// import { Models } from "appwrite";
// import React, { useState, useEffect } from 'react';
// // import { databases, client } from './lib/appwrite/api';

// type MessagesListProps = {
//   message: Models.Document;
// }

// const MessagesList = ({ message }: MessagesListProps) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');

//   // Your database and collection IDs
//   const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
//   const collectionId = import.meta.env.VITE_APPWRITE_MESSAGES_COLLECTION_ID;

//   // Fetch all messages when the component loads
//   useEffect(() => {
//     fetchMessages();

//     // Real-time updates
//     const unsubscribe = client.subscribe(`databases.${databaseId}.collections.${collectionId}.documents`, (response) => {
//       if (response.events.includes('databases.*.collections.*.documents.*.create')) {
//         setMessages((prevMessages) => [...prevMessages, response.payload]);
//       }
//     });

//     return () => unsubscribe(); // Cleanup subscription on unmount
//   }, []);

//   // Fetch all messages from the database
//   const fetchMessages = async () => {
//     try {
//       const response = await databases.listDocuments(databaseId, collectionId);
//       setMessages(response.documents);
//     } catch (error) {
//       console.error('Failed to fetch messages:', error);
//     }
//   };

//   // Send a new message to the Appwrite database
//   const sendMessage = async (e) => {
//     e.preventDefault();

//     if (!newMessage) return;

//     try {
//       await databases.createDocument(databaseId, collectionId, 'unique()', {
//         text: newMessage,
//         sender: 'user-id', // Replace with actual user info
//         timestamp: new Date().toISOString(),
//       });
//       setNewMessage(''); // Clear input field
//     } catch (error) {
//       console.error('Failed to send message:', error);
//     }
//   };

//   return (
//     <div className="chat-container flex flex-col max-w-lg mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
//       <div className="message-list flex-1 overflow-y-auto">
//         {messages.map((message) => (
//           <div key={message.$user_id} className="message-item my-2 p-2 bg-white rounded-lg shadow">
//             <span className="sender font-semibold">{message.user_id}</span>
//             <p className="text">{message.text}</p>
//             <span className="text-sm text-gray-500">{new Date(message.timestamp).toLocaleTimeString()}</span>
//           </div>
//         ))}
//       </div>

//       <form className="message-input flex mt-4" onSubmit={sendMessage}>
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           className="w-full p-2 border rounded-l-lg focus:outline-none"
//           placeholder="Type your message..."
//         />
//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
//         >
//           Send
//         </button>
//       </form>
//     </div>
//   );
// };

// export default MessagesList;
