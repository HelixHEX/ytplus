"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_1 = require("../../utils/error");
const router = express_1.default.Router();
const yts = require("yt-search");
const fs = require("fs");
let os = require("os");
const dir_home = os.homedir();
const folderName = `${dir_home}/YTGO`;
router.post("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const { track } = body;
    try {
        const results = yield yts(track);
        let videos = results.videos;
        let mp3 = fs.readFileSync(`${folderName}/mp3.json`);
        let mp4 = fs.readFileSync(`${folderName}/mp4.json`);
        mp3 = JSON.parse(mp3);
        mp3 = mp3.songs;
        mp4 = JSON.parse(mp4);
        mp4 = mp4.songs;
        videos = videos.map((video) => {
            let mp3Found = mp3.find((song) => song.url === video.url);
            let mp4Found = mp4.find((song) => song.url === video.url);
            if (mp3Found) {
                return Object.assign(Object.assign({}, video), { remove: true, search: true, format: "mp3" });
            }
            else {
                return Object.assign(Object.assign({}, video), { remove: false });
            }
            if (mp4Found) {
                return Object.assign(Object.assign({}, video), { remove: true, search: true, format: "mp4" });
            }
            else {
                return Object.assign(Object.assign({}, video), { remove: false });
            }
        });
        res.json({ success: true, results: videos }).status(200);
    }
    catch (e) {
        error_1.errorMessage({ text: "An error has occurred", status: 400 }, res);
    }
}));
router.post("/remove", (req, res) => {
    const { body } = req;
    const { url, title, format } = body;
    try {
        if (format === "mp3") {
            console.log("song");
            fs.readFile(`${folderName}/mp3.json`, (err, file) => {
                if (err)
                    throw err;
                let songs = JSON.parse(file);
                songs = songs.songs;
                let found = false;
                songs.map((song, index) => {
                    if (song.url === url) {
                        songs.splice(index, 1);
                        found = true;
                    }
                });
                if (found) {
                    let data = {
                        songs,
                    };
                    data = JSON.stringify(data);
                    fs.writeFileSync(`${folderName}/mp3.json`, data);
                    fs.readFile(`${folderName}/config.json`, (err, file) => {
                        if (err)
                            throw err;
                        const data = JSON.parse(file);
                        let directory;
                        directory = data.outputdir;
                        if (directory) {
                            fs.unlink(`${directory}/${title}.mp3`, (err) => {
                                if (err)
                                    throw err;
                            });
                            console.log(directory);
                            res.json({ success: true }).status(200);
                        }
                    });
                }
                else {
                    error_1.errorMessage({ text: "Song not found", status: 404 }, res);
                }
            });
        }
        else {
            console.log("video");
            fs.readFile(`${folderName}/mp4.json`, (err, file) => {
                if (err)
                    throw err;
                let songs = JSON.parse(file);
                songs = songs.songs;
                let found = false;
                songs.map((song, index) => {
                    if (song.url === url) {
                        songs.splice(index, 1);
                        found = true;
                    }
                });
                if (found) {
                    let data = {
                        songs,
                    };
                    data = JSON.stringify(data);
                    fs.writeFileSync(`${folderName}/mp4.json`, data);
                    fs.readFile(`${folderName}/config.json`, (err, file) => {
                        if (err)
                            throw err;
                        const data = JSON.parse(file);
                        let directory;
                        directory = data.outputdir;
                        if (directory) {
                            fs.unlink(`${directory}/${title}.mp4`, (err) => {
                                if (err)
                                    throw err;
                            });
                            console.log(directory);
                            res.json({ success: true }).status(200);
                        }
                    });
                }
                else {
                    error_1.errorMessage({ text: "Song not found", status: 404 }, res);
                }
            });
        }
    }
    catch (e) {
        error_1.errorMessage({ text: "An error has occurred", status: 400 }, res);
    }
});
module.exports = router;
//# sourceMappingURL=index.js.map