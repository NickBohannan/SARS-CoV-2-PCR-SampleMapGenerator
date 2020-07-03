# SARS-CoV-2-PCR-SampleMapGenerator

Sample Map Translator Documentation

Function

The Sample Map Translator takes an exported LigoLab XLS(s) and parses and translates them to a CSV for use in the RT-PCR QuantStudio machines. The user selects all XLS files in the UI for the proper quadrant, and the program generates a CSV of all patient accession numbers and their well locations.

Notice the directory above: 

The entry file is index.js in the root folder. You can change port in this file.
All main logic will be in the index file under routes (GET and POST requests) and the ligoparser.js file. The ligoparser file is used within the scope of the routing file as a subroutine. 
All style information will be in public > style.css
All site structure and layout is in .ejs format (server-side rendered HTML) under views. Currently there is only one web page!
The translator file is used in the parseSheet function in ligoparser.js to compare what well a patient would have given a particular quadrant.
.gitignore is a file where you store the filenames of files you do NOT WANT UPLOADED TO GITHUB. THE .ENV FILE MUST NEVER BE UPLOADED TO A REPOSITORY.
