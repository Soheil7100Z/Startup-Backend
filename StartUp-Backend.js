const express = require('express')
const {engine} = require('express-handlebars')
const nodemailer = require('nodemailer')
const cors = require('cors');
const PORT = 3000

const emailingApp = express()

emailingApp.engine('handlebars' , engine())
emailingApp.set('view engine' , 'handlebars')


emailingApp.use(cors({
    origin: 'http://localhost:5000',
    methods: ['GET', 'POST'],
    credentials: true
  }));
emailingApp.use(express.json())


emailingApp.post('/send' ,(req,res) =>{
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
      user: "", // give your gmail
      pass: "", //  give app password of your gmail
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

    console.log("Message sent: %s", emailInfo.messageId);

    res.status(200).json({ success: true, message: 'received' })
  }

  FromTo().catch(console.error);
})

emailingApp.listen(PORT ,() => console.log('server is working') )
