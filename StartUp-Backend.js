const express = require('express')
const {engine} = require('express-handlebars')
const nodemailer = require('nodemailer')
const cors = require('cors');
const PORT = 3000
const products = require('./products.json');
let comments = require('./comment.json')


const App = express()

App.engine('handlebars' , engine())
App.set('view engine' , 'handlebars')
App.use(express.json())
App.use(cors({
    origin: 'http://localhost:5000',
    methods: ['GET', 'POST'],
    credentials: true
  }));

// Post requests
App.post('/comments-add', (req,res) =>{
  const newComment = req.body
  comments.push(newComment)
})

App.post('/comments-delete', (req,res) => {
  const ID = req.body.id
  if (comments.length > 1) {
    comments = comments.filter(com => com.id!==ID)
  }
  console.log('is working:', ID ,comments.length)
})


// get requests
App.get('/comments', (req,res) =>{
  res.json(comments)
})

App.get('/products', (req, res) => {
  res.json(products);
});

App.get('/products/:id', (req, res) => {
  const { id } = req.params;
  const product = products.find(p => p.id == id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Not Found');
  }
});
// Post request and nodemailer
App.post('/send' ,(req,res) =>{
   const output = `
   <p style="font-size: 1.1rem; font-weight: bold; color: black" >Besucher*in hat Ihr Kontaktformular ausgefüllt:</p>
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
      user: "soheilpro13max@gmail.com",
      pass: "swfg ykyc zcmw zjxj",
    },
  });


  async function FromTo() {
    const emailInfo = await emailTransporter.sendMail({
      from: '"Soheil Zaremehrjardi" <soheilpro13max@gmail.com>',
      to: "soheil7100@gmail.com",
      subject: "Kontaktformular - StartUp Project",
      text: "",
      html: output,
    });

    const emailMe = await emailTransporter.sendMail({
      from: '"StartUp - Soheil Zaremehrjardi" <soheilpro13max@gmail.com>',
      to: `${req.body.email}`,
      subject: "Kontaktformular",
      text: "ٍE-mail Bestätigung",
      html: outputKunde,
    });

    res.status(200).json({ success: true, message: 'received' })
  }

  FromTo().catch(console.error);

})



App.listen(PORT ,() => console.log('server is working') )
