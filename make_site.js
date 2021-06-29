//self notes: still get rid of that redundant variable
//I'm using forEach two different ways, maybe unnecessarily
//still need to sort pngs maybe
//Start here - need to move callback functions of all node functions and move them
//Q: will the / in '../main.css' always work?

const fs = require('fs');
const path = require('path')
const files = fs.readdirSync('forecasts');

const nice_date_strs = [];

function newDir(date_str) {
    //Read dates from file names
    let year_str  = date_str.substr(0,4) // "2021"
    let month_str = date_str.substr(4,2) // "06"
    let day_str   = date_str.substr(6,2) // "17"

    //Convert dates into integers
    let year = Number(year_str); // 2021
    let month = Number(month_str); // 6
    let day = Number(day_str); // 17

    //Add formatted date to nice_date_strs array
    let nice_date_str = `${year}-${month}-${day}`;
    nice_date_strs.push(nice_date_str);

    //Specify path of forecast folders and to-be-created copies to later read & write
    let forecast_date_dir   =  path.join('forecasts', date_str); // "forecasts/20210617"
    let out_dir             =  path.join('site', nice_date_str); // "site/2021-6-17"

    //Make directories if they don't exist yet
    if (!fs.existsSync(path.join(__dirname,out_dir))){
        fs.mkdirSync(path.join(__dirname,out_dir));
    }

    //Initialize run_hours_strs to carry subfolder names like t0z 
    let run_hour_strs = [];

    //Node reads & stores the folders in each bigger folder 
    //(e.g. t0z in forecasts/20210617)
    let folders = fs.readdirSync(path.join(__dirname,forecast_date_dir));
    folders.forEach(folder => {
        run_hour_strs.push(folder);
    });

    //Sort run_hour_strs by the number nested within
    run_hour_strs = run_hour_strs.sort(function(a,b) {
        let aVal    = Number(a.match(/\d+/)[0]);
        let bVal    = Number(b.match(/\d+/)[0]);
        if (aVal < bVal) { return -1;}
        if (aVal > bVal) { return 1;}
        else { return 0 }
    });

    //Creating the top html for the subpage
    let out = "";
    out += `<html>\n`;
    out += `<head><title>Nadocast ${nice_date_str}</title>`;
    out += `<link rel="stylesheet" href="../main.css">`;
    out += `</head>\n`;
    out += `<body>\n`;
    out += `<h1>Nadocast ${nice_date_str}</h1>\n`;

    //Copy over images and display them in succession on subpage
    function newSubDir(run_hour) {
        let run_hour_dir = path.join('/',forecast_date_dir, run_hour);
        out += `<h2>${run_hour.match(/\d+/)}Z Forecasts</h2>\n`;
        
        let png_names = [];
        
        let images = fs.readdirSync(path.join(__dirname,run_hour_dir));
    
        images.forEach((image) => {
            if (/^.*\.png+$/i.test(image)) {
                png_names.push(image);
            } 
        });
        png_names.sort();

        //Create the path names with the png_names array, then copy them over
        png_names.forEach((png_name) => {
            let png_path = path.join(__dirname,run_hour_dir,png_name);
            let png_out_path = path.join(__dirname,out_dir,png_name);
            
            //Copy the actual images over and adding the image link to the html
            fs.copyFileSync(png_path,png_out_path);
            out += `<img src=\"${png_name}\">\n`
        });
    }
    run_hour_strs.forEach(newSubDir);


    out += "</body>\n";
    out += "</html>\n";

    //Write the subpage to html
    fs.writeFileSync(path.join(__dirname,out_dir,"index.html"),out);
}
files.forEach(newDir);

//Generate landing page.
out = "";
out += "<html>\n";
out += "<head><title>Nadocast</title>";
out += "<link rel='stylesheet' href='main.css'>";
out += "</head>\n";
out += "<body>\n";
out += "<h1>Nadocast</h1>\n";

out += "<p>Eventually the latest forecast will go here.</p>\n";

//Add links to subpages on landing page
nice_date_strs.forEach((nice_date_str) => {
    out += `<p><a href=\"${nice_date_str}/index.html\">${nice_date_str}</a></p>\n`;
})

out += "</body>\n";
out += "</html>\n";

//Write landing page
fs.writeFileSync(path.join(__dirname,"site","index.html"),out);
