const express = require("express")
const router = express.Router()
const fs = require('fs')
const ligoParser = require('../ligoparser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter


router.get("/", async (req, res) => {

    await fs.readdir(process.env.EXPORT_DIRECTORY, (err, data) => {
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

    if (req.body.filename == "") {
        res.send("Please Click Back And Enter a Filename.")
    }

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
        if (quadFiles[key] !== "empty") {
            ligoParser(process.env.FILE_PATH + quadFiles[key], key).forEach((e) => { masterPairing.push(e) })
        }
    }

    // res.send(masterPairing)
    try {
        const csvWriter = createCsvWriter({
            path: process.env.MAPS + `\\${req.body.filename}.csv`,
            header: [
                {id: 'well', title: 'Well'},
                {id: 'sampleName', title: 'Sample Name'},
            ]
        })
    
        const data = []
    
        masterPairing.forEach((e) => {
            data.push({
                well: e[0],
                sampleName: e[1]
            })
        })
    
        await csvWriter.writeRecords(data)

        res.send("CSV Generated... Please Close Tab.")

    } catch(err) {
        console.error(err)
    }

})

module.exports = router