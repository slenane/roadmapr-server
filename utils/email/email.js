const { EN, ES, PT, LOGO } = require("./emailConfig");

// const defaultMail = {
//   to: "",
//   from: "",
//   subject: "",
//   text: "",
//   html: "",
// };

const getVerificationEmail = (userEmail, verificationLink, language) => {
  let verificationEmail = EN.verificationEmail;
  if (language === "es") verificationEmail = ES.verificationEmail;
  if (language === "pt") verificationEmail = PT.verificationEmail;

  return {
    to: userEmail,
    from: process.env.EMAIL_ADDRESS,
    subject: verificationEmail.subject,
    text: `
    ${verificationEmail.text.p1}
    
    ${verificationLink}

    ${verificationEmail.text.p2}
    `,
    html: `
    <html>
    <head>
      <style>
        body {
          font-family: Mona Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
          color: black;
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
  };
};

const getPasswordResetEmail = (userEmail, verificationLink, language) => {
  let resetPassword = EN.resetPassword;
  if (language === "es") resetPassword = ES.resetPassword;
  if (language === "pt") resetPassword = PT.resetPassword;

  return {
    to: userEmail,
    from: process.env.EMAIL_ADDRESS,
    subject: resetPassword.subject,
    text: `
    ${resetPassword.text.p1}
    
    ${verificationLink}

    ${resetPassword.text.p2}
    `,
    html: `
    <html>
          <head>
            <style>
              body {
                font-family: Mona Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
                color: black;
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
  };
};

const getEmailUpdateVerification = (userEmail, verificationLink, language) => {
  console.log(language);
  let emailUpdate = EN.emailUpdate;
  if (language === "es") emailUpdate = ES.emailUpdate;
  if (language === "pt") emailUpdate = PT.emailUpdate;

  return {
    to: userEmail,
    from: process.env.EMAIL_ADDRESS,
    subject: emailUpdate.subject,
    text: `
    ${emailUpdate.text.p1}
    
    ${verificationLink}

    ${emailUpdate.text.p2}
    `,
    html: `
    <html>
    <head>
      <style>
        body {
          font-family: Mona Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
          color: black;
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
  };
};

module.exports = {
  getVerificationEmail,
  getPasswordResetEmail,
  getEmailUpdateVerification,
};
