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
        this._id = user.issuedBook._id;
        this.name = user.issuedBook.name;
        this.genre = user.issuedBook.genre;
        this.pirce = user.issuedBook.pirce;
        this.publisher = user.issuedBook.publisher;
        this.issuedBy = user.name;
        this.issuedDate = user.issuedDate;
        this.returnDate = user.returnDate;
    }
}

module.exports = IssuedBook;