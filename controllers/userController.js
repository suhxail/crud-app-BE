const User = require('../models/schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');

const SECRET_KEY = config.SECRET_KEY;

const userController = {
    signup: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(409).json({ message: "User already exists" })
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                name,
                email,
                password: hashedPassword,
            })

            await newUser.save();
            res.status(201).json({ message: 'User created successfully' })
        } catch (error) {
            console.error('Error signing up user', error);
            res.status(500).json({ message: 'Internal server error' })
        }
    },

    getUserList: async (req, res) => {
        try {
            const userList = await User.find({}, 'name email');
            res.json(userList);
        } catch (error) {
            console.error('Error getting userList', error);
            res.status(500).json({ message: 'Internal server error while fetching all the users' })
        }
    },

    signin: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(401).json({ message: "Authentcation failed while signing in" })
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ message: 'Incorrect password', status: 0 })
            }

            const token = jwt.sign({ userId: user._id }, config.SECRET_KEY, { expiresIn: '1h' })
            res.json({ token })
        } catch (error) {
            console.error('Error signing in user', error);
            res.status(500).json({ message: 'Inrernal server error while signing in' })
        }
    },

    getProfile: async (req, res) => {
        try {
            const userId = req.userId;
            const user = await User.findById(userId, 'name email');
            res.json(user);
            console.log(user, "user")
        } catch (error) {
            res.status(500).json({ message: 'Internal server error while getting user profile' })
        }
    },   

    editProfile: async (req, res) => {
        try {
            const userId = req.userId;
            const { name, email } = req.body;           

            if (!name && !email) {
                return res.status(400).json({ message: "Name and email cannot be empty" })
            }
            // else if (!name) {
            //     const user = await User.findByIdAndUpdate(
            //         userId,

            //         { email, updatedAt: Date.now() },
            //         { new: true }
            //     )
            // } else if (!email) {
            //     const user = await User.findByIdAndUpdate(
            //         userId,

            //         { name, updatedAt: Date.now() },
            //         { new: true }
            //     )
            // } else {
            //     const user = await User.findByIdAndUpdate(
            //         userId,
            //         { name, email, updatedAt: Date.now() },
            //         { new: true }
            //     )
            // }

            const user = await User.findByIdAndUpdate(
                userId,
                { name, email, updatedAt: Date.now() },
                { new: true }
            )
            res.json({ message: 'Profile updated successfully' });
        } catch (error) {
            console.error('Error updating user profile', error);
            res.status(500).json({ message: 'Internal server error while updating user profile' })
        }
    },

    deleteProfile: async (req, res) => {
        try {
            const userId = req.userId;
            await User.findByIdAndDelete(userId);
            res.json({ message: 'Profile deleted successfully' });
        } catch (error) {
            console.error('Error deleting user profile');
            res.status(500).json({ message: 'Interna;l server error while deleting user profile' })
        }
    }
}

module.exports = userController;
