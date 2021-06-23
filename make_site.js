//import { writeFile } from 'fs';
//writeFile('indox.html',"<h1>hello world</h1>", callbackFunction)
const fs = require('fs');
const path = require('path')
const files = fs.readdirSync('forecasts');

const formattedDates = [];

function ayyy(item,index) {
    //Read dates from file names
    let year_str  = item.substr(0,4) // "2021"
    let month_str = item.substr(4,2) // "06"
    let day_str   = item.substr(6,2) // "17"

    //Convert dates into integers
    let year = Number(year_str);
    let month = Number(month_str);
    let day = Number(day_str);

    let nice_date_str = `${year}-${month}-${day}`;
    formattedDates.push(nice_date_str);

    let forecast_date_dir   =  path.join('/','forecasts', item); // "forecasts/20210617"
    let out_dir             =  path.join('/','site', nice_date_str); // "site/2021-6-17"

    //Make directories if they don't exist yet
    fs.mkdir(path.join(__dirname,out_dir), 
        { recursive: true }, (err) => {
            if (err) {
                return console.error(err);
            }
            console.log('Directory created successfully!');
    });

    let run_hour_strs = []

    fs.readdir(path.join(__dirname,forecast_date_dir), (err, folders) => {
        folders.forEach(folder => {
          run_hour_strs.push(folder);
        });
        run_hour_strs = run_hour_strs.sort(function(a,b) {
            let aVal    = Number(a.match(/\d+/)[0]);
            let bVal    = Number(b.match(/\d+/)[0]);
            if (aVal < bVal) { return -1;}
            if (aVal > bVal) { return 1;}
            else { return 0 }
        });
        console.log("!!!!!!" + run_hour_strs);
      });

    let out = "";
    out += `<html>\n`;
    out += `<head><title>Nadocast ${nice_date_str}</title></head>\n`;
    out += `<body>\n`;
    out += `<h1>Nadocast ${nice_date_str}</h1>\n`;


}
files.forEach(ayyy);
console.log(formattedDates);







fs.writeFile('indox.html',"<h1>hello world</h1>" + formattedDates,  (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");
      //console.log("The written has the following contents:");
      //console.log(fs.readFileSync("indox.txt", "utf8"));
    }
  });
