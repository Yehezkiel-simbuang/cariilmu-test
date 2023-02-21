require("dotenv").config();

var jwt = require("jsonwebtoken");
var key = process.env.key;
var express = require("express");
var router = express.Router();
var db = require("../databaseConn.js");
var hashing = require("../hashing.js");


router.post("/registrasi", (req,res) =>{
    var data = req.body;
    var password = hashing.encrypt(data.password);

    db.query("select * from admin where email=?",[data.email],
    (error, result) => {
        
        if (error) {
            res.json({
                status : false,
                message : error.message
            })
        } else {
            if (result.length < 1) {
                db.query(
                    "insert into admin(name,email,password) values (?,?,?)",
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
                                message : "Registrasi admin berhasil",
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

router.post("/login", (req,res) => {
    var data = req.body;
    db.query(
        "SELECT * from admin where email=? and password=?",
        [data.email, hashing.encrypt(data.password)],
        (error, result) => {
            if (error) {
                console.log(error);
                res.json({
                    status : false,
                    message : "Email atau password salah"
                })
            } else {
                if (result.length < 1) {
                    res.json({
                        status : false,
                        message : "Akun tidak ditemukan"
                    })
                } else {
                    var users = result[0];
                    var token = jwt.sign(users.email, key);
                    res.json({
                        status : true,
                        data : {
                            name : users.name,
                            email : users.email,
                            password : users.password,
                            token : token,
                        }
                    })
                }
            }
        }
    )
})

// router.put("/ubah-password", (req,res) => {
//     var data = req.body;
//     var decoded = jwt.verify(req.headers.token, key);
//     try {
//         db.query(
//         "update admin set password=? where email=?",
//         [hashing.encrypt(data.password), decoded],
//         (error, result) => {
//             console.log(result);
//             if (error) {
//                 res.json({
//                     status : false,
//                     message : error.message
//                 })
//             } else {
//                 if (result.affectedRow > 0) {
//                     res.json({
//                         status : true,
//                         message : "Berhasil mengubah password",
//                     })
//                 } else {
//                     res.json({
//                         status : false,
//                         message : "Email tidak ditemukan"
//                     })              
//                 }
                
//             }
//         }
//     )
//     } catch {
//         res.json({
//             status : false,
//             message : "Token tidak ditemukan"
//         })
//     }
    
// })

module.exports = router;