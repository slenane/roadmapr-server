const config = require("../config");

const defaultMail = {
  Destination: {
    /* required */
    CcAddresses: [
      "EMAIL_ADDRESS",
      /* more items */
    ],
    ToAddresses: [
      "EMAIL_ADDRESS",
      /* more items */
    ],
  },
  Message: {
    /* required */
    Body: {
      /* required */
      Html: {
        Charset: "UTF-8",
        Data: "HTML_FORMAT_BODY",
      },
      Text: {
        Charset: "UTF-8",
        Data: "TEXT_FORMAT_BODY",
      },
    },
    Subject: {
      Charset: "UTF-8",
      Data: "Test email",
    },
  },
  Source: "SENDER_EMAIL_ADDRESS" /* required */,
  ReplyToAddresses: [
    "EMAIL_ADDRESS",
    /* more items */
  ],
};

const getVerificationEmail = (userEmail, verificationLink) => {
  return {
    Destination: {
      ToAddresses: [userEmail],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
          <html>
          <head>
            <style>
              body {
                font-family: Mona Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
                color: black;
              }
        
              .logo {
                height: 50px;
              }
              
              main {
                margin-bottom: 24px;
              }
        
              .verify-button {
                background: #3f51b5;
                color: white;
                padding: 12px;
                border-radius: 4px;
                border: none;
                outline: none;
                cursor: pointer;
              }
            </style>
          </head>
          <body>
            <header>
                <img
                  src="https://roadmapr-s3-bucket.s3.eu-north-1.amazonaws.com/logo.png"
                  class="logo"
                  alt="logo"
                />
            
                <h1>Welcome to roadmapr</h1>
            </header> 
        
            <main>
                <p>Thank you for registering with roadmapr, where you can create your own personal roadmap to a career in software development.</p>
        
                <p>Click the button below to verify your email address.</p>
            
                <a href="${verificationLink}">
                  <button class="verify-button">Verify Email</button>
                </a>
        
                <p>If this wasn't you, please ignore this email.</p>
            </main>
        
            <footer>
                <small>Registered trademark</small>
        
            </foot>
          </body>
        </html>
              `,
        },
        Text: {
          Charset: "UTF-8",
          Data: `
              Welcome to roadmapr
              Thank you for registering with roadmapr, where you can create your own personal roadmap to a career in software development.
              Please copy and paste the text below to your browser to verify your email address.
              
              ${verificationLink}

              If this wasn't you, please ignore this email.
              
              Registered trademark
              `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Welcome to roadmapr - Verify your email address",
      },
    },
    Source: config.EMAIL_ADDRESS,
  };
};

module.exports = {
  getVerificationEmail,
};
