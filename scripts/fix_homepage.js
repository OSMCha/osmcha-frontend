var fs = require('fs');

var f = JSON.parse(fs.readFileSync('./package.json'));
f.homepage = process.env.REACT_APP_HOMEPAGE;

f = JSON.stringify(f, null, 2);
fs.writeFileSync('./package.json', f);
