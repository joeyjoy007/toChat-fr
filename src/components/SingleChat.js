import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";
import ProfileOrder from "./miscellenous/ProfileOrder";
import UpdateGroupChatModal from "./miscellenous/UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import './style.css'

const SingleChat = ({ fetchAgain , setFetchAgain }) => {

  const toast = useToast()
  const { user, selectedChat, setSelectedChat } = ChatState();

  const [message, setMessage] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const sendMessage = async(e)=>{



    if(e.key === "Enter" && newMessage){
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

        console.log(data)

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

      const {data} = await axios.get(`/api/message/${selectedChat._id}`,config)
      console.log(data)
      setMessage(data)
      setLoading(false)
      
    } catch (error) {
      toast({
        title: 'error occured',
        description: error.message,
        status: 'warning',
        duration: 4000,
        isClosable: true,
      })
      setLoading(false)
    }
  }
  

  useEffect(() => {
    fetchMessage()
  }, [selectedChat])
  
  const typingHandler = (e)=>{
      setNewMessage(e.target.value)
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
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users).toUpperCase()}

                <ProfileOrder user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
                <>
              {selectedChat.chatName.toUpperCase()}
              <UpdateGroupChatModal
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
              fetchMessage = {fetchMessage}
              />
             
              </>
            )}
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
               <div className="">
               <ScrollableChat message = {message}/>
               </div>
             )
           }
           <FormControl onKeyDown={sendMessage} isRequired mt={3} >
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
