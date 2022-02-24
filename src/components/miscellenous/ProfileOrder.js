import React from 'react'
import {
   
    Button,
    IconButton,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
  } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { Navigate } from 'react-router-dom'

const ProfileOrder = ({user,children}) => {
   

    const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
    {children ? (
        <span onClick={onOpen}>{children}</span>
    ):(
<IconButton d={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>

    )}
    <Modal size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader fontSize="40px" fontFamily="Work sans" d="flex" justifyContent="center" >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDirection="column" justifyContent="space-between" alignItems="center">
            <Image
            borderRadius="full"
            boxSize="150px"
            src={user.pic}
            alt={user.name}
            />
            <Text fontSize={{base:"28px" , md:"30px"}} fontFamily="Work sans">Email: {user.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileOrder