const express = require("express")
const router = express.Router()
const fs = require('fs')
const ligoParser = require('../ligoparser')

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

    let masterPairing = []
    for (const key in quadFiles) {
        ligoParser(process.env.TEST_PATH + quadFiles[key], key).forEach((e) => { masterPairing.push(e) })
    }

    res.send(masterPairing)
})

module.exports = router