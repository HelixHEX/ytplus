import React from 'react'

import { Menu } from 'react-feather'

import {
    Flex,
    Text,
    IconButton,
    useColorMode,
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure
} from '@chakra-ui/react'

import { useHistory } from 'react-router-dom'

const MobileNav = ({ currentPage }) => {
    const history = useHistory()
    const handleChange = (url) => {
        history.push(url)
    }
    const { colorMode, toggleColorMode } = useColorMode()
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                size={'lg'}
            >
                <DrawerOverlay />
                <DrawerContent bg={colorMode === 'light' ? 'purple.500' : 'purple.900'}>
                    <DrawerCloseButton color='white' />
                    <DrawerBody>
                        <Flex mt={75} flexDir='column'>
                            <Text textAlign='center' color={'white'} onClick={toggleColorMode} _hover={{ cursor: 'pointer', color: colorMode === 'light' ? 'purple.900' : 'purple.600' }} fontSize={30}>{colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}</Text>
                            <Text mt={50} color={currentPage === 'search' ? 'black' : 'white'} onClick={() => handleChange('/search')} _hover={{ cursor: 'pointer', color: colorMode === 'light' ? 'black' : 'purple.600' }} textAlign='center' fontSize={30}>Search</Text>
                            <Text textAlign='center' color={currentPage === 'downloads' ? 'black' : 'white'} onClick={() => handleChange('/download')} _hover={{ cursor: 'pointer', color: colorMode === 'light' ? 'black' : 'purple.600' }} fontSize={30} mt={5}>Downloads</Text>
                        </Flex>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
            <Flex display={['flex', 'flex', 'flex', 'none', 'none']} mt='3%' pos='absolute' right={25}>
                <IconButton onClick={onOpen} bg={colorMode === 'light' ? 'gray.300' : 'gray.800'} rounded={5} mt={25} w={50} aria-label="Open Menu" icon={<Menu />} />
            </Flex>
        </>
    )
}

export default MobileNav