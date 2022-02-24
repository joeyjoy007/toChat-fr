import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  toast,
  useToast,
  VStack,
} from "@chakra-ui/react";

import axios from 'axios'

import {useNavigate} from "react-router-dom";

const Login = () => {

  const navigate = useNavigate()

  const toast = useToast()

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)

  const handelClick = (e) => {
    e.preventDefault();

    setShow(!show);
  };


  const submitHandler =async (e)=>{
    setLoading(true)
    if(!email || !password){
      toast({
        title: 'fill fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      setLoading(false)
    }

    try {
      const config = {
        headers:{
          "Content-Type":"application/json"
        },
      };
      const {data} = await axios.post("/api/user/login",{email,password},config)

      toast({
        title: 'login success',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      localStorage.setItem("userInfo",JSON.stringify(data));
      setLoading(false);
      navigate('/chat')
      
      
    } catch (error) {
      toast({
        title: 'error occured',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      setLoading(false)
    }
      
  }

  return (
    <VStack spacing="5px" color="black">
    

      <FormControl id="email" isRequired>
        <FormLabel>email</FormLabel>
        <Input
          placeholder="enter your email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>password</FormLabel>
        <InputGroup>
          <Input
            placeholder="enter your password"
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={(e) => handelClick(e)}>
              {show ? "Hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>




      <Button 
      colorScheme="blue" isLoading={loading} width="100%" style={{marginTop:"15px"}} onClick={submitHandler}>Login
      </Button>
      <Button 
      colorScheme="red" width="100%" style={{marginTop:"15px"}} onClick={()=>{
        setEmail("guest@example.com");
        setPassword("123456")
      }}>Get Guest Credentials
      </Button>
    </VStack>
  );
};

export default Login;
