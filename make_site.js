//import { writeFile } from 'fs';
//writeFile('indox.html',"<h1>hello world</h1>", callbackFunction)
var fs = require('fs');
var files = fs.readdirSync('forecasts');

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

    nice_date_str = `${year}-${month}-${day}`;
    formattedDates.push(nice_date_str);

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
