import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  StatLabel,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import UserBadge from "../userAvatar/UserBadge";
import UserListitem from "../userAvatar/UserListitem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain,fetchMessage }) => {
  const [groupChatName, setGroupChatName] = useState();

  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoadin, setRenameLoadin] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();


  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoadin(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      console.log(data);

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoadin(false);
    } catch (error) {
      toast({
        title: "error occured",
        description: error.message,
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      setRenameLoadin(false);
      setGroupChatName("");
    }
  };

  const handelSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "error occured",
        description: error.message,
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      setLoading(false);
    }
  };



  const handelAddUser = async(user1)=>{

      if(selectedChat.users.find((u)=>u._id === user1._id)){
        toast({
          title: "user already exist",
         
          status: "warning",
          duration: 4000,
          isClosable: true,
          position:"top"
        });
      }

      if(selectedChat.groupAdmin._id !== user._id){
        toast({
          title: "only admin can add",
         
          status: "warning",
          duration: 4000,
          isClosable: true,
          position:"top"
        });
        return
      }


      try {
        setLoading(true)

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const {data} = await axios.put('/api/chat/groupAdd',
        {
      chatId:selectedChat._id,
      userId:user1._id
    },config)
        setSelectedChat(data)
        setFetchAgain(!fetchAgain)
        setLoading(false)
        
       
      } catch (error) {
        toast({
          title: "error occured",
          description:error.message,
         
          status: "warning",
          duration: 4000,
          isClosable: true,
          position:"top"
        });
      }
  }
const handelRemove = async(user1)=>{
  if(selectedChat.groupAdmin._id !== user._id &&user1._id !== user._id){
    toast({
      title: "error occured1",
      
      status: "warning",
      duration: 4000,
      isClosable: true,
      position:"top"
    });
    return 
  }

  try {
    setLoading(true)

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const {data} = await axios.put('/api/chat/groupRemove',{
      chatId:selectedChat._id,
      userId:user1._id
    },config)
    user1._id === user._id?setSelectedChat(""):setSelectedChat(data)

    setFetchAgain(!fetchAgain)
    fetchMessage()
    setLoading(false)
  } catch (error) {
    toast({
      title: "error occured",
      description:error.message,
     
      status: "warning",
      duration: 4000,
      isClosable: true,
      position:"top"
    });
    setLoading(false)
    
  }

}
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            d="flex"
            fontFamily="Work sans"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => {
                return (
                  <UserBadge
                    key={u._id}
                    user={u}
                    handelFunction={() => handelRemove(u)}
                  />
                );
              })}
              </Box>
              <FormControl d="flex">
                <Input
                  placeholder="chat name"
                  mb={3}
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
                <Button
                  variant="solid"
                  colorScheme="teal"
                  ml={1}
                  isLoading={renameLoadin}
                  onClick={() => handleRename()}
                >
                  Update
                </Button>
              </FormControl>
              <FormControl>
                <Input
                  placeholder="add user to group"
                  mb={1}
                  onChange={(e) => handelSearch(e.target.value)}
                />
              </FormControl>
              {loading?(
                <Spinner size="lg"/>
              ):(
               searchResult.map((s)=>{
                 return <UserListitem key={s._id} user={s} handleFunction = {()=>handelAddUser(s)}/>
               })
              )}
           
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handelRemove(user)}>
              Leave group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
