const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(fileUpload({
    createParentPath: true
}));

app.use(cors());
app.use(morgan('dev'));

const port = process.env.PORT || 3000;

app.use(express.static('uploads'));
var publicdir = __dirname;
app.get('/', async (req,res) =>{
    res.send("File Upload API").status(200);
})

//key: file
app.post('/api/upload-file', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let file = req.files.fileKey;
            file.mv('./uploads/' + file.name);
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: file.name,
                    mimetype: file.mimetype,
                    size: file.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

//key: fileArray
app.post('/api/upload-files', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let data = []; 
    
            _.forEach(_.keysIn(req.files.fileArray), (key) => {
                let file = req.files.fileArray[key];
                
                file.mv('./uploads/' + file.name);

                data.push({
                    name: file.name,
                    mimetype: file.mimetype,
                    size: file.size
                });
            });
    
            res.send({
                status: true,
                message: 'Files are uploaded',
                data: data
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

///api/uploads
app.get('/api/:dirName', (req, res) => {
    //console.log('Inside get api',publicdir + '/' + req.params.dirName);
    fs.readdir(publicdir + '/' + req.params.dirName, function (err, files) {
        let fileArrayObject = [];
        files.forEach(file => {
            //console.log(file);
            fileArrayObject.push(file);
          });
        res.send({
            status: true,
            message: 'File Reading Completed',
            data: fileArrayObject
        });
        res.end();
    });
});

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);
