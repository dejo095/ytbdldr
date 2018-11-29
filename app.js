const fse = require('fs-extra');
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const YoutubeMp3Downloader = require("youtube-mp3-downloader");

const app = express();

let dData = null;

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handlebars middleware
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

hbs.registerHelper('helper_name', function() {

});
hbs.registerPartials(__dirname + '/views/partials', () => {
});

// Need ffmpeg lib to convert to mp3
// https://ffmpeg.zeranoe.com/builds/

// Global variables
app.use(function(req, res, next){
    // res.locals.success_msg = req.flash('success_msg');
    // res.locals.error_msg = req.flash('error_msg');
    // res.locals.error = req.flash('error');
    res.locals.data = dData || null;
    next();
});

app.get('/', (req, res) => {
    res.render('home');
});

app.post('/download', (req, res) => {
    dData = 0;
    let urlInput = req.body.urlInput;

    if (urlInput.indexOf("?v=") == -1) {
        // send error
        return res.json('url not ok');
    } else {
        var vidId = urlInput.substring(urlInput.lastIndexOf("?v=") + 3);

        var YD = new YoutubeMp3Downloader({
            "ffmpegPath": "C:/Users/Dejan/Documents/ffmpeg-20181126-90ac0e5-win64-static/bin/ffmpeg.exe",
            "outputPath": path.join(__dirname, "mp3folder"),
            "youtubeVideoQuality": "highest",
            "queueParallelism": 2,
            "progressTimeout": 4000
        });

        // create dir if nonexistant and initiate download
        fse.ensureDir(YD.outputPath, err => {
            if (err) return err;
            YD.download(vidId);
        });

        YD.on("finished", function(err, data) {
            res.redirect('/');
        });

        YD.on("error", function(error) {
            throw error;
        });

        YD.on("progress", function(progress) {
            console.log('progress', (parseFloat(progress.progress.percentage)).toFixed(2));
        });




    }





});

app.listen(4000, () => {
    console.log('Server Works !!! At port 4000');
});