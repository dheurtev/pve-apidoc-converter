# pve-apidoc-converter
Download the PVE API documentation (apidoc.js) from Proxmox 
and transform it so that the file can be imported in node.js

## Install the package
```bash
npm install pve-apidoc-converter
```
## Direct use

This package contains a version of PVE API documentation (apidoc.js) for import in node.js.

This file can be loaded in node as per this example for further use:

### Example of use of the converted apidoc
```javascript
const apidoc = require('pve-apidoc-converter');
console.log(apidoc);
```
You can regenerate is manually (see the scripts below).
The file used is apidocmod.js in [./output/modified/apidocmod.js](https://github.com/dheurtev/pve-apidoc-converter/blob/main/output/modified/apidocmod.js). 
## Key considerations regarding apidoc.js 

The documentation of Proxmox's PVE API is:
- distributed as a file [apidoc.js](https://forum.proxmox.com/threads/api-questions.37581/) in the product: 
/usr/share/pve-docs/api-viewer/apidoc.js
- The current API version is available from the API Viewer: https://pve.proxmox.com/pve-docs/api-viewer/ 

In addition, I would recommend reading:

- [Proxmox PVE Developper documentation](https://pve.proxmox.com/wiki/Developer_Documentation)
- [Proxmox PVE Design details (Perl based)](https://git.proxmox.com/?p=pve-common.git;a=blob_plain;f=README.dev;hb=HEAD)

## Further use

In addition to the file, this package contains an analysis of their API file (see below in Observations). 

Their API file can serve as a basis to generate schemas and/or API clients. In particular, it can serve as the source to feed [LUMASERV's proxmox-ve-openapi](https://github.com/LUMASERV/proxmox-ve-openapi). But, key limitations should be considered.

As at August 25, 2021:

- Discussions to ship directly a Perl OpenAPI/Swagger module with the product has been discussed by folks in Dec 2020 : https://www.mail-archive.com/pve-devel@lists.proxmox.com/msg02244.html

- Proxmox stated in a message of [Dec 2020 on its pve-devel mailing list]](https://www.mail-archive.com/pve-devel@lists.proxmox.com/msg02244.html) that "we're not 100% JSONSchema compatible".

In addition, their API is not versioned (making it product's version specific) !

### API statistics

This package has been used to generate an analysis of the Proxmox PVE API as per its documentation.

The script used was [generate_report.js](https://github.com/dheurtev/pve-apidoc-converter/blob/main/generate_report.js).

The output is available in [report.txt](https://github.com/dheurtev/pve-apidoc-converter/blob/main/output/reports/report.txt).

As at 25.08.2021, the script detected in Proxmox's API:
- 4 HTTP methods: GET, POST, PUT and DELETE,
- 6 tags : cluster, nodes, storage, access, pools, version,
- 340 paths,
- 507 operations,
- 505 parameters properties. Sometimes parameters contain dashes or underscores or [n] (see below) 
- 315 returns properties. Sometimes properties contain dashes or underscores or [n] (see below)
- The name of operations in children -> info -> names is unique: delete (15), read (12), update (13).
- Paths sometimes contain:
    - dashes: e.g. /nodes/{node}/qemu/{vmid}/agent/get-host-name
    - underscores: e.g. /nodes/{node}/qemu/{vmid}/move_disk 

In addition, manual inspection of apidoc.js doesn't indicate HTTP response codes.

The report contains further details on the keys and parameters used in the API.

#### Example of the use of [n] found in the API documentation
The maximum of n is specified in the description field. 
The current maximum found is 30, but it varies.
Two examples:
```
                              "serial[n]" : {
                                 "description" : "Create a serial device inside the VM (n is 0 to 3)",
                                 "optional" : 1,
                                 "pattern" : "(/dev/.+|socket)",
                                 "type" : "string",
                                 "verbose_description" : "Create a serial device inside the VM (n is 0 to 3), and pass through a\nhost serial device (i.e. /dev/ttyS0), or create a unix socket on the\nhost side (use 'qm terminal' to open a terminal connection).\n\nNOTE: If you pass through a host serial device, it is no longer possible to migrate such machines -\nuse with special care.\n\nCAUTION: Experimental! User reported problems with this option.\n"
                              },

```
```
scsi[n]" : {
                                 "description" : "Use volume as SCSI hard disk or CD-ROM (n is 0 to 30). Use the special syntax STORAGE_ID:SIZE_IN_GiB to allocate a new volume.",
                                 "format" : {
...
```

## Conclusions

Proxmox's PVE API is a Rest API using the standard 4 verbs.

But, conversion to openAPI on the client side will be fragible since : 

1) The API is not versioned

2) The name of operations provided by Proxmox PVE API (in children -> info -> names) alone cannot be relied upon to build API's as operationIDs in OpenAPI's sense as it is not unique.

3) The presence of the [n] in arguments requires to generate up to 30 parameters.

[LUMASERV's proxmox-ve-openapi](https://github.com/LUMASERV/proxmox-ve-openapi) took the points 2 and 3 into consideration.

### Extra thoughts on the generation of OperationIDs

The [OpenAPI specification](https://swagger.io/specification/) requires a schema with unique OperationIDs.

The schema generated by [LUMASERV's proxmox-ve-openapi](https://github.com/LUMASERV/proxmox-ve-openapi) is mostly valid.

My proposed operationID scheme would differ as :
- One could use the parameter's name directly without brackets, but with first letter capitalized, instead of the word 'Single' e.g. {node} -> Node instead of Single,
- Paths with dashes would be separated with the second word having its first letter capitalized. e.g: foo-read -> FooRead, instead of Fooread

## Scripts

### Download the file from Proxmox
```bash
npm run-script download
```

### Modify it to make it usable
```bash
npm run-script modifyapidoc
```
### Test it
```bash
npm run-script test
```
It should print the apidoc object to console

### Rerun the report
```bash
npm run-script generatereport
```
It should create the file report.txt in output/reports.
Warnings appear in console as well as indication that the report have been saved.
## Contributors
Check the [AUTHORS](https://github.com/dheurtev/pve-apidoc-converter/blob/main/AUTHORS) file
- David Heurtevent

## Help needed
If you find this package useful, please consider donating via Paypal to support my non-profit and open source development activities :
[![Paypal Donation](https://www.paypalobjects.com/en_US/FR/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/donate?hosted_button_id=MU8N9KU6VLBME)

## Licence
Javascript code is published under: AGPL v3 unless stated otherwise.

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

Proxmox's PVE API documentation remains the property of Proxmox. [PVE is released under AGPL v3](https://www.proxmox.com/en/proxmox-ve/features).


