import { Box } from '@chakra-ui/react'
import React from 'react'
import { CloseIcon} from "@chakra-ui/icons";

const UserBadge = ({user,handelFunction}) => {
  return (
   <Box
   px={2}
   py={1}
   borderRadius="lg"
   m={1}
   mb={2}
   variant="solid"
   fontSize={12}
   background="purple"
   color="white"
   cursor="pointer"
   onClick={handelFunction}
//    w="5vw"

   >
   {user.name}
   <CloseIcon pl={1} />
   </Box>
  )
}

export default UserBadge