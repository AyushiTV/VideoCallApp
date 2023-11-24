import socket from '../socket';
import React, {useState, useEffect, useCallback} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('message', message => {
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, {
          ...message,
          createdAt: new Date(message.createdAt),
          user: {_id: message.user._id},
        }),
      );
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const onSend = useCallback((newMessages = []) => {
    socket.emit('message', newMessages[0].text);
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      user={{_id: 1}}
      renderUsernameOnMessage
      showUserAvatar
      renderAvatarOnTop
    />
  );
};

export default ChatScreen;
