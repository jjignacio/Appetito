  import { nodemailer } from '../../node_modules/nodemailer';
  
  // create reusable transporter object using the default SMTP transport
  export const transporter = nodemailer.createTransport({
    host: "Gmail",
    port: 25,
    //secure: true, // true for 465, false for other ports
    auth: {
      user: 'securesally@gmail.com', // generated ethereal user
      pass: 'biyqhyhxpcypdqah', // generated ethereal password
    },
  });

/*transporter.verify().then ( (=> {
      console.log("Ready for send mail");
  }))*/