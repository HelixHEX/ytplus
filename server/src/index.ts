import express from "express";

const morgan = require("morgan");

const cors = require("cors");
import path = require("path");

//routes
const song = require("./routes/song");
const downlaod = require("./routes/download");

const fs = require("fs");

let os = require("os"),
dir_home = os.homedir();

const main = () => {
  const app = express();

  app.use(express.json());

  app.use(
    cors({ origin: ["http://localhost:3000", "http://192.168.1.39:3000"] })
  );

  const folderName = `${dir_home}/YTGO`;
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
    if (!fs.existsSync(`${folderName}/config.json`)) {
      let data = {
        outputdir: "",
      } as any;
      data = JSON.stringify(data);
      fs.writeFileSync(`${folderName}/config.json`, data);
    }

    if (!fs.existsSync(`${folderName}/mp3.json`)) {
      let data = {
        songs: [],
      } as any;
      data = JSON.stringify(data);
      fs.writeFileSync(`${folderName}/mp3.json`, data);
    }
    if (!fs.existsSync(`${folderName}/mp4.json`)) {
      let data = {
        songs: [],
      } as any;
      data = JSON.stringify(data);
      fs.writeFileSync(`${folderName}/mp4.json`, data);
    }
  } catch (err) {
    console.error(err);
  }

  morgan.token("body", (req: express.Request) => JSON.stringify(req.body));
  app.use(
    morgan(
      ":date[iso] :remote-addr :method :url :status :res[content-length] - :response-time ms"
    )
  );

  //routes
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("/*", function (_, res) {
    res.sendFile(path.join(__dirname, "../build", "index.html"));
  });

  app.use("/api/v1/song", song);
  app.use("/api/v1/download", downlaod);

  // app.get("/", (_, res: express.Response) => {
  //     res.send("Hello world");
  // });

  app.use((_, res: express.Response) => {
    res.status(404).json({ status: "404" });
  });

  app.listen(5009, () => {
    console.log(`🚀 Server ready at http://localhost:5009`);
  });
};

main();
