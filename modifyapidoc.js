//Read the apidoc.js file, modify it so that it can be imported in node.js using require later on

const fs = require('fs')

const apidocsrc = './output/proxmoxsrc/apidoc.js'

const apidocdest = './output/modified/apidocmod.js'

//function to open a file
const openfile = function(path){
  try {
    const content = fs.readFileSync(path, 'utf8');
    //console.log(datasrc);
    return content;
  } catch (err) {
    console.error(err);
  }
};

//function to write content
const writefile = function(destpath, content){
  try {
    const filemod = fs.writeFileSync(destpath, content);
    //file written successfully
    //console.log(filemod);
  } catch (err) {
  console.error(err);
  }
};

//open the source file
let content
content = openfile(apidocsrc)

//Modify the file
const searchvalue = "const apiSchema = ["
const newvalue = "module.exports = ["
var datamod = content.replace(searchvalue, newvalue)

var output = datamod.substring(0, datamod.lastIndexOf('let method2cmd = {') - 1);

//write the modified file to dest
writefile(apidocdest, output)

//console.log(output);


