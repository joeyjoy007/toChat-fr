import { Avatar, Tooltip } from '@chakra-ui/react'
import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, sameSenderMargin, sameUser } from '../config/ChatLogics'
import { ChatState } from '../context/ChatProvider'

const ScrollableChat = ({message}) => {
    

    const {user} = ChatState()

  return (
    <ScrollableFeed>
    {message 
      &&
       message.map((m,i)=>(
        <div style={{display:"flex"}} key={m._id}>
        {(isSameSender(message, m, i, user._id) ||
          isLastMessage(message, i, user._id)) && (
          <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
            <Avatar
              mt="7px"
              mr={1}
              size="sm"
              cursor="pointer"
              name={m.sender.name}
              src={m.sender.pic}
            />
          </Tooltip>
        )}
        <span style={{backgroundColor:`${m.sender._id === user._id ?"#bee38f":"#b9f5d0"}`,borderRadius:"20px",marginLeft: sameSenderMargin(message,m,i,user._id),marginTop:sameUser(message,m,i)?3:10 ,padding:"5px 15px",maxWidth:"75%"}}>{m.content}</span>
        
        </div>

       ))}
    
    </ScrollableFeed>
  )
}

export default ScrollableChat