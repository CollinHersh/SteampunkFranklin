var fs = require('fs');
var _ = require('lodash');


main = function () {
    var books = JSON.parse(fs.readFileSync('../../content/json/booklib.json', 'utf8'));
    books.forEach ( function (aBook){
        var lowerCaseList = [];
        aBook.class.forEach( function (aClass){
            if(lowerCaseList.indexOf(aClass.toLowerCase()) < 0) {
                lowerCaseList.push(aClass.toLowerCase())
            }
        });
        aBook.class = lowerCaseList;
    });
    fs.writeFileSync('../../content/json/booklib2.json', JSON.stringify(books), 'utf8');
};

main();

