import React, { useState } from "react";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  effect,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  toast,
  Tooltip,
  useDisclosure,
 
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import ProfileOrder from "./ProfileOrder";
import { useNavigate } from "react-router-dom";
import { useToast } from '@chakra-ui/react'
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListitem from "../userAvatar/UserListitem";
import { getSender } from "../../config/ChatLogics";
import NotificationBadge from 'react-notification-badge'


const SideDrawer = () => {

  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const toast = useToast()


  const { user,chat,setSelectedChat,setChat,notifications,setNotifications } = ChatState();

  console.log("NOTIFICATION" , notifications)
  const handelSearch = async ()=>{
    if(!search){
      toast({
        title: 'fill the fields',
     
        status: 'warning',
        duration: 9000,
        isClosable: true,
        position:"top-left"
      });
      return;
    }
      try {
        setLoading(true);
        const config = {
          headers:{
            Authorization:`Bearer ${user.token}`,
          },
        };

        const {data} = await axios.get(`/api/user?search=${search}`,config);
     

        setLoading(false)
        setSearchResult(data)

      } catch (error) {
        toast({
        title: 'error occured',
        description:"failed to load the search results",
        status: 'warning',
        duration: 9000,
        isClosable: true,
        position:"top-left"
      });
      }

  }



  const accessChat = async (userId)=>{
    try {
      setChatLoading(true)
     

      const config = {
        headers:{
          "Content-type":"application/json",
          Authorization:`Bearer ${user.token}`,
        },
      };

      const {data } = await axios.post(`/api/chat`,{userId},config)
      
      if(!chat.find((c)=>c._id === data._id))
      setChat([data,...chat])

      setSelectedChat(data)
      setChatLoading(false)

    } catch (error) {
      toast({
        title: 'error occured',
      
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
    }

  }

  const navigate = useNavigate()

  const logoutHandler = ()=>{
    localStorage.removeItem("userInfo");
    navigate('/')
  
}

const { isOpen, onOpen, onClose } = useDisclosure()





  return (
    <>
      <Box
        d="flex"
        justifyContent={"space-between"}
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="search users to chat" hasArrow placement="bottom-end">
          <Button varient="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Chat App
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
            <NotificationBadge
            count={notifications.length}
            effect={effect.SCALE}
            />
              <BellIcon fontSize="2xl" m="1" />
            </MenuButton>
          <MenuList pl={10}>
          {!notifications.length && "no new notification"}
         {notifications.map((notif)=>(
            <MenuItem key={notif._id} onClick={()=>{setSelectedChat(notif.chat)
               setNotifications(notifications.filter((n)=>n !== notif))}  }>
            {notif.chat.isGroupChat?
            `New message in ${notif.chat.chatName}`:
          `new message from ${getSender(user,notif.chat.users)}`}
            </MenuItem>
            ))}
          </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
            <ProfileOrder user={user}>
            <MenuItem>My Profile</MenuItem>
            </ProfileOrder>
           
              <MenuDivider/>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer
      isOpen={isOpen}
      placement='left'
      onClose={onClose} 
      >
      <DrawerOverlay/>
      <DrawerContent>
      <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
      <DrawerBody>
      <Box d="flex" pb={2}>
      <Input
      placeholder="search by name or email"
      me={2}
      value={search}
      onChange={e=>setSearch(e.target.value)}
      />
      <Button onClick={handelSearch}>Go</Button>
      </Box>

      {loading?(
<ChatLoading/>
      ):(
searchResult?.map(user=>{
 return <UserListitem
  key={user._id}
 user={user}
  handleFunction = {()=>accessChat(user._id) }
  />
})
      )}
{chatLoading && <Spinner ml="auto" d="flex"/>}
      </DrawerBody>
      </DrawerContent>
     
  
      </Drawer>
    </>
  );
};

export default SideDrawer;
