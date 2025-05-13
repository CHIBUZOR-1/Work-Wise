const supabase = require('../db');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { setCookiesWithToken } = require('../Utitz/verifyToken');

const createUser = async (req, res) => {
    try {
        const { email, username, firstname, lastname, phone, password } = req.body;
        if(!firstname || !lastname || !phone || !username || !password || !email) {
            return res.send({ success: false, message: "All fields required"});
        }
        console.log('loh1 - User data received:', { email, username });
        
        // Check if user exists
        const { data: existingUser, error } = await supabase
            .from('Users')
            .select('*')
            .or(`email.eq.${email}, username.eq.${username}`)

        console.log("Existing User Data:", existingUser.length);
        console.log("Query Error:", error);
        if (existingUser.length > 0) {
            return res.json({ ok: false, msg: "User already exists" });
        }
        console.log('loh2')
        if(!validator.isEmail(email)) {
            return res.json({
                ok: false,
                msg: "Enter a valid Email Address"
            })
        }
        if(password.length < 6) {
            return res.json({
                ok: false,
                msg: "Please enter a strong password"
            })
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log('loh2')

        // Insert user into Supabase
        const { data: newUser, error: insertError } = await supabase
            .from('Users')
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
        console.log("New User Data:", newUser);
        console.log("Insert Error:", insertError);

        if (insertError) {
            console.error("❌ Insert Failed:", insertError.message);
            return res.status(500).json({ ok: false, msg: "User registration failed", error: insertError.message });
        }

        res.status(201).json({ ok: true, msg: "Registration successfully", user: newUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const logIn = async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ ok: false, msg: "Email and password are required" });
        }
        const { data: user, error } = await supabase
            .from('Users')
            .select('id, email, password, username, verified, phone, role, image, firstname, lastname')
            .eq('email', email)
            .single();
        
        if (error || !user) {
            return res.json({ ok: false, msg: "Invalid credentials" });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.json({ ok: false, msg: "Invalid credentials" });
        }
        setCookiesWithToken(user.id, user.role, res);
        const details = {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phone: user.phone,
            admin: user.role,
            photo: user.image,
            isVerified: user.verified
        };
        res.status(200).json({
            ok: true,
            msg: "Login successful",
            details
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            error: true,
            msg: "An error occurred!"
        })
    }
}

const getUsersWithTaskCounts = async (req, res) => {
    try {
        // 1. Get all users where role is false (i.e. not admin)
        const { data: users, error: userError } = await supabase
            .from('Users')
            .select('id, firstname, lastname, email, image')
            .eq('role', false); // or `.not('role', 'is', true)` if 'role' might be null

        if (userError) {
            console.error(userError);
            return res.status(500).json({ ok: false, message: "Failed to fetch users" });
        }

        // 2. Get all task_assignments and related task info
        const { data: assignments, error: taskError } = await supabase
            .from('task_assignments')
            .select(`
                user_id,
                tasks (
                    id,
                    status
                )
            `);

        if (taskError) {
            console.error(taskError);
            return res.status(500).json({ ok: false, message: "Failed to fetch task assignments" });
        }

        // 3. Aggregate tasks by user and status
        const taskMap = {};
        for (const assign of assignments) {
            const userId = assign.user_id;
            const status = assign.tasks?.status;

            if (!status) continue;

            if (!taskMap[userId]) {
                taskMap[userId] = {
                    pending: 0,
                    inProgress: 0,
                    completed: 0
                };
            }

            if (status === 'Pending') taskMap[userId].pending++;
            else if (status === 'In Progress') taskMap[userId].inProgress++;
            else if (status === 'Completed') taskMap[userId].completed++;
        }

        // 4. Merge task counts into users
        const result = users.map(user => ({
            ...user,
            taskCounts: taskMap[user.id] || {
                pending: 0,
                inProgress: 0,
                completed: 0
            }
        }));

        return res.status(200).json({ ok: true, users: result });

    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: "Server Error" });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ ok: false, message: "User ID is required" });
        }

        const { data: user, error } = await supabase
            .from('Users')
            .select('id, firstname, lastname, email, image, role')
            .eq('id', id)
            .single();

        if (error || !user) {
            return res.status(404).json({ ok: false, message: "User not found" });
        }

        res.status(200).json({ ok: true, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: "Server Error" });
    }
};
const updateUser = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { firstname, lastname, email, phone, image, image_id } = req.body;
  
      if (!userId) {
        return res.status(400).json({ ok: false, message: "User ID is required" });
      }
  
      const fieldsToUpdate = {
        ...(firstname && { firstname }),
        ...(lastname && { lastname }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(image && { image }),
        ...(image_id && { image_id }),
      };
  
      if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ ok: false, message: "No valid fields to update" });
      }
  
      const { error } = await supabase
        .from('Users')
        .update(fieldsToUpdate)
        .eq('id', userId);
  
      if (error) {
        console.error(error);
        return res.status(500).json({ ok: false, message: "Failed to update user" });
      }
      // Fetch the updated user
    const { data: updatedUser, error: fetchError } = await supabase
        .from('Users')
        .select('id, firstname, lastname, email, phone, image')
        .eq('id', userId)
        .single();
    console.log(updatedUser)
    if (fetchError) {
        console.error(fetchError);
        return res.status(500).json({ ok: false, message: "Failed to fetch updated user" });
    }
  
      res.status(200).json({ ok: true, message: "User updated successfully", updatedUser });
  
    } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({ ok: false, message: "Server error" });
    }
  };
  const forgotPassword = async(req, res) => {
    try {
        const { email, secret, newPassword } = req.body;
        if(!email) {
            return res.send({error: "email required"});
        }
        if(!secret) {
            return res.send({error: "answer required"});
        }
        if(!newPassword || newPassword.length < 6) {
            return res.send({error: "Password required"});
        }
        const { data: user, error } = await supabase
            .from('Users')
            .select('id, email, secret')
            .eq('email', email)
            .single();
        console.log('l')
        if (error || !user) {
            return res.status(404).json({ ok:false, msg: "User not found" });
        }
        console.log('l1')
        console.log(user, secret)

        // 2. Verify secret
        if (user.secret !== secret) {
            return res.status(403).json({ error: "Invalid secret answer" });
        }
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(newPassword, `${salt}`);

        // 4. Update password
        const { error: updateError } = await supabase
            .from('Users')
            .update({ password: hashedPassword })
            .eq('id', user.id);

        if (updateError) {
            return res.status(500).json({ error: "Failed to update password" });
        }
        res.status(200).json({ ok: true, msg: "Password reset successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            error: true,
            msg: "Something went wrong!"
        })
    }
  }
  


const logout = async(req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0});
        res.status(200).json({
            ok: true,
            msg: "Logged Out successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: true,
            ok: false,
            msg: "An error occured!"
        })
    }
}


module.exports = { createUser, logIn, getUsersWithTaskCounts, getUserById, updateUser, forgotPassword, logout }