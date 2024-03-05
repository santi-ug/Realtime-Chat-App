import jwt from 'jsonwebtoken';

const generateToken = (userId, res) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "5m" });
    
    res.cookie("jwt", token, {
        maxAge: 5 * 60 * 1000, // miliseconds, 5 minutes
        httpOnly: true, // prevents XSS attacks cross-site scripting attacks
        sameSite: "strict" // CSRF attacks cross-site request forgery
    })
}

export default generateToken;