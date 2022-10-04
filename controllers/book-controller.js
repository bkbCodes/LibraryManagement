const { BookModel, UserModel } = require("../models");

exports.getAllBooks = async (req,res) =>{
    const books = await BookModel.find();
    if(books.length === 0)
        return res.status(404).json({
            success: "false",
            message: "No book found",
        });

    res.status(200).json({
        success: "true",
        message: books,
    });
};

exports.createNewBook = async (req,res) =>{
    const { data } = req.body;
    if(!data) {
        return res.status(400).json({
            success: "false",
            message: "No data provided"
        });
    }
    await BookModel.create(data);

    const allBooks = await BookModel.find();

    res.status(200).json({
        success: "true",
        message: allBooks
    });
};

exports.getSingleBookById = async (req,res) =>{
    const {id} = req.params;
    const book = await BookModel.findById(id);
    if(!book){
        res.status(200).json({
            success: "false",
            message: "Book not found"
        });
        return;
    }
    res.status(200).json({
        success: "true",
        message: book
    });
};

exports.getAllIssuedBooks = async (req,res) =>{
    const users = await UserModel.find({
        issuedBook: {$exists: true},
    }).populate("issuedBook");

    const issuedBooks = users.forEach((each) => new IssuedBook(each));

    if(!issuedBooks){
        res.status(200).json({
            success: "true",
            message: "No issued books"
        });
        return;
    }

    res.status(200).json({
        success: "true",
        message: issuedBooks
    });
}

exports.updateBookById = async (req,res) =>{
    const {id} = req.params;
    const {data} = req.body;

    const updatedBook = await BookModel.findOneAndUpdate(
        {
            _id: id,
        },
        data,
        {
            new: true,
        }
    );

    res.status(200).json({
        success: "true",
        message: updatedBook
    });
};

exports.getAllIssuedBooksWithFine = async (req,res) =>{
    const currentDate = Date.now();
    const users = await UserModel.find({
        issuedBook: {$exists: true},
        returnDate: {$lt: currentDate}
    }).populate("issuedBook");

    const issuedBooks = users.forEach((each) => new IssuedBook(each));

    if(!issuedBooks){
        res.status(200).json({
            success: "true",
            message: "No issued books with fine"
        });
        return;
    }

    res.status(200).json({
        success: "true",
        message: issuedBooks
    });
}