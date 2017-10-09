const fs = require("fs");
const path = require("path");

if (process.argv.length < 3) {
    console.log("Недостаточно аргументов");
    process.exit();
}
if (process.argv.length > 3) {
    console.log("Много аргументов");
    process.exit();
}
const dir = process.argv[2];
let array_of_files = [];

let prefix = "";
var logger = fs.createWriteStream('summary.js');

var readFiles = function (dir, prefix) {
    fs.readdir(dir, function (err, files) {
        if (err) console.error(err);
        for (let i = 0; i < files.length; i++) {
            let new_dir = dir + '/' + files[i];
            if
            (fs.statSync(new_dir).isDirectory()) readFiles(new_dir, prefix + files[i] + '/');
            else {
                array_of_files.push(new_dir);
                logger.write("console.log(\"" + prefix + files[i] + "\");\n");
            }
        }
    });
}
readFiles(dir, prefix);
var copyright = "";

fs.readFile("copyright.json", (err, text) => {
    copyright = JSON.parse(text).copyright;
    var new_directory = dir + '\\' + path.basename(dir);
    fs.access(new_directory, function (err) {
        if (err && err.code == 'ENOENT') {
            fs.mkdir(new_directory, (err) => {
                if (err) console.error(err);
            });
        }
    });

    for (let i = 0; i < array_of_files.length; ++i) {
        let newfile = new_directory + '\\' + path.basename(array_of_files[i]);
        const logger = fs.createWriteStream(newfile);
        fs.readFile(array_of_files[i], (err, text) => {
            logger.write(copyright + "\n" + text + "n" + copyright);
			/*logger.write(text);
			logger.write("\n" + copyright);
    */
        });
       }

    fs.watch(new_directory, (err, file) =>
    {
        if (err) console.error(err);
        console.log(file.toString());
    })
});