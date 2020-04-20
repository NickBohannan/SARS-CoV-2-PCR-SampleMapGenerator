const XLSX = require('xlsx')
const fs = require('fs')
const translator = require('./translator')

module.exports = (file, quadrant) => {

    let ligoExport = XLSX.readFile(file)
    let sheet1 = ligoExport.Sheets[ligoExport.SheetNames[0]]
    let patientCounter = 0
    let finalPairing = []

    function parseSheet(currentField) {

        let fieldNumber =  Number.parseInt(currentField.substring(1))
        let patientField = "B" + fieldNumber.toString()

        if (sheet1[currentField] == undefined) {
            return 1
        } else {

            patientCounter++
            fieldNumber++

            let newWellWithHyphen = sheet1[currentField].v.replace(/ /g,'')
            let newWellWithoutHyphen = newWellWithHyphen.replace(/-/g,'')
            let translatedWell

            switch(quadrant) {
                case "a":
                    translatedWell = newWellWithoutHyphen
                    break
                case "b":
                    for (let i=0; i<translator.length; i++) {
                        if (translator[i][0] == newWellWithoutHyphen) {
                            translatedWell = translator[i][1]
                        }
                    }
                    break
                case "c":
                    for (let i=0; i<translator.length; i++) {
                        if (translator[i][0] == newWellWithoutHyphen) {
                            translatedWell = translator[i][2]
                        }
                    }
                    break
                case "d":
                    for (let i=0; i<translator.length; i++) {
                        if (translator[i][0] == newWellWithoutHyphen) {
                            translatedWell = translator[i][3]
                        }
                    }
                    break
                default:
                    break
            }

            let currentPatient = sheet1[patientField].v
            let accessionNumber = currentPatient.substring(currentPatient.length - 30, currentPatient.length - 22)

            finalPairing.push([translatedWell, accessionNumber])
            let newField = "A" + fieldNumber.toString()
      
            parseSheet(newField)
        }
    }

    parseSheet("A1")
   
    switch(quadrant) {
        case "a":
            finalPairing = finalPairing.slice(2)
            finalPairing.unshift(["A2", "negative"])
            finalPairing.unshift(["A1", "positive"])
            break
        case "b":
            finalPairing = finalPairing.slice(2)
            finalPairing.unshift(["A14", "negative"])
            finalPairing.unshift(["A13", "positive"])
            break
        case "c":
            finalPairing = finalPairing.slice(2)
            finalPairing.unshift(["I2", "negative"])
            finalPairing.unshift(["I1", "positive"])
            break
        case "d":
            finalPairing = finalPairing.slice(2)
            finalPairing.unshift(["I14", "negative"])
            finalPairing.unshift(["I13", "positive"])
            break
    }

    return finalPairing
}