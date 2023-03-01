import express from "express";

import { errorMessage } from "../../utils/error";

const router = express.Router();

const ytdl = require("ytdl-core");
const readline = require("readline");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static").replace(
  "app.asar",
  "app.asar.unpacked"
);
ffmpeg.setFfmpegPath(ffmpegPath);

const fs = require("fs");

const { dialog } = require("electron");

let os = require("os");

const dir_home = os.homedir();

const folderName = `${dir_home}/YTGO`;

router.post("/song", (req: express.Request, res: express.Response) => {
  const { body } = req;
  const { url, title, image, duration, format } = body;

  try {
    fs.readFile(`${folderName}/config.json`, async (err: any, file: any) => {
      if (err) throw err;
      let json = JSON.parse(file);
      let directory = json.outputdir;

      if (directory.length > 0) {
        // var stream = ytdl(url, { filter: 'highestaudio' })
        // const getSong =  () => {
        const info = await ytdl.getInfo(
          url,
          { quality: "highestaudio" },
          (err: any) => {
            if (err) throw err;
          }
        );
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
            .on("progress", (p: any) => {
              readline.cursorTo(process.stdout, 0);
              process.stdout.write(`${p.targetSize}kb downloaded`);
            })
            .on("error", (err: Error) => {
              errorMessage({ status: 500, text: err.message }, res);
            })
            .on("end", () => {
              console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
              fs.readFile(`${folderName}/mp3.json`, (err: any, file: any) => {
                if (err) throw err;
                let songs = JSON.parse(file);

                let found = songs.songs.find((song: any) => song.url === url);
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
                  } as any;
                  data = JSON.stringify(data);
                  fs.writeFileSync(`${folderName}/mp3.json`, data);
                }
                res.json({ success: true }).status(200);
              });
            });
          // Legacy
          // ffmpeg(stream)
          //   .audioBitrate(128)
          //   // .toFormat("mp3")
          //   .save(`${directory}/${title}.mp3`)
          //   .on("error", (err: any) => {
          //     console.log(err);
          //     errorMessage({ text: err, status: 400 }, res);
          //   })
          //   .on("end", () => {
          //     fs.readFile(`${folderName}/mp3.json`, (err: any, file: any) => {
          //       if (err) throw err;
          //       let songs = JSON.parse(file);

          //       let found = songs.songs.find((song: any) => song.url === url);
          //       if (!found) {
          //         songs.songs.push({
          //           title,
          //           url,
          //           image,
          //           format,
          //           duration: {
          //             timestamp: duration,
          //           },
          //           remove: true,
          //         });
          //         let data = {
          //           songs: songs.songs,
          //         } as any;
          //         data = JSON.stringify(data);
          //         fs.writeFileSync(`${folderName}/mp3.json`, data);
          //       }
          //       res.json({ success: true }).status(200);
          //     });
          //   });
        } else {
          ytdl(url).pipe(fs.createWriteStream(`${directory}/${title}.mp4`));
          fs.readFile(`${folderName}/mp4.json`, (err: any, file: any) => {
            if (err) throw err;
            let songs = JSON.parse(file);

            let found = songs.songs.find((song: any) => song.url === url);
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
              } as any;
              data = JSON.stringify(data);
              fs.writeFileSync(`${folderName}/mp4.json`, data);
            }
            res.json({ success: true }).status(200);
          });
          res.json({ success: true }).status(200);
        }
        // }
      } else {
        dialog
          .showOpenDialog({
            properties: ["openDirectory"],
          })
          .then(async (path: any) => {
            if (!path.canceled) {
              let data = {
                outputdir: path.filePaths[0],
              } as any;
              data = JSON.stringify(data);
              fs.writeFileSync(`${folderName}/config.json`, data);

              const info = await ytdl.getInfo(
                url,
                { quality: "highestaudio" },
                (err: any) => {
                  if (err) throw err;
                }
              );
              if (format === "mp3") {
                const stream = ytdl.downloadFromInfo(info, {
                  quality: "highestaudio",
                });
                ffmpeg(stream)
                  .toFormat("wav")
                  .saveToFile(`${directory}/${title}.wav`)
                  .on("error", (err: any) => {
                    console.log(err);
                    errorMessage({ text: err, status: 400 }, res);
                  })
                  .on("end", () => {
                    fs.readFile(
                      `${folderName}/mp3.json`,
                      (err: any, file: any) => {
                        if (err) throw err;
                        let songs = JSON.parse(file);

                        let found = songs.songs.find(
                          (song: any) => song.url === url
                        );
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
                          } as any;
                          data = JSON.stringify(data);
                          fs.writeFileSync(`${folderName}/mp3.json`, data);
                        }
                        res.json({ success: true }).status(200);
                      }
                    );
                  });
              } else {
                ytdl(url).pipe(
                  fs.createWriteStream(`${directory}/${title}.mp4`)
                );
                fs.readFile(`${folderName}/mp4.json`, (err: any, file: any) => {
                  if (err) throw err;
                  let songs = JSON.parse(file);

                  let found = songs.songs.find((song: any) => song.url === url);
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
                    } as any;
                    data = JSON.stringify(data);
                    fs.writeFileSync(`${folderName}/mp4.json`, data);
                  }
                  res.json({ success: true }).status(200);
                });
                res.json({ success: true }).status(200);
              }
            } else {
              res.json({ success: false, error: "Canceled" }).status(400);
            }
          });
      }
    });
  } catch (e) {
    errorMessage({ text: "An error has occurred", status: 400 }, res);
  }
});

router.post("/", (_, res: express.Response) => {
  try {
    // let mp3 = fs.readFile(`${folderName}/mp3.json`)
    // let mp4 = fs.readFile(`${folderName}/mp4.json`)
    // console.log(mp3)
    // console.log(mp4)
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
  } catch (e) {
    console.log(e);
    errorMessage({ text: "An error has occurred", status: 400 }, res);
  }
});

router.post("/test", async (_req: express.Request, res: express.Response) => {
  try {
    const url = "https://youtube.com/watch?v=PFPfxcvRshk";

    // const stream = ytdl(url, {filter: (format:any) => format.container === 'mp4' })
    const directory = "/Users/eliaswambugu/Documents/Music";
    // console.log(stream)
    // ffmpeg(stream)
    //     .toFormat("mp3")
    //     .saveToFile(`${directory}/BurnaBoy23.mp3`)
    //     .on('error', (err: any) => {
    //         console.log(err)
    //         errorMessage({ text: err, status: 400 }, res)
    //     })
    // const getInfo = async () => {
    const info = await ytdl.getInfo(
      url,
      { quality: "highestaudio" },
      (err: any) => {
        if (err) throw err;
      }
    );
    const stream = ytdl.downloadFromInfo(info, { quality: "highestaudio" });
    ffmpeg(stream)
      .toFormat("mp3")
      .saveToFile(`${directory}/burnaboy - 23.mp3`)
      .on("error", (err: any) => {
        console.log(err);
        errorMessage({ text: err, status: 400 }, res);
      });
    // getInfo()
    // res.send('hi').status(200)
  } catch (e) {
    console.log(e);
    errorMessage({ text: "An error has occurred", status: 400 }, res);
  }
});

// router.post('/', (req: express.Request, res: express.Response) => {
//youtube.com/watch?v=PFPfxcvRshk
// })
https: module.exports = router;
