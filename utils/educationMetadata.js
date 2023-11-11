const AMAZON = "amazon",
  UDEMY = "udemy",
  FREE_CODE_CAMP = "freecodecamp",
  YOUTUBE = "youtube",
  EDX = "edx",
  COURSERA = "coursera",
  PLURALSIGHT = "pluralsight",
  CODECADEMY = "codecademy",
  KHAN_ACADEMY = "khanacademy";

const AMAZON_TITLE_REGEX = /\/([^\/]+)\/dp\/\d+/,
  UDEMY_TITLE_REGEX = /\/([^\/]+)\/(?:\?|$)/,
  FREE_CODE_CAMP_TITLE_REGEX = /\/([^\/]+)\/(?=\?|$)/,
  YOUTUBE_TITLE_REGEX = /[?&]v=([^&]+)/,
  EDX_TITLE_REGEX = /\/([^\/?]+)(?:\?.*)?\/?$/,
  COURSERA_TITLE_REGEX = /\/([^\/?]+)(?:\?.*)?\/?$/,
  PLURALSIGHT_TITLE_REGEX = /\/([^\/?]+)(?:\?.*)?\/?$/,
  CODECADEMY_TITLE_REGEX = /\/learn\/([^\/]+)/,
  KHAN_ACADEMY_TITLE_REGEX = /\/([^\/?]+)(?:\?.*)?\/?$/;

const AMAZON_ISBN_REGEX = /dp\/(\d+)/;

const providerRegex = {
  amazon: AMAZON,
  udemy: UDEMY,
  freecodecamp: FREE_CODE_CAMP,
  youtube: YOUTUBE,
  edx: EDX,
  coursera: COURSERA,
  pluralsight: PLURALSIGHT,
  codecademy: CODECADEMY,
  khanacademy: KHAN_ACADEMY,
};

const titleRegex = {
  amazon: AMAZON_TITLE_REGEX,
  udemy: UDEMY_TITLE_REGEX,
  freecodecamp: FREE_CODE_CAMP_TITLE_REGEX,
  youtube: YOUTUBE_TITLE_REGEX,
  edx: EDX_TITLE_REGEX,
  coursera: COURSERA_TITLE_REGEX,
  pluralsight: PLURALSIGHT_TITLE_REGEX,
  codecademy: CODECADEMY_TITLE_REGEX,
  khanacademy: KHAN_ACADEMY_TITLE_REGEX,
};

const isbnRegex = {
  amazon: AMAZON_ISBN_REGEX,
};

const generateEducationItemMetadata = (link) => {
  let provider, title, isbn;

  for (const regex in providerRegex) {
    if (new RegExp(providerRegex[regex]).test(link)) {
      provider = providerRegex[regex];
      break;
    }
  }
  if (provider) {
    const match = link.match(titleRegex[provider]);
    if (match) title = match[1];
  }
  if (provider === AMAZON) {
    const match = link.match(isbnRegex[provider]);
    if (match) isbn = match[1];
  }

  return {
    provider,
    title,
    ...(isbn ? { isbn } : {}),
  };
};

const hasMetadata = (item) => {
  if (!item) return false;
  if (!item.provider || !item.provider.length) return false;
  else if (!item.title || !item.title.length) return false;
  else return true;
};

const metadataUpdateRequired = (initialValue, newValue) => {
  if (initialValue.provider !== newValue.provider) return true;
  else if (initialValue.title !== newValue.title) return true;
  else return false;
};

module.exports = {
  generateEducationItemMetadata,
  hasMetadata,
  metadataUpdateRequired,
};

// // AMAZON
// https://www.amazon.it/Eloquent-Javascript-Modern-Introduction-Programming/dp/1593279507/ref=asc_df_1593279507/
// https://www.amazon.it/Modern-Software-Engineering-Discipline-Development/dp/0137314914/ref=asc_df_0137314914/
// // UDEMY
// https://www.udemy.com/course/the-complete-web-development-bootcamp/
// // FCC
// https://www.freecodecamp.org/learn/2022/responsive-web-design/
// // YOUTUBE
// https://www.youtube.com/watch?v=9Y3yaoi9rUQ&ab_channel=freeCodeCamp.org
// // EDX
// https://www.edx.org/learn/computer-science/harvard-university-cs50-s-introduction-to-computer-science
// // COURSERA
// https://www.coursera.org/professional-certificates/ibm-full-stack-cloud-developer
// // PLURALSIGHT
// https://www.pluralsight.com/courses/working-databases-php
// // CODECDEMY
// https://www.codecademy.com/learn/learn-python-3
// // KHAN
// https://www.khanacademy.org/computing/computer-programming/html-css
