const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
const { name, email, password } = req.body;
if (!name || !email || !password) {
    return res.status(400).json({ message: 'enter all data' });        


}
const foundUser = await User.findOne({ email }).exec();
if (foundUser) {
    return res.status(409).json({ message: 'email already exists' });   
}

const hashedPassword = await bcrypt.hash(password, 10);

const user = await User.create({
    name,
    email,
    password: hashedPassword,
});
const accessToken = jwt.sign(
    {
        userInfo: {
            id:user._id,
          
        },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
);
const refreshToken = jwt.sign(
    {
        userInfo: {
            id:user._id,
        },
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
);
res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000,
});

res.json({ accessToken ,
    email:user.email,
    name:user.name,
});

};
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'enter all data' });        
    }
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) {
        return res.status(401).json({ message: 'email does not exist' });   

    }
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
        return res.status(401).json({ message: 'incorrect password' });   
    }
    const accessToken = jwt.sign(
        {
            userInfo: {
                id:foundUser._id,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
        {
            userInfo: { 
                id:foundUser._id,
            },
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken ,
        email:foundUser.email,
        name:foundUser.name,
    });




}
const refresh = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.status(401).json({ message: 'no refresh token' });
    
    }
    const refreshToken = cookies.jwt;
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err) 
                return res.status(403).json({ message: 'invalid refresh token' });
            
                const foundUser = User.findById({ _id: decoded.userInfo.id }).exec();
                if (!foundUser) {
                    return res.status(401).json({ message: 'user not found' });
                }
                const  accessToken = jwt.sign(
                    {
                        userInfo: {
                            id:foundUser._id,
                        },
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '15m' }
                );
                res.json({ accessToken });

            
        }
    );
}
const logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.status(204).json({ message: 'no content' });
    }
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.json({ message: 'cookie cleared' });
    res.json({ message: 'logged out' });
}



module.exports = { register, login, refresh, logout };