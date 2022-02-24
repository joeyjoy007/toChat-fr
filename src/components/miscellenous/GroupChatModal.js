import { Box, Button, FormControl, Input, Modal,  ModalBody,  ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import UserBadge from '../userAvatar/UserBadge'
import UserListitem from '../userAvatar/UserListitem'

const GroupChatModal = ({children}) => {

    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState()
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)

    const toast = useToast()

    const handelSearch = async (query)=>{
        setSearch(query)
        if(!query){
            return;
        }

        try {
            setLoading(true)

            const config = {
                headers:{
                    Authorization: `Bearer ${user.token}`
                }
            }

            const {data} = await axios.get(`api/user?search=${search}`,config)
            console.log(data)
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast({
                title: 'error occured',
                
                status: 'warning',
                duration: 5000,
                isClosable: true,
              })
            
        }

    }

    const handelSubmit = async()=>{

      if(!groupChatName || !selectedUsers){
        toast({
          title: 'please fill al fields',
         
          status: 'warning',
          duration: 4000,
          isClosable: true,
          position:"top"
        })
        return
      }

      try {
        const config = {
          headers:{
              Authorization: `Bearer ${user.token}`
          }
      }
      const {data} = await axios.post("/api/chat/group",{
        name:groupChatName,users:JSON.stringify(selectedUsers.map((u)=>u._id))

      },config)

      setChat([data,...chat])
      onClose()

      } catch (error) {
        toast({
          title: 'error occured',
         
          status: 'warning',
          duration: 4000,
          isClosable: true,
          position:"top"
        })
        
      }

    }

    const handelDelete = (userDelete)=>{
 
     setSelectedUsers( selectedUsers.filter((sel)=>sel._id !== userDelete._id))

    }

    const handelGroup = (userToAdd)=>{

      if(selectedUsers.includes(userToAdd)){
        toast({
          title: 'user already added',
         
          status: 'warning',
          duration: 5000,
          isClosable: true,
        })
        return
      }

      setSelectedUsers([...selectedUsers,userToAdd])

    }



    const {user,chat,setChat} = ChatState()

    const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <div>
    <Button onClick={onOpen}>{children}</Button>
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" fontFamily="Work sans" d="flex" justifyContent="center" >Create Group Chat</ModalHeader>
          <ModalCloseButton />
         <ModalBody d="flex" flexDir="column" alignItems="center">
         <FormControl>
         <Input placeholder='chat name' mb={3} onChange={e=>setGroupChatName(e.target.value)} />
         <Input placeholder='add users...' mb={1} onChange={e=>handelSearch(e.target.value)} />
         </FormControl>
         </ModalBody>

        <Box w="100%" d="flex" flexWrap="wrap">
        {selectedUsers.map((U)=>{
        return  <UserBadge key={U._id} user ={U} handelFunction={()=>handelDelete(U)}/>
        })}
       
        
        </Box>

            {loading ? (<div>loading...</div>):(
                searchResult?.slice(0,4).map((user)=><UserListitem key={user._id} user={user} handleFunction = {()=>handelGroup(user)}/>)

            )}
          <ModalFooter>
            <Button colorScheme='blue'  onClick={handelSubmit} >
              create chat
            </Button>
       
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default GroupChatModal