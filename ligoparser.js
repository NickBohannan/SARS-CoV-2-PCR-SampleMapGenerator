const XLSX = require('xlsx')
const fs = require('fs')

module.exports = (file, quadrant) => {
    let ligoExport = XLSX.readFile(file)
    let sheet1 = ligoExport.Sheets[ligoExport.SheetNames[0]]
    let patientCounter = 0
    let finalPairing = []

    function parseSheet(currentField) {
        let fieldNumber =  Number.parseInt(currentField.substring(1))
        let patientField = "B" + fieldNumber.toString()
        console.log(sheet1[currentField])
        if (sheet1[currentField] == undefined) {
            return 1
        } else {
            patientCounter++
            fieldNumber++
            let newWellWithHyphen = sheet1[currentField].v.replace(/ /g,'')
            let newWellWithoutHyphen = newWellWithHyphen.replace(/-/g,'')
            // sheet1[currentField].v = newWellWithoutHyphen
            // sheet1[currentField].w = newWellWithoutHyphen
            let currentPatient = sheet1[patientField].v
            let accessionNumber = currentPatient.substring(currentPatient.length - 30, currentPatient.length - 22)
            // QSsheet1[currentField] = {
            //     t: "s",
            //     v: newWellWithoutHyphen
            // }
            finalPairing.push([newWellWithoutHyphen, accessionNumber])
            // QSsheet1[patientField] = {
            //     t: "s",
            //     v: accessionNumber
            // }
            let newField = "A" + fieldNumber.toString()
            parseSheet(newField)
        }
    }

    parseSheet("A1")
}