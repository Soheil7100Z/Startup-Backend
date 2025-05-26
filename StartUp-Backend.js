require('dotenv').config();
const express = require('express')
const app = express()
const {engine} = require('express-handlebars')
const nodemailer = require('nodemailer')
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const products = require('./products.json');
let comments = require('./comment.json');


app.engine('handlebars' , engine())
app.set('view engine' , 'handlebars')
app.use(express.json())

app.use(cors({
    origin: [
      'http://localhost:5000',
      'https://frontend-startup-henna.vercel.app'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }));

// Post requests
app.post('/comments-add', (req,res) =>{
  const newComment = req.body
  comments.push(newComment)
})

app.post('/comments-delete', (req,res) => {
  const ID = req.body.id
  if (comments.length > 1) {
    comments = comments.filter(com => com.id!==ID)
  }
  console.log('is working:', ID ,comments.length)
})


app.get('/', (req, res) => {
  res.send('Backend is working');
});

app.get('/comments', (req,res) =>{
  res.json(comments)
})

app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  const product = products.find(p => p.id == id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Not Found');
  }
});
// Post request and nodemailer
app.post('/send' ,(req,res) =>{
   const output = `
   <p style="font-size: 1rem; font-weight: bold; color: black" >Besucher*in hat Ihr Kontaktformular ausgefüllt:</p>
   <ul>
        <li>Name: ${req.body.anrede} ${req.body.vorname} ${req.body.nachname}</li>
        <li>Email: ${req.body.email}</li>
        <li>Telefonnumer: ${req.body.telefonnummer}</li>
        <li>Postleitzahl: ${req.body.postleitzahl}</li>
        <li>Message: ${req.body.message}</li>
   </ul>
   `;

   const outputKunde = `
   <p style="font-size: 1rem; color: black" >
   Sehr geehrte/r ${req.body.anrede} ${req.body.vorname} ${req.body.nachname} <br/>
   Vielen Dank! Ihre Anfrage wurde erfolgreich übermittelt. Unser Team wird sich zeitnah bei Ihnen melden.<br/>
   Mit Freundlichen GrüPßen
   </p>
   `;

   const emailTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS
    },
  });

  async function FromTo() {
    const emailInfo = await emailTransporter.sendMail({
      from: `"Soheil Zaremehrjardi" <${process.env.EMAIL}>`,
      to: "soheil7100@gmail.com",
      subject: "Kontaktformular - StartUp Project",
      text: "",
      html: output,
    });

    const emailMe = await emailTransporter.sendMail({
      from: `"StartUp - Soheil Zaremehrjardi" <${process.env.EMAIL}>`,
      to: `${req.body.email}`,
      subject: "Kontaktformular",
      text: "ٍE-mail Bestätigung",
      html: outputKunde,
    });

    res.status(200).json({ success: true, message: 'received' })
  }

  FromTo().catch(console.error);

})

app.listen(PORT ,() => console.log(`server is working ${PORT}`) )
