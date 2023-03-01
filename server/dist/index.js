"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const song = require("./routes/song");
const downlaod = require("./routes/download");
const fs = require("fs");
let os = require("os"), dir_home = os.homedir();
const main = () => {
    const app = express_1.default();
    app.use(express_1.default.json());
    app.use(cors({ origin: ["http://localhost:3000", "http://192.168.1.39:3000"] }));
    const folderName = `${dir_home}/YTGO`;
    try {
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
        }
        if (!fs.existsSync(`${folderName}/config.json`)) {
            let data = {
                outputdir: "",
            };
            data = JSON.stringify(data);
            fs.writeFileSync(`${folderName}/config.json`, data);
        }
        if (!fs.existsSync(`${folderName}/mp3.json`)) {
            let data = {
                songs: [],
            };
            data = JSON.stringify(data);
            fs.writeFileSync(`${folderName}/mp3.json`, data);
        }
        if (!fs.existsSync(`${folderName}/mp4.json`)) {
            let data = {
                songs: [],
            };
            data = JSON.stringify(data);
            fs.writeFileSync(`${folderName}/mp4.json`, data);
        }
    }
    catch (err) {
        console.error(err);
    }
    morgan.token("body", (req) => JSON.stringify(req.body));
    app.use(morgan(":date[iso] :remote-addr :method :url :status :res[content-length] - :response-time ms"));
    app.use(express_1.default.static(path.join(__dirname, "../build")));
    app.get("/*", function (_, res) {
        res.sendFile(path.join(__dirname, "../build", "index.html"));
    });
    app.use("/api/v1/song", song);
    app.use("/api/v1/download", downlaod);
    app.use((_, res) => {
        res.status(404).json({ status: "404" });
    });
    app.listen(5009, () => {
        console.log(`🚀 Server ready at http://localhost:5009`);
    });
};
main();
//# sourceMappingURL=index.js.map