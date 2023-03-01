import React from 'react'

import {
    Flex,
    Text,
    IconButton,
    useColorMode
} from '@chakra-ui/react'

import {MoonIcon, SunIcon} from '@chakra-ui/icons'

import { useHistory } from 'react-router-dom'

const Nav = ({ currentPage }) => {
    const history = useHistory()
    const handleChange = (url) => {
        history.push(url)
    }
    const { colorMode, toggleColorMode } = useColorMode()

    return (
        <>
            <Flex display={['none', 'none', 'none', 'flex', 'flex']} bg={colorMode === 'light' ? 'white' : '#0e1117'} pos='fixed' height='100vh' overflowY='auto' w={200}>
                <Flex h='100%' margin='auto' flexDir='column'>
                    <IconButton bg={colorMode === 'light' ? 'gray.200' : 'gray.800'}  rounded={10} mt={25} alignSelf='center' w={70} onClick={toggleColorMode} aria-label="Toggle Dark Mode" icon={colorMode === 'light' ? <SunIcon/> : <MoonIcon />} />
                    <Flex mt={75} flexDir='column'>
                        <Text color={currentPage === 'search' ? 'purple.600' : colorMode === 'light' ? 'black' : 'white' } onClick={() => handleChange('/search')} _hover={{ cursor: 'pointer', color: 'purple.600' }} textAlign='center' fontSize={30}>Search</Text>
                        <Text color={currentPage === 'downloads' ? 'purple.600' : colorMode === 'light' ? 'black' : 'white'} onClick={() => handleChange('/download')} _hover={{ cursor: 'pointer', color: 'purple.600' }} fontSize={30} mt={10}>Downloads</Text>
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}

export default Nav