const XLSX = require('xlsx')
const fs = require('fs')
const translator = require('./translator')

// ligoparser accepts an XLS file and a quadrant and creates an array of all the accession number and well location pairings.
module.exports = (file, quadrant) => {

    let ligoExport = XLSX.readFile(file)

    // sheet1 is the actual sheet in memory now
    let sheet1 = ligoExport.Sheets[ligoExport.SheetNames[0]]
    let finalPairing = []

    // this recursive function takes a current field string (ex. "A1") and parses the well number out as well as accession number and adds it to the finalPairing array. Since it is recursive it will do this until it finds an empty row. The function is invoked right below.
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

            // this switch changes the well location based on which quadrant ligoParser is using
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

    // invoked parseSheet
    parseSheet("A1")
   
    // this switch adds the negative and positive controls to the finalPairing array.
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