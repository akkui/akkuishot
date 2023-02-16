const cors = require('cors')
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
app.use(cors())

const database = {};

app.post('/getImage', (req, res) => {
    const data = JSON.parse(req.body.json_string)
    if (!database[data.ImageID]) return res.send({ status: 400 });
    return res.send(database[data.ImageID].content);
});

app.post('/uploadImage', (req, res) => {
    function upload() {
        const id = Buffer.from(`${Math.floor((Math.random() * 999999) + 1)}`).toString('base64');
        if (!database[id]) {
            const files_types = [ 'data:image/png;base64,', 'data:image/jpg;base64,', 'data:image/jpeg;base64' ]
            if (files_types.includes(JSON.parse(req.body.json_string).ImageBase64.substring(0, 22))) {
                database[id] = { content: JSON.parse(req.body.json_string).ImageBase64 }
                return res.send({ status: 200, message: 'Image sucessfully uploaded.', image_url: id })
            } else {
                return res.send({ status: 400, message: 'Invalid file type. (Accepted types: png, jpg, jpeg)<br>Refresh the page for upload others files.' })
            }
        } else {
            upload();
        }
    }
    upload();
});

app.listen(3000, function (err) {
    console.log("Server started with sucessfully");
});