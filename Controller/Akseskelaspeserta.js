require("dotenv").config();

var express = require("express");
var router = express.Router();
var db = require("../databaseConn.js");

router.get("/list-kelas_peserta", (req,res) => {
    db.query(
        "select * from user_courses",
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

router.post("/tambah-kelas_peserta", (req, res) =>{
    var data = req.body;
    db.query(
        "select * from user_courses where course_id=? and users_id =?",
        [data.course_id, data.users_id],
        (error, result) => {
            if (error) {
                res.json({
                    status : false,
                    message : error.message
                })
            } else {
                if (result.length < 1) {
                    db.query(
                        "insert into user_courses(users_id, course_id) values (?,?)",
                        [data.users_id, data.course_id],
                        (error, result) => {
                            if (error) {
                                res.json({
                                    status : false,
                                    message : error.message
                                })
                            } else {
                                res.json({
                                    status : true,
                                    message : "Akses berhasil ditambahkan",
                                    data : {
                                        users_id : data.users_id,
                                        course_id : data.course_id
                                    }
                                }) 
                            }
                        }
                    )
                } else {
                    res.json({
                        status : false,
                        message : "Akses sudah tersedia"
                    })
                }
            }
        }
    )
})

router.put("/edit-kelas_peserta", (req,res) => {
    var data = req.body;
    db.query(
        "update user_courses set users_id=?, course_id=? where id=?",
        [data.users_id, data.course_id, data.id],
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
                        message : "Kelas peserta tidak ditemukan"
                    })
                } else {
                    res.json({
                        status : true,
                        messsage : "Data berhasil diupdate",
                        data : {
                            users_id : data.users_id,
                            course_id : data.course_id
                        }
                    })
                }
            }
        }
    )
})
router.delete("/hapus-kelas_peserta", (req,res) => {
    var data = req.body;
    db.query(
        "delete from user_courses where id=?",
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
                        message : "Data kelas peserta tidak ditemukan"
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