import express from "express";

import { errorMessage } from "../../utils/error";

const router = express.Router();

const yts = require("yt-search");

const fs = require("fs");
let os = require("os");
const dir_home = os.homedir();
const folderName = `${dir_home}/YTGO`;

router.post("/search", async (req: express.Request, res: express.Response) => {
  const { body } = req;
  const { track } = body;
  try {
    const results = await yts(track);
    let videos = results.videos;
    let mp3 = fs.readFileSync(`${folderName}/mp3.json`);
    let mp4 = fs.readFileSync(`${folderName}/mp4.json`);
    mp3 = JSON.parse(mp3);
    mp3 = mp3.songs;

    mp4 = JSON.parse(mp4);
    mp4 = mp4.songs;

    videos = videos.map((video: any) => {
      let mp3Found = mp3.find((song: any) => song.url === video.url);
      let mp4Found = mp4.find((song: any) => song.url === video.url);
      if (mp3Found) {
        return {
          ...video,
          remove: true,
          search: true,
          format: "mp3",
        };
      } else {
        return {
          ...video,
          remove: false,
        };
      }
      if (mp4Found) {
        return {
          ...video,
          remove: true,
          search: true,
          format: "mp4",
        };
      } else {
        return {
          ...video,
          remove: false,
        };
      }
    });
    // fs.readFile(`${folderName}/mp3.json`, (err: any, file: any) => {
    //     if (err) throw err;
    //     let songs = JSON.parse(file)
    //     videos = videos.map((video: any) => {
    //         let found = songs.songs.find((song: any) => song.url === video.url)
    //         if (found) {
    //             return {
    //                 ...video,
    //                 remove: true
    //             }
    //         } else {
    //             return {
    //                 ...video,
    //                 remove: false
    //             }
    //         }
    //     })
    // })
    res.json({ success: true, results: videos }).status(200);
  } catch (e) {
    errorMessage({ text: "An error has occurred", status: 400 }, res);
  }
});

router.post("/remove", (req: express.Request, res: express.Response) => {
  const { body } = req;
  const { url, title, format } = body;
  try {
    if (format === "mp3") {
      console.log("song");
      fs.readFile(`${folderName}/mp3.json`, (err: any, file: any) => {
        if (err) throw err;
        let songs = JSON.parse(file);
        songs = songs.songs;
        let found = false;
        songs.map((song: any, index: number) => {
          if (song.url === url) {
            songs.splice(index, 1);
            found = true;
          }
        });
        if (found) {
          // songs =
          let data = {
            songs,
          } as any;
          data = JSON.stringify(data);
          fs.writeFileSync(`${folderName}/mp3.json`, data);

          fs.readFile(`${folderName}/config.json`, (err: any, file: any) => {
            if (err) throw err;
            const data = JSON.parse(file);

            let directory;

            directory = data.outputdir;
            if (directory) {
              fs.unlink(`${directory}/${title}.mp3`, (err: any) => {
                if (err) throw err;
                //file removed
              });
              console.log(directory);
              res.json({ success: true }).status(200);
            }
          });
        } else {
          errorMessage({ text: "Song not found", status: 404 }, res);
        }
      });
    } else {
      console.log("video");
      fs.readFile(`${folderName}/mp4.json`, (err: any, file: any) => {
        if (err) throw err;
        let songs = JSON.parse(file);
        songs = songs.songs;
        let found = false;
        songs.map((song: any, index: number) => {
          if (song.url === url) {
            songs.splice(index, 1);
            found = true;
          }
        });
        if (found) {
          // songs =
          let data = {
            songs,
          } as any;
          data = JSON.stringify(data);
          fs.writeFileSync(`${folderName}/mp4.json`, data);

          fs.readFile(`${folderName}/config.json`, (err: any, file: any) => {
            if (err) throw err;
            const data = JSON.parse(file);

            let directory;

            directory = data.outputdir;
            if (directory) {
              fs.unlink(`${directory}/${title}.mp4`, (err: any) => {
                if (err) throw err;
                //file removed
              });
              console.log(directory);
              res.json({ success: true }).status(200);
            }
          });
        } else {
          errorMessage({ text: "Song not found", status: 404 }, res);
        }
      });
    }
  } catch (e) {
    errorMessage({ text: "An error has occurred", status: 400 }, res);
  }
});

// router.post('/', (req: express.Request, res: express.Response) => {

// })
module.exports = router;
