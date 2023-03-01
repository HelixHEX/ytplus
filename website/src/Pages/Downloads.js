import React, { useState, useEffect } from 'react'

import Nav from '../Components/Nav'
import MobileNav from '../Components/MobileNav'
import Songs from '../Components/Songs'

import {
    Flex,
    Text,
    CircularProgress,
    useToast,
    useColorMode
} from '@chakra-ui/react'
import axios from 'axios'
import { baseURL } from '../utils/config'

const Downloads = () => {
    const [loading, setLoading] = useState(false)
    const [songs, setSongs] = useState([])
    const [videos, setVideos] = useState([])

    const toast = useToast()
    const { colorMode } = useColorMode()

    const remove = (index) => {
        let newSongs = [...songs]
        newSongs.splice(index, 1)
        setSongs(newSongs)
    }

    useEffect(() => {
        const main = async () => {
            try {
                setLoading(true)
                await axios.post(baseURL + 'download').then(res => {
                    setLoading(false)
                    if (res.data.success) {
                        setSongs(res.data.mp3)
                        setVideos(res.data.mp4)
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
        main()
    }, [toast])
    return (
        <>
            <Flex bg={colorMode === 'light' ? '#E2E8F0' : 'gray.900'} minH='100vh' h='auto' flexDir='column'>
                <Nav currentPage={'downloads'} />
                <MobileNav currentPage={'downloads'}/>
                <Flex mr={[0, 25]} ml={[0, 25, 25, 220]} flexDir='column'>
                    <Text mt='5%' fontSize={40} fontWeight='200'>Downloaded</Text>
                    {loading ? <CircularProgress mt='2%' alignSelf='center' isIndeterminate color="purple.600" /> : null}
                    {songs
                        ? <Songs remove={remove} songs={songs} mt={'5%'}  />
                        : null
                    }
                    {videos
                        ? <Songs remove={remove} songs={videos} mt={'5%'}  />
                        : null
                    }
                </Flex>
            </Flex>
        </>
    )
}

export default Downloads