// On document ready:

var booksData = [];
var categoryData = [];
var franklinQuotes = [];
var categoryInDOM = [];
var booksByCategory = {};
var appendRequired = true;

function loadJSON(jsonURI, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', jsonURI, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

var updateDOMwithBooks = function (booksData, franklinQuotes, classLabel, callback) {
    var actualClass = replaceSymbols(classLabel);
    var containerDiv = $('#Container');

    if (booksByCategory[actualClass] &&
        $(actualClass).size() < booksByCategory[actualClass].length) {
        booksByCategory[classLabel].forEach(function (aBook) {
            if (!aBook.inDOM) {
                var newDiv = document.createElement("div");
                newDiv.classList.add("mix");
                newDiv.classList.add("t-book-link");
                newDiv.setAttribute("data-myorder", dataOrderAsText(Number.parseInt(aBook.sortord) + 100));
                aBook.class.forEach(function (aClass) {
                    newDiv.classList.add(aClass);
                });

                var anAnchorLink = document.createElement("a");
                anAnchorLink.setAttribute("href", "https://schools.safaribooksonline.com/library/view/" + aBook.magicnum + "/");
                anAnchorLink.setAttribute("target", "_blank");

                var coverImg = new Image(); // HTML5 Constructor
                coverImg.src = "https://schools.safaribooksonline.com/library/cover/" + aBook.isbn + "/";
                coverImg.alt = aBook.title;
                coverImg.classList.add("image");

                var titleText = document.createTextNode(aBook.title);
                var titleDiv = document.createElement("div");
                titleDiv.classList.add("title");
                titleDiv.appendChild(titleText);

                if (aBook.subtitle !== undefined || aBook.author !== undefined || aBook.pubdate !== undefined) {
                    var detailsDiv = document.createElement("div");
                    detailsDiv.classList.add("details");
                    if (aBook.subtitle !== undefined) {
                        var subtitleText = document.createTextNode(aBook.subtitle + "");
                        detailsDiv.appendChild(subtitleText);
                    }
                    if (aBook.author !== undefined) {
                        var authorText = document.createTextNode(aBook.author + "");
                        detailsDiv.appendChild(authorText);
                    }
                    if (aBook.pubdate !== undefined) {
                        var pubdateText = document.createTextNode(aBook.pubdate.substr(0, 4) + "");
                        detailsDiv.appendChild(pubdateText);
                    }
                    titleDiv.appendChild(detailsDiv);
                }

                anAnchorLink.appendChild(titleDiv);
                anAnchorLink.appendChild(coverImg);
                newDiv.appendChild(anAnchorLink);

                containerDiv.prepend(newDiv);
                aBook.inDOM = true;

                checkForQuoteAndShow(classLabel, aBook, franklinQuotes);
            }
        });
    }
    if (callback)
        callback();
};

var updateDOMwithNavigation = function (categoryData, categorySelected, bookList, callback) {
    var data_order_counter = 0;
    var actualCategory = categorySelected.substr(1);
    var containerDiv = $('#Container');

    if (!categoryData[actualCategory] ||
        actualCategory === "life-hacks" ||
        categoryInDOM.indexOf(actualCategory) >= 0) {
        if (callback)
            callback();
        return;
    }

    categoryInDOM.push(actualCategory);

    categoryData[actualCategory].forEach(function (aCategory) {
        var newDiv = document.createElement("div");
        newDiv.classList.add("mix");
        newDiv.classList.add("t-book-link");
        newDiv.classList.add(actualCategory);
        newDiv.setAttribute("data-myorder", dataOrderAsText(data_order_counter));
        newDiv.classList.add("filter");
        newDiv.setAttribute("data-filter", "." + replaceSymbols(aCategory) + ",.sshs-donations,.sshs-credit,.fundraiser");

        var coverImg = new Image(); // HTML5 Constructor
        coverImg.src = "https://schools.safaribooksonline.com/library/cover/" + firstCoverForTopic(replaceSymbols(aCategory), bookList) + "/";
        coverImg.alt = aCategory;
        coverImg.classList.add("image");

        var titleText = document.createTextNode(aCategory);
        var titleDiv = document.createElement("div");
        titleDiv.classList.add("category");
        titleDiv.classList.add("title");
        titleDiv.appendChild(titleText);

        var categoryDiv = document.createElement("div");
        categoryDiv.classList.add("categoryDiv");
        categoryDiv.appendChild(titleDiv);

        newDiv.appendChild(coverImg);
        newDiv.appendChild(categoryDiv);

        containerDiv.prepend(newDiv);

        data_order_counter += 2;

    });

    if (callback)
        callback();
};

var updateDOMwithFundraisers = function (callback) {
    var data_order_counter = 9950;
    var fundraisers =
        [
            {
                'promo_title': 'We are delighted to accept suggestions for improving this website. First priority is given to pull requests to our public repository. Please add relevant code comments that beginning high school students would understand.',
                'promo_image': 'repo-image.png',
                'promo_link': '//github.com/Santa-Susana-High-School/SteampunkFranklin',
                'promo_button': 'Pull Requests',
                'promo_class': 'suggestions'
            },
            {
                'promo_title': 'Do you have a favorite book in this library? Is it best in its category? Help us push it higher in the sort order. Let us know!',
                'promo_image': 'survey-icon.png',
                'promo_link': '//goo.gl/forms/CbXwKRlFDT',
                'promo_button': 'Online Form',
                'promo_class': 'suggestions'
            },
            {
                'promo_title': 'Do you have more relevant Benjamin Franklin quotes you would like to add? Let us know!',
                'promo_image': 'survey-icon.png',
                'promo_link': '//goo.gl/forms/CbXwKRlFDT',
                'promo_button': 'Online Form',
                'promo_class': 'suggestions'
            },
            {
                'promo_title': 'Do you have a story you would like to tell about your experiences with one or more of these books?',
                'promo_image': 'survey-icon.png',
                'promo_link': '//goo.gl/forms/CbXwKRlFDT',
                'promo_button': 'Online Form',
                'promo_class': 'suggestions'
            },
            {
                'promo_title': 'Help us buy a year of Adobe CC so students can continue this project. Your donation goes towards covering our $2,800 annual fee.',
                'promo_link': '//gofund.me/steampunk',
                'promo_image': 'creative-cloud-fundraiser.png',
                'promo_button': 'Donate',
                'promo_class': 'sshs-donations'
            },
            {
                'promo_title': 'Help engineering and web dev students work on a "project that matters". Help students create website to host discussion abut Thorium powered under water concrete submarines for electric power generation, fresh water distillation, and hydrogen production.',
                'promo_link': '//electrickraken.com',
                'promo_image': 'electrickraken-proj.png',
                'promo_class': 'sshs-thorium'
            },
            {
                'promo_title': 'Help students build a 3D web map of possible educational career and anticipated needed business career futures for each other to explore and role play.',
                'promo_link': '//futureuu.com',
                'promo_image': 'futureuu.png',
                'promo_button': 'Donate',
                'promo_class': 'sshs-donations'
            },
            {
                'promo_title': 'We are delighted to credit our digital arts students with the "Steampunk Franklin" designs found on this website. For internship offers, please contact our school\'s career center.',
                'promo_image': 'digital-arts-students-credit.png',
                'promo_button': 'Meet our students',
                'promo_class': 'art-students'
            },
            {
                'promo_title': 'We are delighted to credit our webmaster students with the design of this website. For internship offers, please contact our school\'s career center.',
                'promo_image': 'webmaster-students-credit.png',
                'promo_button': 'Meet our students',
                'promo_class': 'web-students'
            }
        ];
    var containerDiv = $('#Container');

    tshirtOffer(data_order_counter++);

    fundraisers.forEach(function (aFundraiser) {

        var newDiv = document.createElement("div");
        newDiv.classList.add("mix");
        newDiv.classList.add("t-book-link");
        if (aFundraiser.promo_class == "suggestions") {
            newDiv.classList.add("suggestions");
        } else {
            newDiv.classList.add("fundraiser");
        }
        newDiv.setAttribute("data-myorder", dataOrderAsText(data_order_counter));

        var coverImg = new Image(); // HTML5 Constructor
        coverImg.src = "content/images/" + aFundraiser.promo_image;
        coverImg.alt = aFundraiser.promo_title;
        coverImg.classList.add("image");

        var titleText = document.createTextNode("Santa Susana High School - " + aFundraiser.promo_title);
        var titleDiv = document.createElement("div");
        titleDiv.appendChild(titleText);
        titleDiv.classList.add("title");
        titleDiv.classList.add("img-wide");
        if (aFundraiser.promo_class) {
            titleDiv.classList.add(aFundraiser.promo_class);
        }
        titleDiv.style = "...";
        if (aFundraiser.promo_button) {
            var newButton = document.createElement("button");
            var buttonText = document.createTextNode(aFundraiser.promo_button);
            newButton.appendChild(buttonText);
            titleDiv.appendChild(newButton);
        }

        newDiv.setAttribute("data-myorder", dataOrderAsText(data_order_counter));

        if (aFundraiser.promo_link) {
            var anAnchorLink = document.createElement("a");
            anAnchorLink.setAttribute("href", aFundraiser.promo_link);
            anAnchorLink.setAttribute("target", "_blank");
            anAnchorLink.appendChild(titleDiv);
            newDiv.appendChild(anAnchorLink);
            anAnchorLink.appendChild(coverImg);
        } else {
            newDiv.appendChild(titleDiv);
            newDiv.appendChild(coverImg);
            newDiv.classList.add("filter");
            newDiv.setAttribute("data-filter", "." + aFundraiser.promo_class);
        }

        // add the newly created element and its content into the DOM
        containerDiv.append(newDiv);

        data_order_counter += 2;
    });
    if (callback)
        callback();
};

var firstCoverForTopic = function (aCategory, bookList) {
    var returnValue = "";
    bookList.forEach(function (aBook) {
        aBook.class.forEach(function (aClass) {
            if (aClass === aCategory) {
                returnValue = aBook.isbn;
                return (returnValue);
            }
        })
    });
    return (returnValue);
};

var checkForQuoteAndShow = function (classLabel, aBook, franklinQuotes) {
    if (franklinQuotes[classLabel]) {
        if (franklinQuotes[classLabel][aBook.isbn]) {
            var newDiv = document.createElement("div");
            newDiv.classList.add("mix");
            newDiv.classList.add("t-book-link");
            newDiv.classList.add(classLabel);
            newDiv.setAttribute("data-myorder", dataOrderAsText(Number.parseInt(aBook.sortord) + 50));

            var quoteDiv = document.createElement("div");
            quoteDiv.classList.add("franklin-quote");

            var coverImg = new Image(); // HTML5 Constructor
            coverImg.src = franklinQuotes[classLabel][aBook.isbn];
            coverImg.alt = "Franklin Quote Image";

            var anAnchorLink = document.createElement("a");
            anAnchorLink.setAttribute("href", "//gofundme.com/steampunk");
            anAnchorLink.setAttribute("target", "_blank");

            quoteDiv.appendChild(coverImg);
            anAnchorLink.appendChild(quoteDiv);
            newDiv.appendChild(anAnchorLink);

            $('#Container').prepend(newDiv);
        }
    }
};

var tshirtOffer = function (data_order_counter) {
    var newDiv = document.createElement("div");
    newDiv.classList.add("mix");
    newDiv.classList.add("t-book-link");
    newDiv.classList.add("fundraiser");
    newDiv.setAttribute("data-myorder", dataOrderAsText(data_order_counter));

    var quoteDiv = document.createElement("div");
    quoteDiv.classList.add("franklin-quote");

    var coverImg = new Image(); // HTML5 Constructor
    coverImg.src = "content/images/franklin_quotes/tshirts-offer.png";
    coverImg.alt = "T-shirt offer";

    var anAnchorLink = document.createElement("a");
    anAnchorLink.setAttribute("href", "//gofundme.com/steampunk");
    anAnchorLink.setAttribute("target", "_blank");

    quoteDiv.appendChild(coverImg);
    anAnchorLink.appendChild(quoteDiv);
    newDiv.appendChild(anAnchorLink);

    $('#Container').append(newDiv);

};

var updateDOMwithStudents = function (callback) {
    var data_order_counter = 9970;
    var students =
        [
            {"name": "Kyle", "course": "web-students"},
            {"name": "Andrew", "course": "web-students"},
            {"name": "Daniel", "course": "web-students"},
            {"name": "Alex", "course": "web-students"},
            {"name": "Victoria", "course": "web-students"},
            {"name": "Thomas", "course": "web-students"},
            {"name": "Michael", "course": "web-students"},
            {"name": "Jayden", "course": "web-students"},
            {"name": "Alexis", "course": "art-students"},
            {"name": "Carly", "course": "art-students"},
            {"name": "Janae", "course": "art-students"}
        ];
    var containerDiv = $('#Container');

    students.forEach(function (aStudent) {

        var newDiv = document.createElement("div");
        newDiv.classList.add("mix");
        newDiv.classList.add("t-book-link");
        newDiv.classList.add(aStudent.course);
        newDiv.setAttribute("data-myorder", dataOrderAsText(data_order_counter));
        newDiv.classList.add("filter");
        newDiv.setAttribute("data-filter", ".send-contact-form");

        var coverImg = new Image(); // HTML5 Constructor
        coverImg.src = "content/images/spf_cards/" + aStudent.name + "/card.png";
        coverImg.alt = aStudent.name + "'s Card";
        coverImg.classList.add("student");

        var studentDiv = document.createElement("div");
        studentDiv.classList.add("student-card");

        studentDiv.appendChild(coverImg);
        newDiv.appendChild(studentDiv);

        // add the newly created element and its content into the DOM
        containerDiv.append(newDiv);
        data_order_counter += 2;

    });

    var contactFormDiv = document.createElement("div");
    contactFormDiv.classList.add("mix");
    contactFormDiv.classList.add("t-book-link");
    contactFormDiv.classList.add("send-contact-form");
    contactFormDiv.classList.add("web-students");
    contactFormDiv.classList.add("art-students");
    contactFormDiv.setAttribute("data-myorder", dataOrderAsText(data_order_counter) + 100);

    var schoolDiv = document.createElement("div");
    schoolDiv.classList.add("student-card");

    var anAnchorLink = document.createElement("a");
    anAnchorLink.setAttribute("href", "//www.santasusana.org/counseling/ccc.php");
    anAnchorLink.setAttribute("target", "_blank");

    var coverImg = new Image(); // HTML5 Constructor
    coverImg.src = "content/images/spf_cards/contactForm.png";
    coverImg.classList.add("send-contact-form-img");

    anAnchorLink.appendChild(coverImg);
    schoolDiv.appendChild(anAnchorLink);
    contactFormDiv.appendChild(schoolDiv);

    // add the newly created element and its content into the DOM
    containerDiv.append(contactFormDiv);

    if (callback)
        callback();
};

var dataOrderAsText = function (data_order_counter) {
    return ("000000" + data_order_counter).slice(-6);
};

var replaceSymbols = function (aString) {
    var resultStr = aString.replace("/", "_slash_");
    resultStr = resultStr.replace("#", "_sharp");
    return resultStr;
};

var findBooksByCategory = function (callback) {
    booksData.forEach(function (aBook) {
        aBook.class.forEach(function (aCategory) {
            if (booksByCategory[aCategory]) {
                booksByCategory[aCategory].push(aBook);
            } else {
                booksByCategory[aCategory] = [aBook];
            }
        });
    });
    if (callback)
        callback();
};

// Instantiate MixItUp:
var startMix = function (hashFound, callback) {
    $('#Container').mixItUp({
        animation: {
            duration: 400,
            effects: 'fade translateZ(-360px) translateY(10%) translateX(10%) rotateY(45deg) stagger(32ms)',
            easing: 'ease',
            queue: true,
            queueLimit: 2000
        },
        load: {
            filter: '.life-hacks,.fundraiser',
            sort: 'myorder:asc'
        },
        controls: {
            live: true
        },
        callbacks: {
            onMixStart: function (state, futureState) {
                if (appendRequired) {
                    if (futureState.activeFilter != null) {
                        var actualFilter = futureState.activeFilter.split(",")[0];
                        var actualSort = futureState.activeSort;
                        var actualClass = actualFilter.substr(1);
                        var stateObj;

                        if ([".mix", ".life-hacks"].indexOf(actualFilter) < 0) {
                            // TODO: If quantity in dom is too many, remove some old categories
                            updateDOMwithBooks(booksData, franklinQuotes, actualClass);
                            updateDOMwithNavigation(categoryData, actualFilter, booksData);

                            stateObj = {index: actualClass};
                            history.pushState(stateObj, actualClass, "index.html#" + actualClass);
                        } else {
                            stateObj = {index: ""};
                            history.pushState(stateObj, actualClass, "index.html");
                        }
                        appendRequired = false;
                        $('#Container').mixItUp('multiMix', {
                            filter: futureState.activeFilter,
                            sort: actualSort
                        });
                    }
                } else {
                    appendRequired = true;
                }
            },
            onMixBusy: function (state) {
                console.log('MixItUp busy running: ' + state.activeFilter);
            },
            onMixFail: function (state) {
                console.log('No elements found matching ' + state.activeFilter);
            }
        }
    });
    if (callback)
        callback(hashFound);
};

var appStart = function () {
    loadJSON('content/json/categories.json', function (response) {
        categoryData = JSON.parse(response);
        loadJSON('content/json/booklib.json', function (response) {
            booksData = JSON.parse(response);
            loadJSON('content/json/franklin_quotes.json', function (response) {
                franklinQuotes = JSON.parse(response);
                findBooksByCategory(function () {
                    updateDOMwithFundraisers(function () {
                        updateDOMwithStudents(function () {
                            startMix(window.location.hash,
                                function (hashFound) {
                                    if (hashFound > "") {
                                        var actualFilter = hashFound.substr(1);
                                        updateDOMwithBooks(booksData, franklinQuotes, actualFilter);
                                        updateDOMwithNavigation(categoryData, "." + actualFilter, booksData);
                                    }
                                }
                            );
                        });
                    });
                });
            });
        });
    });
};
