import {createContext, useState} from 'react';

export const GlobalContext = createContext(null);

function GlobalState({children}) {
  const [showLoginView, setShowLoginView] = useState(false);
  const [name, setName] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [allChatRooms, setAllChatRooms] = useState([]);
  const [modalVisible, setModalVisible] = useState(true);
  const [currentGroupName, setCurrentGroupName] = useState('');
  const [allChatMessages, setAllChatMessages] = useState([]);
  const [currentChatMesage, setCurrentChatMessage] = useState('');

  return (
    <GlobalContext.Provider
      value={{
        showLoginView,
        setShowLoginView,
        name,
        setName,
        currentUser,
        setCurrentUser,
        allUsers,
        setAllUsers,
        allChatRooms,
        setAllChatRooms,
        modalVisible,
        setModalVisible,
        currentGroupName,
        setCurrentGroupName,
        allChatMessages,
        setAllChatMessages,
        currentChatMesage,
        setCurrentChatMessage,
      }}>
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalState;
