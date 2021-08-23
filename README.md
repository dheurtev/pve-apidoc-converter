# pve-apidoc-download
Download the Proxmox PVE API documentation (apidoc.js) from https://pve.proxmox.com/pve-docs/api-viewer/ and transform it so that the file can be imported in node.js

## Use

### Install the package
npm install pve-apidoc-download

### Download the file from Proxmox
npm run-script download

### Modify it to make it usable
npm run-script modifyapidoc

### Test it
npm run-script test

It should print the apidoc object to console

### Access the output
The output file is apidocmod.js : ./output/modified/apidocmod.js

### Help needed
If you find this package useful, please consider donating via Paypal to support my non-profit and open source development activities :
[![Paypal Donation](https://www.paypalobjects.com/en_US/FR/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/donate?hosted_button_id=MU8N9KU6VLBME)

### Licence
Published under: AGPL v3. 
Read the LICENCE file

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

