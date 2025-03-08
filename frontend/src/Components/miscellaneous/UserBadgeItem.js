import { Box } from '@chakra-ui/react';
import { CloseIcon } from "@chakra-ui/icons";

const UserBadgeItem = ({ user, handleFunction}) => {
  return (
    <Box
    p="4px 8px 4px 8px"
    borderRadius="lg"
    m={1}
    mb={2}
    variant="solid"
    fontSize={12}
    backgroundColor="purple"
    color="white"
    cursor="pointer"
    onClick={handleFunction}
    >
        {user.name}
        <CloseIcon ml={1} pl={1} />
    </Box>
  )
}

export default UserBadgeItem