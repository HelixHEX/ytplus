import express from 'express'

interface Message {
    text: string,
    status: number
}

export const errorMessage= (message:Message, res: express.Response) => {
    console.log(message.text)
    return res.json({success: false, error: message.text}).status(message.status)
}