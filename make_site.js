//self notes: still get rid of that redundant variable
//I'm using forEach two different ways, maybe unnecessarily

const fs = require('fs');
const path = require('path')
const files = fs.readdirSync('forecasts');

const formattedDates = [];

function newDir(date_str) {
    //Read dates from file names
    let year_str  = date_str.substr(0,4) // "2021"
    let month_str = date_str.substr(4,2) // "06"
    let day_str   = date_str.substr(6,2) // "17"

    //Convert dates into integers
    let year = Number(year_str);
    let month = Number(month_str);
    let day = Number(day_str);

    let nice_date_str = `${year}-${month}-${day}`;
    formattedDates.push(nice_date_str);

    let forecast_date_dir   =  path.join('/','forecasts', date_str); // "forecasts/20210617"
    let out_dir             =  path.join('/','site', nice_date_str); // "site/2021-6-17"

    //Make directories if they don't exist yet
    fs.mkdir(path.join(__dirname,out_dir), 
        { recursive: true }, (err) => {
            if (err) {
                return console.error(err);
            }
            console.log('Directory created successfully!');
    });

    //Initialize run_hours_strs to be folder names and 
    //run_hours to be the numbers in each
    //Q: why must these be defined outside fs.readdir?
    let run_hour_strs = [];
    let run_hours = [];

    //Use node.js to read the folders in each bigger folder
    //And use the names to add to the arrays above
    fs.readdir(path.join(__dirname,forecast_date_dir), (err, folders) => {
        folders.forEach(folder => {
          run_hour_strs.push(folder);
        });
        //note: can make this shorter by not sorting run_hour_strs, only run_hours
        run_hour_strs = run_hour_strs.sort(function(a,b) {
            let aVal    = Number(a.match(/\d+/)[0]);
            let bVal    = Number(b.match(/\d+/)[0]);
            if (aVal < bVal) { return -1;}
            if (aVal > bVal) { return 1;}
            else { return 0 }
        });
        //is this correct syntax?
        run_hour_strs.forEach((c) => run_hours.push(c.match(/\d+/)));

        //testing
        console.log("run_hour_strs = "+run_hour_strs + "\nrun_hours = " + run_hours);

        let out = "";
        out += `<html>\n`;
        out += `<head><title>Nadocast ${nice_date_str}</title></head>\n`;
        out += `<body>\n`;
        out += `<h1>Nadocast ${nice_date_str}</h1>\n`;

        //actually might get rid of run_hours altogether
        function newSubDir(run_hour) {
            let run_hour_dir = path.join('/',forecast_date_dir, run_hour);
            out += `<h2>${run_hour.match(/\d+/)}Z Forecasts</h2>\n`;

            
            let png_names = [];
            //need to make sure this is sorted, Brian did it manually it
            //seems like it's already sorted here. also why are the folders
            //unordered now?
            fs.readdir(path.join(__dirname,run_hour_dir),(err,images) => {
                console.log("\n\n__dirname: "+__dirname);
                console.log("run_hour_dir: "+run_hour_dir);
                //console.log(images);
                images.forEach((image) => {
                    if (/^.*\.png+$/i.test(image)) {
                        png_names.push(image);
                    }
                    png_names.forEach((png_name) => {
                        //let png_path = path.join(path.join(__dirname,run_hour_dir),png_name);
                        //console.log("\npng_path: "+png_path);
                    });
                })
                console.log(">>>");
                png_names.forEach((png) => console.log(png));

            });
        }
        run_hour_strs.forEach(newSubDir);

        //testing
        console.log(out);

        // ......
        // ......

      });
    console.log("This runs before run_hour_strs is defined" + run_hour_strs);



    


}
files.forEach(newDir);
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
