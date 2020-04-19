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
    
})

module.exports = router