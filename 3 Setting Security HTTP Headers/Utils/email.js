const nodemailer=require('nodemailer')

//In option we include toemail address,fromemailaddress,body of email
const sendEmail=async (option)=>{
    //CREATE A TRANSPORTER  Node JS doesnt send email transporter sends it for example gmail
    const transporter =nodemailer.createTransporter({
        host: process.env.EMAIL.HOST,            //Like Gmail
        port: process.env.EMAIL.PORT,
        auth: {
            //this username and password is for using this servive process.env.EMAIL_USER sandbox.smtp.mailtrap.io
            user: process.env.EMAIL_USER,           
            pass: process.env.EMAIL_PASSWORD
        }
    })

    //DEFINE EMAIL OPTIONS
    const emailOptions = {
    from: 'Cineflix support<support@cineflix.com>',
    to: option.email, 
    subject: option.subject,
    text: option.message
    }
    await transporter.sendEmail(emailOptions)
}

module.exports=sendEmail