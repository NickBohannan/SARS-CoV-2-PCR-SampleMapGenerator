const express = require("express")
const router = express.Router()
const fs = require('fs')

router.get("/", async (req, res) => {
    let exportedFiles = await fs.readdir("./ligo_exports", (err, data) => {
        if (err) {
            console.error(err)
        } else {
            res.render('index', {
                exportedFiles: data
            })
        }
        
    }) 
})

module.exports = router