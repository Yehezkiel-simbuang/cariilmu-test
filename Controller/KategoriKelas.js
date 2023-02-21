require("dotenv").config();

var express = require("express");
var router = express.Router();
var db = require("../databaseConn.js");


router.get("/list-kategori", (req,res) => {
    db.query(
        "select * from course_categories",
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

router.post("/tambah-kategori", (req, res) =>{
    var data = req.body;
    db.query("select * from course_categories where name=?",[data.category_name],
    (error, result) => {
        if (error) {
            res.json({
                status : false,
                message : error.message
            })
        } else {
            if (result.length < 1) {
                db.query(
                    "insert into course_categories(name) values (?)",
                    [data.category_name],
                    (error, result) => {
                        if (error) {
                            res.json({
                                status : false,
                                message : error.message
                            })
                        } else {
                            res.json({
                                status : true,
                                message : "Kategori berhasil ditambahkan",
                                data : {
                                    category_name : data.category_name
                                }
                            })
                        }
                    }
                )
            } else {
                res.json({
                    status : false,
                    message : "Kategori sudah tersedia"
                })
            }
        }
    })
})
router.put("/edit-kategori", (req,res) => {
    var data = req.body;
    db.query(
        "update course_categories set name=? where id=?",
        [data.new_category, data.category_id],
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
                        message : "Nama kategori kelas tidak ditemukan"
                    })
                } else {
                    res.json({
                        status : true,
                        messsage : "Data berhasil diupdate",
                        data : {
                            data_baru : data.new_category
                        }
                    })
                }
            }
        }
    )
})
router.delete("/hapus-kategori", (req,res) => {
    var data = req.body;
    db.query(
        "delete from course_categories where course_categories.id =?",
        [data.id_category],
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
                        message : "Data kategori tidak ditemukan"
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