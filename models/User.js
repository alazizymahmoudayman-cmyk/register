const mongoose = require('mongoose');
const { route } = require('../routes/usersRoutes');
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true, 
    },
        email: {
            type: String,
            required: true, 
    },
    password: {
        type: String,
        required: true, 
    },
    role:
    {
        type: String,
        default: 'User', 
    },
   
},
 { timestamps: true, });


 
module.exports = mongoose.model('User', userSchema);