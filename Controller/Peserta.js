require("dotenv").config();

var express = require("express");
var router = express.Router();
var db = require("../databaseConn.js");
var hashing = require("../hashing.js");

router.get("/list-peserta", (req,res) => {
    db.query(
        "select * from users",
        (error, result) => {
            if(error) {
                res.json({
                    status : false,
                    message : error.message
                })
            }else {
                if (result.length < 1) {
                    res.json({
                        status : true,
                        message : "Data masih kosong"
                    })
                } else {
                    res.json({
                        status : true,
                        data : result,
                    })
                }               
            }
        }
    )
})

router.post("/tambah-peserta", (req,res) =>{
    var data = req.body;
    var password = hashing.encrypt(data.password);

    db.query("select * from users where email=?",[data.email],
    (error, result) => {
        
        if (error) {
            res.json({
                status : false,
                message : error.message
            })
        } else {
            if (result.length < 1) {
                db.query(
                    "insert into users(name,email,password) values (?,?,?)",
                    [data.name, data.email, password],
                    (error, result) => {
                        if (error) {
                            console.log(error);
                            res.json({
                                status : false,
                                message : "Internal service error"
                            })
                            console.log(error.message);
                        } else {
                            res.json({
                                status : true,
                                message : "Registrasi peserta berhasil",
                                data : {
                                    name : data.nama,
                                    email : data.email,
                                    password : password
                                }
                            })
                        }
                    }
                )
            } else {
                res.json({
                    status : false,
                    message : "Email sudah digunakan"
                })
            }
        }
    })
})

router.put("/edit-peserta", (req,res) => {
    var data = req.body;
    db.query(
        "update users set name=?, password=? where email=?",
        [data.new_name, hashing.encrypt(data.new_password), data.email],
        (error,result) => {
            if (error) {
                res.json({
                    status : false,
                    message : error.message
                })
            } else {
                if (result["affectedRows"] < 1) {
                    res.json({
                        status : false,
                        message : "Peserta tidak ditemukan"
                    })
                } else {
                    res.json({
                        status : true,
                        messsage : "Data berhasil diupdate",
                        data : {
                            name : data.new_name,
                            email : data.email,
                            password : hashing.encrypt(data.new_password)
                        }
                    })
                }
            }
        }
    )
})
router.delete("/hapus-peserta", (req,res) => {
    var data = req.body;
    db.query(
        "delete from users where users.id=?",
        [data.id],
        (error, result) => {
            if (error) {
                res.json({
                    status : false,
                    message : error.message
                })
            } else {
                if (result["affectedRows"] < 1) {
                    res.json({
                        status : false,
                        message : "Data kelas tidak ditemukan"
                    })
                } else {
                    res.json({
                        status : true,
                        message : "Data berhasil dihapus",
                    })
                }
            }
        }
    )
})
module.exports = router;