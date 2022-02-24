import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const Signup = () => {
  const navigate = useNavigate()

  const toast = useToast()

  const [name, setName] = useState("");
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false)

  const handelClick = (e) => {
    e.preventDefault();

    setShow(!show);
  };

  const postDetails = (pics)=>{
    setLoading(true)
    if(pics === undefined){
      toast({
        title: 'Please select image',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      return
    }
    if(pics.type === "image/jpeg" || pics.type === "image/png"){
      const data = new FormData()
      data.append("file",pics)
      data.append("upload_preset","chat-app")
      data.append("cloud_name","dhrocn7ur");

      fetch("https://api.cloudinary.com/v1_1/dhrocn7ur/image/upload",{
        method:'post',body:data
      }).then((res)=>res.json()).then(data=>{
        setPic(data.url.toString());
        console.log(data.url.toString())
        setLoading(false)
      }).catch((err)=>{
        console.log(err)
        setLoading(false)
      })
    }
      else{
        toast({
          title: 'Please select image',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        })
        setLoading(false)
        return
      }
  }

  const submitHandler =async (e)=>{
setLoading(true)
if(!name || !email || !password || !confirmPassword){
  toast({
    title: 'Please fill fields',
    status: 'warning',
    duration: 5000,
    isClosable: true,
  })
  setLoading(false)
  return

}
if(password !== confirmPassword){
  toast({
    title: 'password not match',
    status: 'warning',
    duration: 5000,
    isClosable: true,
  })
  setLoading(false)
  return
}


try {
  const config = {
    headers:{
      "Content-Type":"application/json"
    },
   
  }
  const {data} = await axios.post("/api/user",
  {name,email,password,pic}
  ,config)
  toast({
    title: 'registration success',
    status: 'success',
    duration: 5000,
    isClosable: true,
  })
  localStorage.setItem('userInfo',JSON.stringify(data))
  setLoading(false);
  navigate('/chat')
  
  
} catch (error) {
  toast({
    title: "error occured",
    status: 'warning',
    duration: 5000,
    isClosable: true,
  })
  setLoading(false)
}


  }

  return (
    <VStack spacing="5px" color="black">
      <FormControl id="first_name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="enter your name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>email</FormLabel>
        <Input
          placeholder="enter your email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>password</FormLabel>
        <InputGroup>
          <Input
            placeholder="enter your password"
            type={show ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={(e) => handelClick(e)}>
              {show ? "Hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="confirmPassword" isRequired>
        <FormLabel>confirm password</FormLabel>
        <InputGroup>
          <Input
            placeholder="confirm your password"
            type={show ? "text" : "password"}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={(e) => handelClick(e)}>
              {show ? "Hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>


      <FormControl id="pic">
      <FormLabel>Upload your picture</FormLabel>
      <Input
      type="file"
      p={1.5}
      accept="image/*"
      onChange={(e)=>postDetails(e.target.files[0])}
      />
      </FormControl>

      <Button 
      colorScheme="blue"
      width="100%"
      isLoading={loading} 
      style={{marginTop:"15px"}}
      onClick={submitHandler}>Sign up</Button>
    </VStack>
  );
};

export default Signup;
