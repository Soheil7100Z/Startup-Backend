const express = require('express')
const {engine} = require('express-handlebars')
const nodemailer = require('nodemailer')
const cors = require('cors');
const PORT = 3000
const products = require('./products.json');

const App = express()

App.engine('handlebars' , engine())
App.set('view engine' , 'handlebars')

App.use(cors({
    origin: 'http://localhost:5000',
    methods: ['GET', 'POST'],
    credentials: true
  }));
App.use(express.json())

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

App.post('/send' ,(req,res) =>{
   const output = `
   <p style="font-size: 1.2rem; font-weight: bold; color: black" >Besucher*in hat Ihr Kontaktformular ausgefüllt:</p>
   <ul>
        <li>Name: ${req.body.anrede} ${req.body.vorname} ${req.body.nachname}</li>
        <li>Email: ${req.body.email}</li>
        <li>Telefonnumer: ${req.body.telefonnummer}</li>
        <li>Postleitzahl: ${req.body.postleitzahl}</li>
        <li>Message: ${req.body.message}</li>
   </ul>
   `;

   const emailTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "000000@gmail.com", // give your gmail
      pass: "*********", //  give app password of your gmail
    },
  });


  async function FromTo() {

    const emailInfo = await emailTransporter.sendMail({
      from: '"your name" <000000@gmail.com>', //give your gmail
      to: "111111@gmail.com", //give your gmail you want to send to
      subject: "Kontaktformular - StartUp Project",
      text: "",
      html: output,
    });

    console.log("Message sent: %s", emailInfo.messageId);

    res.status(200).json({ success: true, message: 'received' })
  }

  FromTo().catch(console.error);
})

App.listen(PORT ,() => console.log('server is working') )
