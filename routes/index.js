const express = require("express")
const router = express.Router()
const fs = require('fs')

router.get("/", async (req, res) => {
    let exportedFiles = await fs.readdir(process.env.EXPORT_DIRECTORY, (err, data) => {
        if (err) {
            console.error(err)
        } else {
            res.render('index', {
                exportedFiles: data
            })
        }
        
    }) 
})

router.post("/", async (req, res) => {

    let quadFiles = {}
    let masterMap = 
    
    for (const key in req.body) {
        switch(key) {
            case "quadA":
                quadFiles.a = req.body.quadA
                break
            case "quadB":
                quadFiles.b = req.body.quadB
                break
            case "quadC":
                quadFiles.c = req.body.quadC
                break
            case "quadD":
                quadFiles.d = req.body.quadD
                break
            default:
                break
        }
    }

    console.log(quadFiles)
})

module.exports = router