var fs = require('fs');
var _ = require('lodash');

addWordToCount = function (frequencyWordCount, aWord) {
    if (frequencyWordCount[aWord] == undefined) {
        frequencyWordCount[aWord] = 1;
    } else {
        frequencyWordCount[aWord]++;
    }
};

countWords = function (books, symbolsToRemove) {
    var frequencyWordCount = {};
    var symbolsToExclude = ["and", "the", "of", "a", "from", "for", "to",
        "in", "with", "edition", "learning", "2nd", "3rd", "4th", "5th",
        "6th", "7th", "8th", "9th", "10th", "11th",
        "&amp", "&amp;", "using", "an", "at", "is", "as", "by",
        "use", "on", "out", "over", "into", "[paperback]", "on"];

    books.forEach(function (aBook) {
        var wordArray = aBook.title.split(" ");
        wordArray.forEach(function (aClassName) {
            var wordToAdd = aClassName;
            symbolsToRemove.forEach(function (aSymbol) {
                wordToAdd = wordToAdd.replace(aSymbol, "");
            });
            wordToAdd = wordToAdd.replace("&#39;", "`");
            var lowerCaseName = wordToAdd.toLowerCase();
            if (symbolsToExclude.indexOf(lowerCaseName) < 0 && wordToAdd.length > 0) {
                addWordToCount(frequencyWordCount, wordToAdd);
            }
        });
    });
    var workHistogram = _.pairs(frequencyWordCount);
    return _.sortBy(workHistogram, function (pair) {
        return (pair[1] * -1);
    });
};

var setBookClass = function (books, allowedWords, symbolsToRemove) {
    books.forEach(function (aBook) {
        _.pull(aBook.class, "1");
        _.pull(aBook.class, "2");
        var titleWords = aBook.title.split(" ");
        titleWords.forEach(function (aTitleWord) {
            var wordToAdd = aTitleWord;
            symbolsToRemove.forEach(function (aSymbol) {
                wordToAdd = wordToAdd.replace(aSymbol, "");
            });
            wordToAdd = wordToAdd.replace("&#39;", "`");

            if (allowedWords.indexOf(wordToAdd) > -1 &&
                aBook.class.indexOf(wordToAdd) < 0) {
                aBook.class.push(wordToAdd);
            }
        });
    });
};

var byPopuularity = function (books) {
    var aCounter = 0;
    var booksAndHits = books.map(function (aBook) {
        return [aBook.title, aBook.hits];
    });
    var popularBooks = _.sortBy(booksAndHits, function (aBook) {
        return (aBook[1] * -1);
    });
    popularBooks = popularBooks.map(function (aPair) {
        return [aPair[0], aPair[1], aCounter++]
    });
    return popularBooks;
};

addAuthor = function (books) {
    var authors = JSON.parse(fs.readFileSync('../../content/json/author-names.json', 'utf8'));
    books.forEach(function (aBook) {
        aBook.author = "";
        authors.forEach(function (anAuthor) {
            if (aBook.isbn == anAuthor.isbn) {
                aBook.author = anAuthor.author;
            }
        });
    });
};

main = function () {
    var symbolsToRemove = [",", ":", "!", "(", ")", "?"];
    var books = JSON.parse(fs.readFileSync('../../content/json/booklib.json', 'utf8'));
    var frequency = countWords(books, symbolsToRemove);
    var allowedWordsAsTopics = frequency.map(function (anArray) {
       return anArray[0]
    });
    setBookClass(books, allowedWordsAsTopics, symbolsToRemove);
    var popularity = byPopuularity(books);
    addAuthor(books);

    fs.writeFileSync('../../content/json/booklib2.json', JSON.stringify(books), 'utf8');
    fs.writeFileSync('../../content/json/wordCount.json', JSON.stringify(frequency), 'utf8');
    fs.writeFileSync('../../content/json/popularity.json', JSON.stringify(popularity), 'utf8');
};

main();

