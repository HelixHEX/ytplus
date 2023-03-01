let os = require('os')

const dir_home = os.homedir();

const folderName = `${dir_home}/YTGO`

// const fs = require('fs')

const downloaded = require(folderName + '/downloaded.json')

export const checkDownloaded = (url:string) => {
    const songs = downloaded.songs;
    const found = songs.find((song:any) => song.url === url)
    console.log(found)
    return found
}