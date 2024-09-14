const express = require("express");
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


const mongoose = require('mongoose');
const mongoUrl = "mongodb://localhost:27017/USER";//here USER is the name of the collection
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Database connected...");
})
    .catch((e) => {
        console.log(e);
    });


// const userSchema = new mongoose.Schema({
//     name: String,
//     email: String,
//     password: String,
// });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, // Remove whitespace from both ends of the string
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure uniqueness of email
        trim: true, // Remove whitespace from both ends of the string
    },
    password: {
        type: String,
        required: true,
        trim: true, // Remove whitespace from both ends of the string
    },
});


const User = mongoose.model("User", userSchema);//User is the name of the database where information is stored




app.post("/signup", async (req, res) => {



    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            const newUser = new User({
                name,
                email,
                password
            });
            await newUser.save();
            console.log("User added successfully");
            res.redirect('aastha.html');
        } else {
            res.status(400).json({ message: "User already exists" });
            console.log("Already a user!")
        }

    }
    catch (error) {
        console.log(error);
        res.redirect("error");

    }
})




app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ name: username, password: password });
        if (user) {
            // Username and password matched, redirect to aastha.html
            res.redirect('aastha.html');
        } else {
            res.redirect('signup.html')
            // Username or password incorrect, render login page with error message
            // res.status(401).send("Invalid username or password");
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});



const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    }
});
const Message = mongoose.model("Message", messageSchema);
app.post("/form", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        const newMessage = new Message({
            name,
            email,
            subject,
            message
        });
        await newMessage.save();
        console.log("Message added successfully");
        res.redirect('/shop.html');  // Redirect to a success page or send a success response
    } catch (error) {
        console.log(error);
    }

})









const cartItemSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    }
});

const CartItem = mongoose.model("CartItem", cartItemSchema);
app.post("/add-to-cart", async (req, res) => {
    try {
        const { productName, productPrice, size, quantity } = req.body;
        if (size == "Select Size") {
            return res.status(400).send("Invalid size or quantity");
        }
        const totalPrice = productPrice * quantity;

        const newCartItem = new CartItem({
            productName,
            productPrice,
            size,
            quantity,
            totalPrice
        });

        await newCartItem.save();
        console.log("Item added to cart successfully");
        res.redirect('/cart.html'); // Redirect to a cart page or send a success response
    } catch (error) {
        console.log(error);
        // res.status(500).send("Internal Server Error");
    }
});



app.get("/", (req, res) => {
    res.redirect("signup.html");


});



app.listen(1000, () => {
    console.log("Server connected...");
});

























