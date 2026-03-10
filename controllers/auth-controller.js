import User from "../models/User.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// Register controller 
const registerUser = async (req,res) => {
    try {
        // Extract user information from our request body
        const {username, email, password,role} = req.body;

        // check if the user is already exists in our database
        const checkExistingUser = await User.findOne({$or : [{username},{email}]});
        if(checkExistingUser){
            return res.status(400).json({
                success : false,
                message : "User is already exists either with same username or same email. Please with different Creds"
            })
        }

        // Hash the userpassword
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        // Create a new user and save in your database
        const newlyCreatedUser = new User({
            username,
            email,
            password : hashedPassword,
            role : role || 'user'
        })
        await newlyCreatedUser.save();

        if(newlyCreatedUser){
            res.status(201).json({
                success : true,
                message : 'User registered Successfulyy'
            })
        }
        else{
            res.status(400).json({
                success : false,
                message : 'Unable to register User! Please try again'
            })    
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Some error occured! Please try again"
        })
    }
}

// login controller 
const loginUser = async (req,res) => {
 try {
    const {username, password} =  req.body;

    // Find if the current user exist or not in db
    const user = await User.findOne({username});

    if(!user){
        return res.status(400).json({
            success : false,
            message : "Invalid Credentails!"
        });
    }

    // If the password is correct or not 
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if(!isPasswordMatch){
        return res.status(400).json({
            success : false,
            message : "User doesn't exist!"
        });
    }

    // create user token - jwt
    const accessToken = jwt.sign({
        userId   : user._id,
        username : user.username,
        role : user.role,
    },process.env.JWT_SECRET_KEY, {
        expiresIn : '15m'
    });

    res.status(200).json({
        success : true,
        message : 'Logged in successful',
        accessToken
    })
    
 } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Some error occured! Please try again"
        })
    }
}

// Password Controller
const changePassword = async (req,res) => {
    try {
       const userId = req.userInfo.userId;

       // Extract the old and new password
       const {oldPassword, newPassword} = req.body; 

       // find the current loggedin user
       const user = await User.findById(userId);

       if(!user){
        return res.status(400).json({
            success : false,
            message : "User not found"
        });
      }

       // Check if the old password is correct
       const isPasswordMatch = await bcrypt.compare(oldPassword, user.password)

       if(!isPasswordMatch){
        return res.status(400).json({
            success : false,
            message : 'Old Password is not correct! Please try again.'
        })
       }

       // hash the new password
       const salt = await bcrypt.genSalt(10);
       const newHashedPassword = await bcrypt.hash(newPassword,salt);

       // update the userpassword
       user.password = newHashedPassword;
       await user.save();

       res.status(200).json({
        success : true,
        message : "Password updated successfully"
       })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Some error occured! Please try again"
        })
    }
}

export {registerUser, loginUser, changePassword}