import React from 'react'
import {
  Box,
 
} from "@chakra-ui/react";
import { ChatState } from '../context/ChatProvider'
import SingleChat from './SingleChat';


const ChatBox = ({fetchAgain,setFetchAgain}) => {

const {selectedChat}=ChatState()

  return (
   <Box d={{base:selectedChat ? "flex":"none" , md:"flex"}}
   alignItems="center"
   bg="white"
   flexDirection="column"
   p={3}
   w={{base:"100%" , md:"68%"}}
   borderRadius="lg"
   borderWidth="1px"
   >
   <SingleChat fetchAgain={fetchAgain} setFetchChat={setFetchAgain}/>
   </Box>
  )
}

export default ChatBox