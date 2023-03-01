import React, { useState } from 'react'

import Nav from '../Components/Nav'
import MobileNav from '../Components/MobileNav'
import Songs from '../Components/Songs'

import {
    Flex,
    Text,
    Input,
    useToast,
    CircularProgress,
    useColorMode
} from '@chakra-ui/react'

import axios from 'axios'
import { baseURL } from '../utils/config';


const Search = () => {
    const [track, setTrack] = useState('')

    const [songs, setSongs] = useState([])
    const [loading, setLoading] = useState(false)

    const toast = useToast()
    const { colorMode } = useColorMode()

    const add = (index) => {
        let newSongs = [...songs]
        newSongs[index].remove = true
        setSongs(newSongs)
    }

    const remove = (index) => {
        let newSongs = [...songs]
        newSongs[index].remove = false
        setSongs(newSongs)
    }

    const handleSearch = async (e) => {
        e.preventDefault()
        if (track.length > 0) {
            try {
                setLoading(true)
                setSongs([])
                axios.post(baseURL + 'song/search', {
                    track
                }).then(res => {
                    setLoading(false)
                    if (res.data.success) {
                        setSongs(res.data.results)
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
                toast({
                    title: "Uh Oh :(",
                    description: "An error has occurred",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                })
            }
        }
    }
    return (
        <>
            <Flex  bg={colorMode === 'light' ? '#E2E8F0' : 'gray.900'} minH='100vh' h='auto' flexDir='column'>
                <Nav currentPage={'search'} />
                <MobileNav currentPage={'search'}/>
                <Flex  mr={[0, 25]} ml={[0, 25, 25, 220]} flexDir='column'>
                    <Text mt='5%' fontSize={40} fontWeight='200'>Search</Text>
                    <form onSubmit={handleSearch}>
                        <Input border='none' value={track} onChange={e => setTrack(e.target.value)} placeholder='Search songs' mt='2%' bg={colorMode === 'light' ? 'purple.600' : "purple.900"} color='white' />
                    </form>
                    {loading ? <CircularProgress mt='2%' alignSelf='center' isIndeterminate color='purple.600' /> : null}
                    {songs.length > 1
                        ? <Songs remove={remove} add={add} songs={songs} mt={'5%'} />
                        : null}
                </Flex>
            </Flex>
        </>
    )
}

export default Search