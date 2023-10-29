// const cheerio = require("cheerio");
// const axios = require("axios");
// const STACK_LIST = require("./stack.js");
// const EDUCATION_TYPES = [
//   "Book",
//   "Books",
//   "Course",
//   "Courses",
// ];

// const parseDescriptionForStack = (text) => {
//   const stack = [];

//   for (const tech of STACK_LIST) {
//     let title = tech.title,
//       name = tech.name;
//     if (title.includes("+")) title = title.replaceAll("+", "\\+");
//     if (
//       text.toLowerCase().match(new RegExp(`\\b(${title.toLowerCase()})\\b`)) ||
//       text.toLowerCase().match(new RegExp(`\\b(${name.toLowerCase()})\\b`))
//     ) {
//       stack.push(tech);
//     }
//   }

//   return stack;
// };

// const getEducationType = (text) => {
//   let type;

//   for (let option of EDUCATION_TYPES) {
//     if (
//       text.toLowerCase().match(new RegExp(`\\b(${option.toLowerCase()})\\b`))
//     ) {
//       if (option[option.length - 1] === "s") option = option.slice(0, -1);
//       type = option.toLowerCase();
//       continue;
//     }
//   }

//   return type;
// };

// const getAmazonProductDetails = async (link) => {
//   try {
//     const response = await axios.get(link, {
//       headers: {
//         // Accept: "application/json, text/plain, */*",
//         Host: "www.amazon.com",
//         Pragma: "no-cache",
//         "User-Agent":
//           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
//       },
//     });
//     const $ = cheerio.load(response.data);
//     const item = $("div#centerCol");
//     const breadcrumbs = $("div#wayfinding-breadcrumbs_feature_div");
//     const product = {};

//     product["title"] = item.find("span#productTitle").text().trim();
//     product["description"] = item
//       .find("div#bookDescription_feature_div")
//       .replaceAll("Read more", "")
//       .replaceAll("Read less", "")
//       .trim();
//     product["stack"] = parseDescriptionForStack(product["description"]);
//     product["author"] = item.find("span.author>.a-link-normal").text().trim();
//     product["publisher"] = item
//       .find(
//         "div#rpi-attribute-book_details-publisher>.rpi-attribute-value>span"
//       )
//       .text()
//       .trim();
//     product["link"] = link;

//     const foundType = getEducationType(breadcrumbs.find("ul>li>span>a").text());
//     product["type"] = foundType ? foundType : "book";

//     return product;
//   } catch (error) {
//     throw error;
//   }
// };

// const getUdemyProductDetails = async (link) => {
//   const response = await axios.get(link, {
//     headers: {
//       Accept: "application/json, text/plain",
//       Host: "www.udemy.com",
//       Pragma: "no-cache",
//       "User-Agent":
//         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
//     },
//   });

//   console.log(response);

//   // const $ = cheerio.load(response.data);
//   // console.log($.units);

//   // const item = $("div.paid-course-landing-page__container");
//   const product = {};

//   // product["title"] = item.find("h1.clp-lead__title").text().trim();
//   // product["description"] = item.find("div.clp-lead__headline").trim();

//   // const content = [];
//   // const whatYouWillLearn = item.find(
//   //   "what-you-will-learn--objectives-list--eiLce"
//   // );
//   // whatYouWillLearn.each((idx, cur) => {
//   //   content.push(cur.find("div.ud-block-list-item-content"));
//   // });

//   // product["stack"] = parseDescriptionForStack(product["description"]);
//   // product["author"] = item.find("span.author>.a-link-normal").text().trim();
//   // product["publisher"] = item
//   //   .find(
//   //     "div#rpi-attribute-book_details-publisher>.rpi-attribute-value>span"
//   //   )
//   //   .text()
//   //   .trim();
//   product["link"] = link;
//   product["type"] = "course";

//   return product;
// };

// module.exports = { getAmazonProductDetails, getUdemyProductDetails };
