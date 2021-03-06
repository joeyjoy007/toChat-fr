import {createContext, useContext, useEffect, useState} from 'react'


const ChatContex = createContext()


const ChatProvider = ({children})=>{
 
    const [user, setUser] = useState("")
    const [selectedChat, setSelectedChat] = useState()
    const [chat, setChat] = useState([])
    const [notifications, setNotifications] = useState([])
 

    useEffect(() => {
      const userInfo =JSON.parse(localStorage.getItem('userInfo'))
      setUser(userInfo);
    

     
    }, [])
   

    return <ChatContex.Provider value={{user,setUser,selectedChat,setSelectedChat,chat,setChat,notifications,setNotifications}}>{children}</ChatContex.Provider>
}

export const ChatState = ()=>{
    return useContext(ChatContex)
}


export default ChatProvider