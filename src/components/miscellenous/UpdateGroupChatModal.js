import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, Divider, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import UserBadge from '../userAvatar/UserBadge'

const UpdateGroupChatModal = ({fetchAgain,setFetchAgain}) => {


  const [groupChatName, setGroupChatName] = useState()

  const [search, setSearch] = useState()
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [renameLoadin, setRenameLoadin] = useState(false)

  const {user,selectedChat,setSelectedChat} = ChatState()

  const handleDelete = (u)=>{

  }

  const handleRename = async ()=>{

    if(!groupChatName) return 

    try {
      setRenameLoadin(true)
      const config = {
        headers:{
            Authorization: `Bearer ${user.token}`
        }
    }

        const {data} = await axios.put("/api/chat/rename",{
         chatId: selectedChat._id, chatName:groupChatName
        },config)
        console.log(data)

          setSelectedChat(data)
          setFetchAgain(!fetchAgain)
          setRenameLoadin(false)
      
    } catch (error) {
      toast({
        title: 'error occured',
        description:error.message,
        status: 'warning',
        duration: 4000,
        isClosable: true,
      })
      
    }

  }

  const handelSearch = ()=>{

  }

  const handelRemove = ()=>{

  }

  const toast = useToast()

    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
     <>
        <IconButton d={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>
  
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader 
            fontSize="35px"
            d="flex"
            fontFamily="Work sans"
            justifyContent = "center"

            >{selectedChat.chatName}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <Box
            w="100%"
            d="flex"
            flexWrap="wrap"
            pb={3}
            >
            {selectedChat.users.map((u)=>{
            return  <UserBadge
              key={u._id}
              user={u}
              handelFunction={()=>handleDelete(u)}
              />
            })}

            <FormControl d="flex">
            <Input
            placeholder='chat name'
            mb={3}
            value={groupChatName}
            onChange={e=>setGroupChatName(e.target.value)}
            />
            <Button
            variant="solid"
            colorScheme="teal"
            ml={1}
            isLoading={renameLoadin}
            onClick={()=>handleRename()}
            >Update</Button>
            
            
            </FormControl>
            <FormControl>
            <Input
            placeholder='add user to group'
            mb={1}
            onChange = {e=>handelSearch(e.target.value)}
            />
            </FormControl>
            </Box>
           
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='red' mr={3} onClick={()=>handelRemove(user)}>
                Leave group
              </Button>
         
            </ModalFooter>
          </ModalContent>
        </Modal>
        </>
      )
}

export default UpdateGroupChatModal