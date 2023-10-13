import jwt from 'jsonwebtoken';

const generateToken = (res, userId, statusCode = 200)=>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn:'1d'});
    res
    .status(statusCode)
    .cookie('token', token, {
        httpOnly: true,
        maxAge:1 * 60 * 60 * 24 * 1000,
        sameSite:process.env.NODE_ENV === 'development' ? 'lax': 'none',
        secure:process.env.NODE_ENV === 'development' ?false : true,
    })
};

export default generateToken;