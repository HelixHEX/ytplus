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
const ytdl = require("ytdl-core");
const readline = require("readline");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static").replace("app.asar", "app.asar.unpacked");
ffmpeg.setFfmpegPath(ffmpegPath);
const fs = require("fs");
const { dialog } = require("electron");
let os = require("os");
const dir_home = os.homedir();
const folderName = `${dir_home}/YTGO`;
router.post("/song", (req, res) => {
    const { body } = req;
    const { url, title, image, duration, format } = body;
    try {
        fs.readFile(`${folderName}/config.json`, (err, file) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                throw err;
            let json = JSON.parse(file);
            let directory = json.outputdir;
            if (directory.length > 0) {
                const info = yield ytdl.getInfo(url, { quality: "highestaudio" }, (err) => {
                    if (err)
                        throw err;
                });
                console.log(info.videoDetails.videoId);
                if (format === "mp3") {
                    console.log("selected");
                    let stream = ytdl(info.videoDetails.videoId, {
                        quality: "highestaudio",
                    });
                    let start = Date.now();
                    ffmpeg(stream)
                        .audioBitrate(320)
                        .toFormat('mp3')
                        .save(`${directory}/${title}.mp3`)
                        .on("progress", (p) => {
                        readline.cursorTo(process.stdout, 0);
                        process.stdout.write(`${p.targetSize}kb downloaded`);
                    })
                        .on("error", (err) => {
                        error_1.errorMessage({ status: 500, text: err.message }, res);
                    })
                        .on("end", () => {
                        console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
                        fs.readFile(`${folderName}/mp3.json`, (err, file) => {
                            if (err)
                                throw err;
                            let songs = JSON.parse(file);
                            let found = songs.songs.find((song) => song.url === url);
                            if (!found) {
                                songs.songs.push({
                                    title,
                                    url,
                                    image,
                                    format,
                                    duration: {
                                        timestamp: duration,
                                    },
                                    remove: true,
                                });
                                let data = {
                                    songs: songs.songs,
                                };
                                data = JSON.stringify(data);
                                fs.writeFileSync(`${folderName}/mp3.json`, data);
                            }
                            res.json({ success: true }).status(200);
                        });
                    });
                }
                else {
                    ytdl(url).pipe(fs.createWriteStream(`${directory}/${title}.mp4`));
                    fs.readFile(`${folderName}/mp4.json`, (err, file) => {
                        if (err)
                            throw err;
                        let songs = JSON.parse(file);
                        let found = songs.songs.find((song) => song.url === url);
                        if (!found) {
                            songs.songs.push({
                                title,
                                url,
                                image,
                                format,
                                duration: {
                                    timestamp: duration,
                                },
                                remove: true,
                            });
                            let data = {
                                songs: songs.songs,
                            };
                            data = JSON.stringify(data);
                            fs.writeFileSync(`${folderName}/mp4.json`, data);
                        }
                        res.json({ success: true }).status(200);
                    });
                    res.json({ success: true }).status(200);
                }
            }
            else {
                dialog
                    .showOpenDialog({
                    properties: ["openDirectory"],
                })
                    .then((path) => __awaiter(void 0, void 0, void 0, function* () {
                    if (!path.canceled) {
                        let data = {
                            outputdir: path.filePaths[0],
                        };
                        data = JSON.stringify(data);
                        fs.writeFileSync(`${folderName}/config.json`, data);
                        const info = yield ytdl.getInfo(url, { quality: "highestaudio" }, (err) => {
                            if (err)
                                throw err;
                        });
                        if (format === "mp3") {
                            const stream = ytdl.downloadFromInfo(info, {
                                quality: "highestaudio",
                            });
                            ffmpeg(stream)
                                .toFormat("wav")
                                .saveToFile(`${directory}/${title}.wav`)
                                .on("error", (err) => {
                                console.log(err);
                                error_1.errorMessage({ text: err, status: 400 }, res);
                            })
                                .on("end", () => {
                                fs.readFile(`${folderName}/mp3.json`, (err, file) => {
                                    if (err)
                                        throw err;
                                    let songs = JSON.parse(file);
                                    let found = songs.songs.find((song) => song.url === url);
                                    if (!found) {
                                        songs.songs.push({
                                            title,
                                            url,
                                            image,
                                            format,
                                            duration: {
                                                timestamp: duration,
                                            },
                                            remove: true,
                                        });
                                        let data = {
                                            songs: songs.songs,
                                        };
                                        data = JSON.stringify(data);
                                        fs.writeFileSync(`${folderName}/mp3.json`, data);
                                    }
                                    res.json({ success: true }).status(200);
                                });
                            });
                        }
                        else {
                            ytdl(url).pipe(fs.createWriteStream(`${directory}/${title}.mp4`));
                            fs.readFile(`${folderName}/mp4.json`, (err, file) => {
                                if (err)
                                    throw err;
                                let songs = JSON.parse(file);
                                let found = songs.songs.find((song) => song.url === url);
                                if (!found) {
                                    songs.songs.push({
                                        title,
                                        url,
                                        image,
                                        format,
                                        duration: {
                                            timestamp: duration,
                                        },
                                        remove: true,
                                    });
                                    let data = {
                                        songs: songs.songs,
                                    };
                                    data = JSON.stringify(data);
                                    fs.writeFileSync(`${folderName}/mp4.json`, data);
                                }
                                res.json({ success: true }).status(200);
                            });
                            res.json({ success: true }).status(200);
                        }
                    }
                    else {
                        res.json({ success: false, error: "Canceled" }).status(400);
                    }
                }));
            }
        }));
    }
    catch (e) {
        error_1.errorMessage({ text: "An error has occurred", status: 400 }, res);
    }
});
router.post("/", (_, res) => {
    try {
        let mp3 = fs.readFileSync(`${folderName}/mp3.json`);
        let mp4 = fs.readFileSync(`${folderName}/mp4.json`);
        mp3 = JSON.parse(mp3);
        mp3 = mp3.songs;
        mp3 = mp3.reverse();
        mp4 = JSON.parse(mp4);
        mp4 = mp4.songs;
        mp4 = mp4.reverse();
        console.log(mp3);
        res.json({ success: true, mp3, mp4 }).status(200);
    }
    catch (e) {
        console.log(e);
        error_1.errorMessage({ text: "An error has occurred", status: 400 }, res);
    }
});
router.post("/test", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = "https://youtube.com/watch?v=PFPfxcvRshk";
        const directory = "/Users/eliaswambugu/Documents/Music";
        const info = yield ytdl.getInfo(url, { quality: "highestaudio" }, (err) => {
            if (err)
                throw err;
        });
        const stream = ytdl.downloadFromInfo(info, { quality: "highestaudio" });
        ffmpeg(stream)
            .toFormat("mp3")
            .saveToFile(`${directory}/burnaboy - 23.mp3`)
            .on("error", (err) => {
            console.log(err);
            error_1.errorMessage({ text: err, status: 400 }, res);
        });
    }
    catch (e) {
        console.log(e);
        error_1.errorMessage({ text: "An error has occurred", status: 400 }, res);
    }
}));
https: module.exports = router;
//# sourceMappingURL=index.js.map