const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
// Replace 'localhost' and 'shipspace' with your MongoDB server's hostname and your database name
const mongoURI = 'mongodb://localhost:27017/shipspace';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Register user
app.post('/register', async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName: first_name,
            lastName: last_name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.redirect('/login.html');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
});

// Login user
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid email or password');
        }

        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Error logging in');
    }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Dashboard route
app.use('/dashboard', require('./routes/dashboard'));

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/profile.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'profile.html'));
});
app.get('/table.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'table.html'));
});
app.get('/payment.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'payment.html'));
});
app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});
app.get('/forgot-password.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'forgot-password.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
