const fse = require('fs-extra');
const path = require('path');
const express = require('express');
const cors = require('cors');
var YoutubeMp3Downloader = require("youtube-mp3-downloader");
const app = express();

app.use(cors());

// Need ffmpeg lib to convert to mp3
// https://ffmpeg.zeranoe.com/builds/


app.get('/download', (req,res) => {

    var URL = req.query.url;
    var vidId = URL.substring(URL.lastIndexOf("?v=") + 3);

    var YD = new YoutubeMp3Downloader({
        "ffmpegPath": "C:/Users/Dejan/Documents/ffmpeg-20181126-90ac0e5-win64-static/bin/ffmpeg.exe",
        "outputPath": path.join(__dirname, "mp3folder"),
        "youtubeVideoQuality": "highest",
        "queueParallelism": 2,
        "progressTimeout": 4000
    });

    fse.ensureDir(YD.outputPath, err => {
        if (err) return err;
        YD.download(vidId);
    });

    YD.on("finished", function(err, data) {
        console.log("FINISHED", JSON.stringify(data));
    });

    YD.on("error", function(error) {
        console.log("ERROR", error);
    });

    // YD.on("progress", function(progress) {
    //     console.log("PROGRESS", JSON.stringify(progress));
    // });

})

app.listen(4000, () => {
    console.log('Server Works !!! At port 4000');
});