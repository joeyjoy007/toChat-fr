import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";
import ProfileOrder from "./miscellenous/ProfileOrder";
import UpdateGroupChatModal from "./miscellenous/UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import io from 'socket.io-client'
import './style.css'

var socket,selectedChatCompare

const SingleChat = ({ fetchAgain , setFetchAgain }) => {

  const toast = useToast()
  const { user, selectedChat, setSelectedChat , notifications,setNotifications } = ChatState();

  const [message, setMessage] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const ENDPOINT = "http://localhost:4000"




  useEffect(() => {
     
    socket = io(ENDPOINT)
    socket.emit("setup",user)
    socket.on("connected",()=>setSocketConnected(true))
    socket.on("typing",()=>setIsTyping(true))
    socket.on("stop typing",()=>setIsTyping(false))
 
  }, [])



  const fetchMessage = async()=>{
    if(!selectedChat) return

    try {

      setLoading(true)

      const config = {
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${user.token}`
        }
      }

        setLoading(true)
      const {data} = await axios.get(`/api/message/${selectedChat._id}`,config)

      setMessage(data)
     
      setLoading(false)
   
      socket.emit("join chat",selectedChat._id)
   
    } catch (error) {
      toast({
        title: 'error occured',
        description: error.message,
        status: 'warning',
        duration: 4000,
        isClosable: true,
      })
    
    }
  }
  


  const sendMessage = async(e)=>{




    if(e.key === "Enter" && newMessage){
      socket.emit("stop typing",selectedChat._id)
      try {
        const config = {
          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${user.token}`
          }
        }
        
        setNewMessage("")

        const {data} = await axios.post("/api/message",{
          content:newMessage,
          chatId:selectedChat._id
        },config) 


        socket.emit("new message",data)

        setMessage([...message,data])

      } catch (error) {
        toast({
          title: 'error occured',
          description: error.message,
          status: 'warning',
          duration: 4000,
          isClosable: true,
        })
        
      }
    }

  }



 

  useEffect(() => {
    fetchMessage()

    selectedChatCompare = selectedChat
  }, [selectedChat])


  useEffect(() => {
   socket.on("message received",(newMessageReceived)=>{

    if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id)
    {
      if(!notifications.includes(newMessageReceived)){
        setNotifications([newMessageReceived,...notifications])
        setFetchAgain(!fetchAgain)
      }
    }else{
      setMessage([...message,newMessageReceived])
    }

   })
  },)
  

  
  const typingHandler = (e)=>{
      setNewMessage(e.target.value)

      if(!socketConnected) return 
      
      if(!typing){
        setTyping(true)
        socket.emit("typing",selectedChat._id)
      }
      
      let lastTyping = new Date().getTime()
      var timerLength = 3000

      setTimeout(() => {
        var timeNow = new Date().getTime()
        var timediff = timeNow - lastTyping

        if(timediff >= timerLength && typing){
          socket.emit("stop typing",selectedChat._id)
          setTyping(false)
        }
        
      }, timerLength);
  }

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            fontSize={{ base: "28px", md: "30px" }}
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {message &&
              ( !selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}

                <ProfileOrder user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
                <>
              {selectedChat.chatName.toUpperCase()}
              <UpdateGroupChatModal
              fetchMessage = {fetchMessage}
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
            
              />
             
              </>
           ) )}
          </Text>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            w="100%"
            bg="#e8e8e8"
            h="100%"
            borderRadius="lg"
            overflow="hidden"
          >
           {
             loading?(
               <Spinner
               size="xl"
               w={20}
               h={20}
               alignSelf="center"
               margin="auto"
               />
             ):(
               <div className="message">
               <ScrollableChat message = {message}/>
               </div>
             )
           }
           <FormControl onKeyDown={sendMessage} isRequired mt={3} >
           {isTyping ? <div>Typing...</div>:""}
           <Input
           variant="filled"
           bg="#e0e0e0"
           placeholder="Type a message..."
           onChange={typingHandler}
           value={newMessage}
           />
           </FormControl>
          </Box>
        </>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
