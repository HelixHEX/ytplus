"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDownloaded = void 0;
let os = require('os');
const dir_home = os.homedir();
const folderName = `${dir_home}/YTGO`;
const downloaded = require(folderName + '/downloaded.json');
const checkDownloaded = (url) => {
    const songs = downloaded.songs;
    const found = songs.find((song) => song.url === url);
    console.log(found);
    return found;
};
exports.checkDownloaded = checkDownloaded;
//# sourceMappingURL=song.js.map