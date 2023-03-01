import React, { useState } from "react"

import {
    Text,
    Flex,
    Image,
    Icon,
    useToast,
    useColorMode,
    CircularProgress,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button
} from '@chakra-ui/react'

import { Download, X } from 'react-feather';

import { baseURL } from "../utils/config";

import axios from "axios";

const Song = ({ data, mb, add, remove, index }) => {
    const [loading, setLoading] = useState(false)

    const toast = useToast()
    const { colorMode } = useColorMode()

    const { isOpen, onOpen, onClose } = useDisclosure()


    const reomveSong = async () => {
        alert(data.format)
        try {
            setLoading(true)
            await axios.post(baseURL + 'song/remove', {
                url: data.url,
                title: data.title,
                format: data.format
            }).then(res => {
                setLoading(false)
                if (res.data.success) {
                    remove(index)
                    toast({
                        title: "Success",
                        description: 'Song reomved',
                        status: "success",
                        duration: 4000,
                        isClosable: true,
                    })
                } else {
                    toast({
                        title: "Uh Oh :(",
                        description: res.data.error,
                        status: "error",
                        duration: 4000,
                        isClosable: true,
                    })
                }
            })
        } catch (e) {
            console.log(e)
            toast({
                title: "Uh Oh :(",
                description: 'An error has occurred',
                status: "error",
                duration: 4000,
                isClosable: true,
            })
        }
    }

    const addSong = async (format) => {
        onClose()
        try {
            setLoading(true)
            await axios.post(baseURL + 'download/song', {
                url: data.url,
                image: data.thumbnail,
                title: data.title,
                duration: data.duration.timestamp,
                format
            }).then(res => {
                setLoading(false)
                if (res.data.success) {
                    toast({
                        title: "Success",
                        description: 'Downloaded',
                        status: "success",
                        duration: 4000,
                        isClosable: true,
                    })
                    add(index)
                } else {

                    toast({
                        title: "Uh Oh :(",
                        description: res.data.error,
                        status: "error",
                        duration: 4000,
                        isClosable: true,
                    })
                }
            })
        } catch (e) {

            console.log(e)
            toast({
                title: "Uh Oh :(",
                description: 'An error has occurred',
                status: "error",
                duration: 4000,
                isClosable: true,
            })
        }
    }
    return (
        <>
            <Flex _hover={{ bg: colorMode === 'light' ? 'gray.300' : 'gray.800', color: colorMode === 'light' ? 'black' : 'white' }} rounded={2} align='center' h={50} pl={5} bg={colorMode === 'light' ? 'white' : 'gray.700'} mb={mb}>
                <Image fallbackSrc="https://via.placeholder.com/150" src={data.image} rounded={5} w={39} h={39} alt={data.title} />
                <Text isTruncated w='100%' ml={2} fontWeight='300'>{data.title}</Text>
                {/* <Text ml={[2, 10]}>{min}:{sec < 10 ? '0' + sec : sec}</Text> */}
                {data.format
                    ? <Text ml={[2, 10]}>{data.format}</Text>
                    : null}
                <Text ml={[2, 10]}>{data.duration.timestamp}</Text>
                <Flex mr={[2, 10]} w='100%' color='purple.500' justifyContent='flex-end' >
                    <Flex display={loading ? 'none' : 'flex'}>
                        <Icon _hover={{ cursor: 'pointer' }} onClick={() => reomveSong()} display={data.remove ? 'flex' : 'none'} w={30} h={30} as={X} />
                        <Icon _hover={{ cursor: 'pointer' }} onClick={() => onOpen()} display={data.remove ? 'none' : 'flex'} w={30} h={30} as={Download} />
                    </Flex>
                    <CircularProgress display={loading ? 'flex' : 'none'} ml={5} isIndeterminate size='30px' color='purple.600' />
                </Flex>
            </Flex>

            {/* type */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bg={colorMode === 'light' ? 'purple.600' : 'purple.900'}>
                    <ModalHeader>Select Type </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody >
                        <Flex justifyContent='space-evenly'>
                            <Button onClick={() => addSong('mp3')}>MP3</Button>
                            <Button onClick={() => addSong('mp4')}>MP4</Button>
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button _hover={{ bg: 'red.500' }} bg='none' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Song