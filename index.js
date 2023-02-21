var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

//parsing application/json
app.use(bodyParser.json())

//parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))

//parsing multipart/form-data
app.use(upload.array());

app.use('/admin', require('./Controller/RegisLogin.js'));
app.use('/user', require('./Controller/Peserta.js'));
app.use('/kelas', require('./Controller/Kelas.js'));
app.use('/kategori', require('./Controller/KategoriKelas.js'));
app.use('/akses', require('./Controller/Akseskelaspeserta.js'));


app.listen(8000)