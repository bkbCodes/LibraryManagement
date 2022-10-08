const { BookModel, UserModel } = require("../models");

exports.getAllUsers = async (req,res) =>{
    const users = await UserModel.find();
    if(users.length === 0)
        return res.status(404).json({
            success: "false",
            message: "No user found",
        });

    res.status(200).json({
        success: "true",
        message: users
    });
};

exports.createNewUser = async (req,res) => {
    let { data } = req.body;
    
    if(!data)
        return res.status(400).json({
            success: "false",
            message: "No data provided"
        });
    
    const subDate = new Date(data.subscriptionDate).toISOString().slice(0, 10)
    data.subscriptionDate = subDate;

    if(data.issuedDate){
        const issueDate = new Date(data.issuedDate.slice(0,10)).toISOString().slice(0, 10);
        const returnDate = new Date(data.returnDate.slice(0,10)).toISOString().slice(0, 10);
        data = {...data, issueDate, returnDate};
    }

    await UserModel.create(data);

    const users = await UserModel.find();

    res.status(200).json({
        success: "true",
        message: users,
    });
};

exports.getSingleUserById = async (req,res) => {
    let {id} = req.params;
    const user = await UserModel.findById(id);

    if(!user){
        res.status(404).json({
            success: false,
            message: "User not found",
        });
        return;
    }

    res.status(200).json({
        success: true,
        message: user,
    });
}

exports.updateUserById = async (req,res) => {
    let {id} = req.params;
    let {data} = req.body;

    const updatedUser = await UserModel.findOneAndUpdate(
        {
            _id: id,
        },
        data,
        {
            new: true
        }
    );

    res.status(200).json({
        success: "true",
        data: updatedUser,
    });
}

exports.deleteUserById = async (req,res) => {
    const id = req.params.id;
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate());

    await UserModel.findOneAndDelete(
        {
            _id: id,
            issuedBook: {$exists: false} ,
        }
    );

    const user = await UserModel.find({_id:id});

    if(user.length){
        return res.status(200).json({
            success: "false",
            message: "User cannot be deleted",
        });
    }
    const users = await UserModel.find();

    res.status(200).json({
        success: "true",
        message: "User delete successfully",
        data: users,
    });
}

exports.getUserSubscriptionDetails = async (req,res) =>{
    const {id} = req.params;
    const user = await UserModel.findById(id);
    if(!user){
        res.status(404).json({
            success: "false",
            message: "User not found",
        });
        return;
    }
    
    // date is in mm/dd/yyyy format
    const subscriptionDate = new Date(user.subscriptionDate.slice(0,10));
    let validTill;
    let fine = 0;

    const months = 30*24*60*60*1000;

    if(user.subscriptionType === "Basic")
        validTill = new Date(subscriptionDate.getTime() + (3*months));
    if(user.subscriptionType === "Standard")
        validTill = new Date(subscriptionDate.getTime() + (6*months));
    if(user.subscriptionType === "Premium")
        validTill = new Date(subscriptionDate.getTime() + (12*months));
    
    // if the user has issued a book
    if(user.issuedBook){
        // if user has pending fine then update fine if needed
        fine = user.fine ? user.fine : 0;
        const returnDate = new Date(user.returnDate);
        if(returnDate.getTime() < Date.now()){
            fine+=100;
            if(validTill.getTime() < Date.now())
                fine+=200;
        }
    }

    res.status(200).json({
        success: "true",
        data: {
            "Date of Subscription:" : subscriptionDate.toString(),
            "Valid till" : validTill.toString(),
            "Fine" : fine,
        },
    })
}