const express = require("express")
const router = express.Router()
const fs = require('fs')
const ligoParser = require('../ligoparser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter

// get main page route. notice export directory environmente variable
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

// the big route of the program where the the parsing happens
router.post("/", async (req, res) => {

    // tell the user to pick a file if they didn't pick anything
    if (req.body.filename == "") {
        res.send("Please Click Back And Enter a Filename.")
    }

    let quadFiles = {}
    
    // this might look redundant, but the body object has more than just quad information, so we need to feed the quad information into its own limited object to do a for in statement
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

    // loop through each quadrant XLS file and run the ligoparser on it
    for (const key in quadFiles) {
        if (quadFiles[key] !== "empty") {

            // this line is kind of a doozie so let's break it down: 

            // you are invoking the ligoparser function that takes a file at a location on the server (the XLS file) as well as a quadrant. this is the first parameter of the ligoparser function (notice the quadFiles[key] is going to be your quadFiles.a or b etc here as the keys are a b c d from the switch above this loop. notice that key is also the source of the quadrant, the second parameter)

            // lastly, notice how there is a forEach after every ligoparser function. this means it takes the finalPairing array that is returned from the function, and for each element in that array, it does something. in this case it pushes to another array, the masterPairing array. This is an array of well locations in ALL quadrants. remember the finalPairing array is from one quadrant only.  
            ligoParser(process.env.FILE_PATH + quadFiles[key], key).forEach((e) => { masterPairing.push(e) })
        }
    }

    // write the masterPairing Array to its own CSV and save it to the maps location with a generated filename from the UI
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