// Data-Transform object
class IssuedBook{
    _id;
    name;
    genre;
    pirce;
    publisher;
    issuedBy;
    issuedDate;
    returnDate;

    constructor(user){
        tihs._id = user.issuedBook._id;
        tihs.name = user.issuedBook.name;
        tihs.genre = user.issuedBook.genre;
        tihs.pirce = user.issuedBook.pirce;
        tihs.publisher = user.issuedBook.publisher;
        tihs.issuedBy = user.name;
        tihs.issuedDate = user.issuedDate;
        tihs.returnDate = user.returnDate;
    }
}

module.exports = IssuedBook;