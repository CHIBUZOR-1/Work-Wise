const jwt = require('jsonwebtoken');
const supabase = require('../db');

const setCookiesWithToken = (userId, rolez, res) => {
    const token = jwt.sign({ userId, rolez }, process.env.JWTSECRET, {expiresIn: "1d"});

    res.cookie('jwt', token, {
        maxAge: 1*24*60*60*1000,
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
    });
};


const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token) {
            return res.status(401).json({
                error: true,
                message: "Unauthorized Access"
            })
        }
        const decode = jwt.verify(token, process.env.JWTSECRET);
        if(!decode) {
            return res.status(401).json({
                error: true,
                message: "Invalid Token"
            })
        }
        req.user = decode;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: true,
            message: "An error occured!"
        })
    }
    

}

 

const isAdminz = async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('Users') // Table name in Supabase
            .select('role') // Select only the `role` field
            .eq('id', req.user.userId) // Find user by ID
            .single(); // Expect one result

        if (error) throw error; // Handle errors
        
        if (!data || !data.role) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        next();
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "middleware error"
        })
    }
}

module.exports = { verifyToken, isAdminz, setCookiesWithToken };