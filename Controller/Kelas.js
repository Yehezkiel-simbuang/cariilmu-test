require("dotenv").config();

var express = require("express");
var router = express.Router();
var db = require("../databaseConn.js");


router.get("/list-kelas", (req,res) => {
    db.query(
        "select * from courses",
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

router.post("/tambah-kelas", (req, res) =>{
    var data = req.body;
    db.query(
        "select * from courses where title=? and course_category_id=?",
        [data.title, data.category_id],
        (error, result) => {
            if (error) {
                res.json({
                    status : false,
                    message : error.message
                })
            } else {
                if (result.length < 1) {
                    db.query(
                        "insert into courses(title, course_category_id) values (?,?)",
                        [data.title, data.category_id],
                        (error, result) => {
                            if (error) {
                                res.json({
                                    status : false,
                                    message : error.message
                                })
                            } else {
                                res.json({
                                    status : true,
                                    message : "Kelas berhasil ditambahkan",
                                    data : {
                                        title : data.title,
                                        category_id : data.category_id
                                    }
                                })  
                            }
                        }
                    )
                } else {
                    res.json({
                        status : false,
                        message : "Kelas sudah tersedia"
                    })
                }
            }
        }
    )
    
})

router.put("/edit-kelas", (req,res) => {
    var data = req.body;
    db.query(
        "update courses set title=?, course_category_id=? where id=?",
        [data.new_title, data.new_category_id, data.class_id],
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
                        message : "Kelas tidak ditemukan"
                    })
                } else {
                    res.json({
                        status : true,
                        messsage : "Data berhasil diupdate",
                        data : {
                            category_id : data.new_category_id,
                            title : data.new_title,
                        }
                    })
                }
            }
        }
    )
})
router.delete("/hapus-kelas", (req,res) => {
    var data = req.body;
    db.query(
        "delete from courses where courses.id=?",
        [data.id],
        (error, result) => {
            if (error) {
                res.json({
                    status : false,
                    message : error.message
                })
            } else {
                if (result["affectedRows"] < 1) {
                    console.log(result["affectedRows"]);
                    res.json({
                        status : false,
                        message : "Data kelas tidak ditemukan"
                    })
                } else {
                    //console.log(result["affectedRows"]);
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