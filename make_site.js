//self notes: still get rid of that redundant variable
//I'm using forEach two different ways, maybe unnecessarily
//still need to sort pngs maybe
//Start here - need to move callback functions of all node functions and move them
//Q: will the / in '../main.css' always work?
//Q: not sure if there's any point in making templates .handlebars if using toString anyway.
//Q: make sure images are only copied over if they don't exist already? what about old ones that need to be deleted?
//Q: still unsure about let vs const
//Idk how webkit works

const fs = require('fs');
const path = require('path');
const Handlebars = require("handlebars");
const files = fs.readdirSync('forecasts');
const homeTemplate = fs.readFileSync('home_template.handlebars').toString();
const subTemplate = fs.readFileSync('subpage_template.handlebars').toString();

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

    //Create object to hold each subsection of images for a single subpage
    const run_hours_obj = {};

    //Copy over images and display them in succession on subpage
    function newSubDir(run_hour) {
        let run_hour_dir = path.join('/',forecast_date_dir, run_hour);        
        let png_names = [];
        let images = fs.readdirSync(path.join(__dirname,run_hour_dir));
    
        images.forEach((image) => {
            //console.log(image);
            if (/^.*[0-9]+-[0-9]+\.png.*$/i.test(image)) {
                png_names.unshift(image);
                //console.log("unshift");
                //console.log(image);
            }
            else if (/^.*\.png+$/i.test(image)) {
                png_names.push(image);
                //console.log("push");
            } 
        });

        //Create an object for a subsection of images to add to run_hours_obj
        let zlabel = `${run_hour.match(/\d+/)}Z Forecasts`;
        const run_hour_obj = {
            title: zlabel,
            images: png_names,
            imagesNum: png_names.length -1
        }
        run_hours_obj[zlabel] = run_hour_obj;

        //Create the path names with the png_names array, then copy them over
        png_names.forEach((png_name) => {
            let png_path = path.join(__dirname,run_hour_dir,png_name);
            let png_out_path = path.join(__dirname,out_dir,png_name);
            
            //Copy the actual images over and adding the image link to the html
            fs.copyFileSync(png_path,png_out_path);
        });
    }
    run_hour_strs.forEach(newSubDir);

    //Write the file using the subpage template
    const subTempComp = Handlebars.compile(subTemplate);
    const subOut = subTempComp({
        date: nice_date_str,
        Z: run_hours_obj
    });
    
    
    fs.writeFileSync(path.join(__dirname,out_dir,"index.html"),subOut);

}
files.forEach(newDir);


//Generate landing page.
const templateComplete = Handlebars.compile(homeTemplate);
const homeOut = templateComplete({
    subpage: nice_date_strs
});
console.log("Writing files");
fs.writeFileSync(path.join(__dirname,"site","index.html"),homeOut);