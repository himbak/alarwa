const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, token) => {
    // Configuration d'un compte de test Ethereal (serveur SMTP gratuit de test)
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true pour le port 465, false pour les autres ports
        auth: {
            user: testAccount.user, // utilisateur Ethereal généré
            pass: testAccount.pass, // mot de passe Ethereal généré
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const verificationUrl = `http://localhost:3000/auth/verify?token=${token}`;

    const mailOptions = {
        from: '"Marketplace Parfums" <noreply@parfumluxe.com>', 
        to: email, 
        subject: "Vérification de votre compte - Action Requise", 
        text: `Veuillez vérifier votre compte en cliquant sur ce lien : ${verificationUrl}`, 
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #6366f1;">Bienvenue sur ParfumLuxe !</h2>
                <p>Merci de vous être inscrit sur notre plateforme. Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Vérifier mon compte</a>
                </div>
                <p>Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :</p>
                <p style="color: #6b7280; font-size: 14px;">${verificationUrl}</p>
                <br>
                <p>À très bientôt,<br>L'équipe ParfumLuxe</p>
            </div>
        `,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log("Message de vérification envoyé : %s", info.messageId);
    console.log("-----------------------------------------");
    console.log("URL de prévisualisation de l'email : %s", nodemailer.getTestMessageUrl(info));
    console.log("-----------------------------------------");
};

module.exports = sendVerificationEmail;
