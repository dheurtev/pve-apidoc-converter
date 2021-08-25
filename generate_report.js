// Analysis of the PVE Proxmox API documentation
//
// Generates a report 
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

const report_file = './output/reports/report.txt';

const apidocdest = require('./output/modified/apidocmod.js');
const pveapidoc = apidocdest;

let output = [];

let tags_names = new Set();
let paths_names = {};
let paths_keys = new Set();

let methods_names = {};

let operations_ids = [];
let operations_names = {};
let operations_keys = new Set();

let parameters_keys = new Set();
let parameters_keys_properties = new Set();
let permissions_keys = new Set();
let returns_keys = new Set();
let returns_keys_properties = new Set();

//Utils
const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

//////////////////////

function genOperationsId(path, method){
    //
    let operation = path.replace(/[\{\}\_\-]/g,'/') 
    // splith the path and capitalize the first letter of each path subpart
    operation = operation.split('/').map(capitalizeFirst).join('')
    // transform the method into a verb
    const prefix = (() => {
        switch (method){
            case 'post':
                return 'create';
            case 'put':
                return 'update';
            case 'patch':
                return 'modify';
            case 'delete':
                return 'delete';
            default:
                return method;
        };
    })();
    const s = prefix + operation    
    return s
};

//Parse the list of tags
function parseTags(source){
    pveapidoc.forEach(element => {
        tags_names.add(element.text);
    })    
};

//Parse the info section
function parseInfo(path, method, info){
    // Add the method to method_names
    if (!(method in methods_names )){
        methods_names[method] = 1;
    } else {
        methods_names[method] += 1;
    };
    // Generation the operation ids
    let id = genOperationsId(path, method);
    //add the operation id to the list of operation ids
    if(!operations_ids.includes(id)){
        operations_ids.push(id);
    } else {
        let msg = "WARNING:OPERATION ID: "+ id + " already exists. Consider changing the id generation method";
        console.log(msg);
        output.push(msg);
    };

    //record the operation names
    if (!(info.name in operations_names )){
        operations_names[info.name] = 1;
    } else {
        operations_names[info.name] += 1;
        let msg = "WARNING:OPERATION NAME: "+ info.name + " already exists. Consider changing the operations naming scheme";
        console.log(msg);
        output.push(msg);
    };

    //Add the keys
    Object.keys(info).forEach(element => operations_keys.add(element));
    
    //list the keys at parameters level
    if ('parameters' in info){
        Object.keys(info['parameters']).forEach(element => parameters_keys.add(element));
        
        if ('properties' in info['parameters']){
            Object.keys(info['parameters']['properties']).forEach(element => parameters_keys_properties.add(element));
        };

    };

    if ('permissions' in info){
        Object.keys(info['permissions']).forEach(element => permissions_keys.add(element));
    };

    if ('returns' in info){
        Object.keys(info['returns']).forEach(element => returns_keys.add(element));

        if ('properties' in info['returns']){
            Object.keys(info['returns']['properties']).forEach(element => returns_keys_properties.add(element));
        };

    };
};

//Parse the specification document for path, operations, etc
function parsePath(source){
    //run iteratively when contains children        
    if(source.children)
        source.children.forEach(parsePath);

    //else parse source.info but ignore when source.info is empty (no keys)
    if(source.info && Object.keys(source.info).length > 0 ){
        //add the path, raise an error if already exists
        if (!(source.path in paths_names )){
            paths_names[source.path] = 1;
        } else {
            paths_names[source.path] += 1;
            let msg = "WARNING:PATH: "+ source.path + " already exists \n";
            console.log(msg);
            output.push(msg);
        };

        // parse the information
        Object.keys(source.info).forEach(method => parseInfo(source.path, method.toLowerCase(), source.info[method]));
    };
    //records the keys used at the source/children level
    if(source != null){
        if(Object.keys(source).length > 0 ){
            Object.keys(source).forEach( element => 
                paths_keys.add(element)
            );
        };
    };
};

// Main

//Build the list of tags
pveapidoc.forEach(parseTags);

output.push('---- ANALYSIS OF PROXMOX VE API - Report generated by pve-apidoc-converter ----');
output.push('---- Tags ----');
output.push('--');
output.push("Tags found: " + tags_names.size);
output.push('--');
output.push(Array.from(tags_names).join('\n'));
output.push('--');
output.push('--------------');

//Build the list of paths and operations
pveapidoc.forEach(parsePath);

output.push('---- Methods ----');
output.push('--');
output.push("Methods found: " +  Object.keys(methods_names).length);
output.push('--');
output.push('--');
output.push('Operations by methods count');
output.push('--');
output.push(JSON.stringify(methods_names, null, 2));
output.push('--');
output.push('--------------');

output.push('---- Paths ----');
output.push('--');
output.push("Paths found: " + Object.keys(paths_names).length);
output.push('--');
output.push("Paths keys detected: "+ paths_keys.size);
output.push('--');
output.push(Array.from(paths_keys).join('\n'));
output.push('--');
output.push('--------------');

output.push('---- Operations ----');
output.push('--');
output.push("Operations found: " + operations_ids.length);
output.push('--');
output.push("Operations keys detected: "+ operations_keys.size);
output.push('--');
output.push(Array.from(operations_keys).join('\n'));
output.push('--');
output.push('--------------');

output.push('---- Operations Parameters ----');
output.push('--');
output.push("Operations parameters detected: " + parameters_keys.size);
output.push('--');
output.push(Array.from(parameters_keys).join('\n'));
output.push('--');
output.push("Operations parameters properties detected: " + parameters_keys_properties.size);
output.push('--');
output.push(Array.from(parameters_keys_properties).join('\n'));
output.push('--------------');

output.push('---- Operations Permissions ----');
output.push('--');
output.push("Operations permissions detected: " + permissions_keys.size);
output.push('--');
output.push(Array.from(permissions_keys).join('\n'));
output.push('--');
output.push('--------------');

output.push('---- Operations Returns ----');
output.push('--');
output.push("Operations returns detected: " + returns_keys.size);
output.push('--');
output.push(Array.from(returns_keys).join('\n'));
output.push('--');
output.push("Operations returns properties detected: " + returns_keys_properties.size);
output.push('--');
output.push(Array.from(returns_keys_properties).join('\n'));
output.push('--');
output.push('--------------');


output.push('---- Paths found ----');
output.push('--');
output.push(JSON.stringify(paths_names, null, 2));
output.push('--');

output.push('---- Operation names found ----');
output.push('--');
output.push('Count by operation name');
output.push('--');
output.push(JSON.stringify(operations_names, null, 2));
output.push('--');
output.push('--------------');

output.push('---- Proposed Operation id generated ----');
output.push('--');
output.push(Array.from(operations_ids).join('\n'));
output.push('--');
output.push('--------------');

// Write the report to file
const fs = require('fs');
const { join } = require('pve-apidoc-converter');

fs.writeFileSync(report_file, output.join('\n'));

console.log('report saved here'+ report_file);