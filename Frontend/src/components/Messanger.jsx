import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import Friend from "./Friend";
import {
  addNewMessage,
  changeTyping,
  getFriends,
  getMessagesFromDB,
  saveMessageToDB,
  setMessageStatus,
  setMySocketId,
} from "../store/messanger/messanger";
import Profile from "./Profile";
import Messages from "./Messages";
import { getUniqueId } from "../utils/utils";

const Messanger = () => {
  const { myInfo } = useSelector((state) => state.auth);
  const { friends, activeUser, mySocketId } = useSelector(
    (state) => state.messanger
  );
  const [activeFriends, setActiveFriends] = useState([]);

  const socketRef = useRef(null);
  const currentFriendRef = useRef(null);
  const currentUser = useRef(null);

  const setCurrentFriend = (value) => {
    currentFriendRef.current = value;
  };

  const setCurrentUser = (value) => {
    currentUser.current = value;
  };

  const dispatch = useDispatch();

  const addMessageFromSender = (data) => {
    console.log(data);
    dispatch(addNewMessage(data));
  };

  const initializeSocket = async () => {
    socketRef.current = io("ws://localhost:8080");
    const socket = socketRef.current;
    socket.on("connect", () => {
      // console.log(socket.id + " connected");

      socket.emit("addUser", { userId: myInfo.id });

      socket.on("activeUsers", (data) => {
        setActiveFriends(data);
      });

      socket.on("getMessage", (data) => {
        const { messageId, senderSocketId } = data;
        socket.emit("messageDelivered", {
          messageId,
          senderSocketId,
          status: "delivered",
        });
        addMessageFromSender(data);
      });

      socket.on("messageSent", (data) => {
        console.log("Message delivered", data);
        dispatch(setMessageStatus(data));
      });

      socket.on("messageGotSeen", (data) => {
        dispatch(setMessageStatus(data));
      });

      socket.on("typing", (data) => {
        dispatch(changeTyping(true));
        console.log(`${data.socketId} is typing`);
      });

      socket.on("not_typing", (data) => {
        dispatch(changeTyping(false));
        console.log(`${data.socketId} stopped typing`);
      });
    });
  };

  function makeMessageSeen(data) {
    const socket = socketRef.current;
    socket.emit("messageSeen", { ...data, status: "seen" });
  }

  const getActiveFriends = async () => {
    const socket = socketRef.current;
    socket.on("activeUsers", (data) => {
      console.log({ active: data });
    });
  };

  //Sends new message
  const addMessage = ({ content, sender }) => {
    const socket = socketRef.current;
    const currentFriend = currentFriendRef.current;
    const newMessage = {
      messageId: getUniqueId(),
      receiver: activeUser,
      sender,
      content,
      socketId: currentFriend,
      senderSocketId: mySocketId,
      status: "sent",
    };
    dispatch(addNewMessage(newMessage));
    dispatch(saveMessageToDB({...newMessage}));
    socket.emit("sendMessage", newMessage);
  };

  const sendTypingIndication = () => {
    const socket = socketRef.current;
    const currentFriend = currentFriendRef.current;
    socket.emit("typingIndication", {
      socketId: currentFriend,
      senderSocketId: mySocketId,
    });
  };

  const stoppedTyping = () => {
    const socket = socketRef.current;
    const currentFriend = currentFriendRef.current;
    socket.emit("stoppedTyping", {
      socketId: currentFriend,
      senderSocketId: mySocketId,
    });
  };

  useEffect(() => {
    dispatch(getMessagesFromDB())
  },[])

  useEffect(() => {
    initializeSocket();
    getActiveFriends();
  }, []);

  useEffect(() => {
    dispatch(getFriends());
  }, []);

  useEffect(() => {
    const handleTabClose = (e) => {
      e.returnValue = "Are you sure you want to leave?";
      const socket = socketRef.current;
      socket.on("disconnect", () => {
        console.log("Disconnect is running");
        socket.emit("disconnectUser", { userId: myInfo.id });
      });
    };

    // window.addEventListener("beforeunload", handleTabClose);

    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, []);

  useEffect(() => {
    (function () {
      const me = activeFriends.find((friend) => friend.userId === myInfo.id);
      if (me && me.socketId) dispatch(setMySocketId(me.socketId));
    })();
  }, [activeUser]);

  useEffect(() => {
    if (friends.length >= 2) {
      currentUser.current = friends[1]._id;
      console.log(currentUser);
    }
  }, [friends]);

  return (
    <div className="h-screen w-screen flex">
      {/* Friends List  */}
      <div className="w-1/5 h-full border-2 flex flex-col items-center gap-2 p-2">
        {friends.length > 0 &&
          friends.map((friend) => {
            const frndData = activeFriends.find(
              (frnd) => frnd.userId === friend._id
            );
            const socketId = frndData?.socketId;
            return friend._id !== myInfo.id ? (
              <Friend
                key={friend._id}
                data={friend}
                isActive={socketId ? true : false}
                setCurrentFriend={setCurrentFriend}
                socketId={socketId}
                currentUser={currentUser.current}
                setCurrentUser={setCurrentUser}
              />
            ) : null;
          })}
      </div>
      {/* Messages  */}
      <div className="w-3/5 h-full border-2">
        <Messages
          addMessage={addMessage}
          makeMessageSeen={makeMessageSeen}
          sendTypingIndication={sendTypingIndication}
          stoppedTyping={stoppedTyping}
        />
      </div>
      {/* Gallery  */}
      <div className="w-1/5 h-full border-2 p-2">
        <Profile data={myInfo} />
      </div>
    </div>
  );
};

export default Messanger;
