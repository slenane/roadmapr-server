const config = require("../../config");
const { EN, ES, PT } = require("./emailConfig");

const API_VERSION = { apiVersion: "2010-12-01" };

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

const getVerificationEmail = (userEmail, verificationLink, language) => {
  let verificationEmail = EN.verificationEmail;
  if (language === "es") verificationEmail = ES.verificationEmail;
  if (language === "pt") verificationEmail = PT.verificationEmail;

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
            
                <h1>${verificationEmail.html.header}</h1>
            </header> 
        
            <main>
                <p>${verificationEmail.html.main.p1}</p>
        
                <p>${verificationEmail.html.main.p2}</p>
            
                <a href="${verificationLink}">
                  <button class="verify-button">${verificationEmail.html.main.button}</button>
                </a>
        
                <p>${verificationEmail.html.main.p3}</p>
            </main>
        
            <footer>
                <small>${verificationEmail.html.footer}</small>
            </footer>
          </body>
        </html>
              `,
        },
        Text: {
          Charset: "UTF-8",
          Data: `
              ${verificationEmail.text.p1}
              
              ${verificationLink}

              ${verificationEmail.text.p2}
              `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: verificationEmail.subject,
      },
    },
    Source: config.EMAIL_ADDRESS,
  };
};

const getPasswordResetEmail = (userEmail, verificationLink, language) => {
  let resetPassword = EN.resetPassword;
  if (language === "es") resetPassword = ES.resetPassword;
  if (language === "pt") resetPassword = PT.resetPassword;

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
            
                <h1>${resetPassword.html.header}</h1>
            </header> 
        
            <main>
                <p>${resetPassword.html.main.p1}</p>
        
                <p>${resetPassword.html.main.p2}</p>
            
                <a href="${verificationLink}">
                  <button class="verify-button">${resetPassword.html.main.button}</button>
                </a>
        
                <p>${resetPassword.html.main.p3}</p>
            </main>
        
            <footer>
                <small>${resetPassword.html.footer}</small>
        
            </foot>
          </body>
        </html>
              `,
        },
        Text: {
          Charset: "UTF-8",
          Data: `
            ${resetPassword.text.p1}
            
            ${verificationLink}

            ${resetPassword.text.p2}
            `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: resetPassword.subject,
      },
    },
    Source: config.EMAIL_ADDRESS,
  };
};

const getEmailUpdateVerification = (userEmail, verificationLink, language) => {
  console.log(language);
  let emailUpdate = EN.emailUpdate;
  if (language === "es") emailUpdate = ES.emailUpdate;
  if (language === "pt") emailUpdate = PT.emailUpdate;

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
            
                <h1>${emailUpdate.html.header}</h1>
            </header> 
        
            <main>
                <p>${emailUpdate.html.main.p1}</p>
        
                <p>${emailUpdate.html.main.p2}</p>
            
                <a href="${verificationLink}">
                  <button class="verify-button">${emailUpdate.html.main.button}</button>
                </a>
        
                <p>${emailUpdate.html.main.p3}</p>
            </main>
        
            <footer>
                <small>${emailUpdate.html.footer}</small>
        
            </foot>
          </body>
        </html>
              `,
        },
        Text: {
          Charset: "UTF-8",
          Data: `
              ${emailUpdate.text.p1}
              
              ${verificationLink}

              ${emailUpdate.text.p2}
              `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: emailUpdate.subject,
      },
    },
    Source: config.EMAIL_ADDRESS,
  };
};

module.exports = {
  API_VERSION,
  getVerificationEmail,
  getPasswordResetEmail,
  getEmailUpdateVerification,
};
