const fs = require('fs');
const path = require('path');

fs.readFile(path.join(__dirname, './data/test.text'), (err, data) => {
    if(err){
        return console.error(err);
    }
    console.log(data.toString());
});