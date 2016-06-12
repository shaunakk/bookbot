var book;
var isLibrarian = false;
var isCustomer = false;
var libraryCard = 123;
var loginPhase = false;
var searching = false;
var pin = 4321;
var isLogged = false;
var bookStatus = 0;
var bookInfo;
var image;
var x;
var picked;

function MessageHandler(context, event) {
    if (event.message.toLowerCase().indexOf("first") >= 0) {
        image = { "type": "image", "originalUrl": context.simpledb.roomleveldata.bookInfo.items[0].volumeInfo.imageLinks.thumbnail, "previewUrl": context.simpledb.roomleveldata.bookInfo.items[0].volumeInfo.imageLinks.smallThumbnail };
        x = 0;
        picked = true;
        context.sendResponse(JSON.stringify(image));
    } else if (event.message.toLowerCase().indexOf("second") >= 0) {
        image = { "type": "image", "originalUrl": context.simpledb.roomleveldata.bookInfo.items[1].volumeInfo.imageLinks.thumbnail, "previewUrl": context.simpledb.roomleveldata.bookInfo.items[1].volumeInfo.imageLinks.smallThumbnail };
        x = 1;
        picked = true;
        context.sendResponse(JSON.stringify(image));
    } else if (event.message.toLowerCase().indexOf("third") >= 0) {
        image = { "type": "image", "originalUrl": context.simpledb.roomleveldata.bookInfo.items[2].volumeInfo.imageLinks.thumbnail, "previewUrl": context.simpledb.roomleveldata.bookInfo.items[2].volumeInfo.imageLinks.smallThumbnail };
        x = 2;
        picked = true;
        context.sendResponse(JSON.stringify(image));
    }

    if (event.message.toLowerCase() == "hi" || event.message.toLowerCase() == "hello") {
        context.sendResponse("Hello! Are you a library member or a librarian?");
    } else if (event.message.toLowerCase() == "library member") {
        isCustomer = true;
        loginPhase = true;
        context.sendResponse("Welcome to the library. Please enter your library card number");
    } else if (event.message.toLowerCase() == "librarian") {
        loginPhase = true;
        isLibrarian = true;
        context.sendResponse("Please input your PIN");
    } else if (event.message == "4321") {
        context.sendResponse("You have 1 hold(s) \n The Martian: By Andy Weir");
    } else if (event.message.toLowerCase() == "librarian" && isCustomer) {
        context.sendResponse("I thought you were a customer!");
    } else if (event.message.toLowerCase() == "library member" && isLibrarian) {
        context.sendResponse("I thought you were a librarian!");
    } else if (event.message == libraryCard) {
        context.sendResponse("You are logged in! Would you like to search for a book? Type it here:");
        isLogged = true;
        loginPhase = false;
        searching = true;
    } else if (event.message == pin) {
        context.sendResponse("Thank you librarian. You are logged in. You may search for any book now");
        isLogged = true;
        loginPhase = false;
    } else if ((event.message != libraryCard && loginPhase) || (event.message != pin && loginPhase === true)) {
        context.sendResponse("Wrong Credentials!");
    } else if (bookStatus === 0) {
        book = event.message;
        book = book.replace(/ /g, '+');
        context.simplehttp.makeGet("https://www.googleapis.com/books/v1/volumes?q=" + book + "&key=AIzaSyBzSw27PVE1EmFa1Knn4V7KW4DnWgGaF3Q");
        searching = false;
    }
    if (event.message.toLowerCase() == "yes") {
        context.sendResponse("What should I do with this book?");
    } else if (event.message.toLowerCase() == "no") {
        context.sendResponse("Ok. Search for another book or the same one again")
    }
    if (event.message.toLowerCase().indexOf("hold") >= 0) {
        context.sendResponse("Successful!")

    }
}
//Functions declared below are required
function EventHandler(context, event) {
    if (!context.simpledb.botleveldata.numinstance)
        context.simpledb.botleveldata.numinstance = 0;
    numinstances = parseInt(context.simpledb.botleveldata.numinstance) + 1;
    context.simpledb.botleveldata.numinstance = numinstances;
    context.sendResponse("Thanks for adding me. You are:" + numinstances);
}

function HttpResponseHandler(context, event) {
    if (bookStatus === 0) {
        var output = event.getresp;
        output = JSON.parse(output);
        context.simpledb.roomleveldata.bookInfo = output
        var outStr = ''
        for (i = 0; i < 3; i++) {
            outStr += i + 1 + ". " + output.items[i].volumeInfo.title + ": By " + output.items[i].volumeInfo.authors + "\n \n";
        }

        context.sendResponse("Which one of these books are you looking for? Type yes or no when a book is selected. \n \n " + outStr);
    }
}

function DbGetHandler(context, event) {
    context.sendResponse("testdbput keyword was last get by:" + event.dbval);
}

function DbPutHandler(context, event) {
    context.sendResponse("testdbput keyword was last put by:" + event.dbval);
}
