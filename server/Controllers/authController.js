const supabase = require('../db');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
    try {
        const { email, username, firstname, lastname, phone, password, image } = req.body;
        if(!firstname || !lastname || !phoneNumber || !email || !password || !passPhrase) {
            return res.send({ success: false, message: "All fields required"});
        }
        // Check if user exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .or(`email.eq.${email},username.eq.${username}`)
            .single();

        if (existingUser) {
            return res.json({ error: "User already exists" });
        }
        if(!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Enter a valid Email Address"
            })
        }
        if(password.length < 6) {
            return res.json({
                success: false,
                message: "Please enter a strong password"
            })
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user into Supabase
        const { data, error } = await supabase
            .from('users')
            .insert([{
                email,
                username,
                firstname,
                lastname,
                phone,
                password: hashedPassword,
                verified: true
            }])
            .select('*');

        if (error) throw error;

        res.status(201).json({ message: "User created successfully", user: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createUser }