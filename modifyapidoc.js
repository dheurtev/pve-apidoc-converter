//Read the apidoc.js file, modify it so that it can be imported in node.js using require later on
//
// Author: David HEURTEVENT
/* Published under: AGPL v3. 
Read the [LICENSE](https://github.com/dheurtev/pve-apidoc-converter/blob/main/LICENSE) file

Copyright (c) the respective contributors, as shown by the AUTHORS file.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
// regarding apidoc.js https://forum.proxmox.com/threads/api-questions.37581/
// inspired by :

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


