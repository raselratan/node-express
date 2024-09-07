const bcrypt = require('bcrypt');
const User = require('../models/People');

const getUsers = async(req, res, next) => {
    try{
        const users = await User.find();
        res.render("users", {
            users: users
        });
    }catch(e){
        next(e);
    }
}

const addUser = async (req, res, next) => {
    let newUser;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    if(req.files && req.files.length > 0){
        newUser = new User({
            ...req.body,
            avatar: req.files[0].filename,
            password: hashedPassword
        });
    }else{
        newUser = new User({
            ...req.body,
            password: hashedPassword
        });  
    }

    // save the user
    try{
        const result = await newUser.save();
        res.status(200).json({
            message: "User Created Successfully"
        })
    }catch(e){
        res.status(500).json({
            errors: {
                common: {
                    msg: "Unknown Error occured."
                }
            },
        });
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete({
          _id: req.params.id,
        });
    
        // remove user avatar if any
        if (user.avatar) {
          unlink(
            path.join(__dirname, `/../public/uploads/avatars/${user.avatar}`),
            (err) => {
              if (err) console.log(err);
            }
          );
        }
    
        res.status(200).json({
          message: "User was removed successfully!",
        });
      } catch (err) {
        res.status(500).json({
          errors: {
            common: {
              msg: "Could not delete the user!",
            },
          },
        });
      }
}

module.exports = {
    getUsers,
    addUser,
    deleteUser
}