import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from './UserBadgeItem';

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const { user, selectedChat, chats, setChats } = ChatState();

    const handleSearch = async (query) => {
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
        setLoading(false);
        setSearchResult(data);
      } catch (error) {
        toast({
          title:"Error Occured!",
          description: "Failed to load the Search Results",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        })
      }
    };
    const handleSubmit = async () => {
      if (!groupChatName || !selectedUsers) {
        toast({
          title:"Please select all the feilds",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      try {

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          "/api/chat/group",
          {
            name: groupChatName,
            users: JSON.stringify(selectedUsers.map(u => u._id)),
          },
          config
        );
        setChats([data[0], ...chats]);
        onClose();
        toast({
          title:"New group chat created!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } catch (error) {
        toast({
          title:"Failed to create the chat!",
          description: error.response.data.message,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    };

    const handleDelete = (delUser) => {
      setSelectedUsers(selectedUsers?.filter(sel => sel?._id !== delUser?._id));
    };

    const handleGroup = (addUser) => {
      if(selectedUsers.includes(addUser)){
        toast({
          title: "User Allready exist",
          description: "error",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top"
        });
        return;
      }

      setSelectedUsers([...selectedUsers, addUser]);
    };

    return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={() => {onClose();setGroupChatName("");setSelectedUsers([]);setSearchResult([]);}}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
            >
              Create Group Chat
            </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input placeholder="Chat Name" mb={3} onChange={(e) => setGroupChatName(e.target.value)} />
            </FormControl>
            <FormControl>
              <Input placeholder="Add user eg: Jonh, Amar, Jane" mb={1} onChange={(e) => handleSearch(e.target.value)} />
            </FormControl>
            {/* Selecetd Users */}
            <Box w="100%" display="flex" flexWrap="wrap" >
              {selectedUsers && selectedUsers.map(u => (<UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />))}
            </Box>
            {/* render searched users */}
            {loading ? (<Spinner size="lg" />) : (searchResult?.slice(0, 4).map((user) => <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />))}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue'onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal