const path = require('path');
const express = require('express');
const nodemailer = require('nodemailer');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const teamMembers = [
  { name: 'Zaher Yaqub', role: 'Founder', bio: 'Founder of Faseelah Team.'},
  { name: 'Abedalla Sbeata', role: 'Backend Developer', bio: 'Builds reliable and secure backend services.'},
  { name: 'Hala Farahat', role: 'Tester', bio: 'Ensures quality through thorough testing.'},
  { name: 'Logain Hamdan', role: 'Flutter Developer', bio: 'Creates smooth cross-platform mobile apps.'},
  { name: 'Banan Hamdan', role: 'UX/UI Designer', bio: 'Designs friendly and clean user experiences.'},
  
];

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: String(process.env.SMTP_SECURE) !== 'false', 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.get('/', (req, res) => {
  res.render('pages/index', { title: 'Faseelah Team', active: 'home' });
});

app.get('/team', (req, res) => {
  res.render('pages/team', { title: 'Our Team', active: 'team', teamMembers });
});

app.get('/contact', (req, res) => {
  res.render('pages/contact', { title: 'Contact Us', active: 'contact', sent: null, error: null });
});

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: `"Faseelah Website" <${process.env.SMTP_USER}>`,
    to: process.env.TO_EMAIL || process.env.SMTP_USER,
    subject: `New message from ${name} via Faseelah site`,
    replyTo: email,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.render('pages/contact', { title: 'Contact Us', active: 'contact', sent: true, error: null });
  } catch (err) {
    console.error('Email send error:', err);
    res.render('pages/contact', { title: 'Contact Us', active: 'contact', sent: false, error: 'Failed to send. Please try again later.' });
  }
});

app.use((req, res) => {
  res.status(404).render('pages/index', { title: 'Faseelah Team', active: 'home' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
