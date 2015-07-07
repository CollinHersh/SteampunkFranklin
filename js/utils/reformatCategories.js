var fs = require('fs');
var _ = require('lodash');


main = function () {
    var categories = JSON.parse(fs.readFileSync('../../content/json/categories.json', 'utf8'));
    Object.keys(categories).forEach ( function (key){
        var lowerCaseList = [];
        categories[key].forEach( function (aClass){
            if(lowerCaseList.indexOf(aClass.toLowerCase()) < 0) {
                lowerCaseList.push(aClass.toLowerCase())
            }
        });
        categories[key] = lowerCaseList;
    });
    fs.writeFileSync('../../content/json/categories2.json', JSON.stringify(categories), 'utf8');
};

main();

