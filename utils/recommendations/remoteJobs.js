const { getJobStack, getJobTypes } = require("../stack.js");
const RemoteJob = require("../../models/recommendations/RemoteJob.js");
const axios = require("axios");

const getUpdatedRemoteJobs = async (path) => {
  const apiUrl = "https://remoteok.com/api?tags=dev&action=get_jobs&offset=19";

  let remoteJobs = await RemoteJob.find({
    types: { $in: [path] },
  });

  const currentDate = new Date();
  const updateRequired =
    !remoteJobs?.length ||
    remoteJobs[0].lastUpdate < new Date(currentDate - 24 * 60 * 60 * 1000);

  if (updateRequired) {
    const response = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json, text/plain, */*",
        Pragma: "no-cache",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
      },
    });

    let updatedJobsList = [];

    response.data.forEach((job) => {
      if (
        !!job.position &&
        !!job.company &&
        (job.location === "" ||
          job.location.toLowerCase().includes("worldwide"))
      ) {
        updatedJobsList.push({
          position: job.position,
          company: job.company,
          companyLogo: job.company_logo,
          date: job.date,
          tags: job.tags,
          description: job.description,
          stack: getJobStack(job),
          salary: getSalaryExpectation(job),
          url: job.url,
          applyUrl: job.apply_url,
          lastUpdate: currentDate,
        });
      }
    });

    updatedJobsList.forEach((job) => {
      job.types = getJobTypes(job);
    });

    if (remoteJobs.length) {
      await RemoteJob.deleteMany({});
      remoteJobs = [];
    }

    updatedJobsList.forEach(async (job) => {
      const newJob = new RemoteJob(job);
      await newJob.save();
    });

    remoteJobs = updatedJobsList.filter((job) => {
      if (path === "PATHS.TITLES.FULL_STACK") {
        return (
          job.types.includes("PATHS.TITLES.FRONTEND") ||
          job.types.includes("PATHS.TITLES.BACKEND")
        );
      } else return job.types.includes(path);
    });
  }

  return remoteJobs;
};

getSalaryExpectation = (job) => {
  let min = job.salary_min;
  let max = job.salary_max;
  if (min && max) {
    return `$${getValueInThousands(min)} - $${getValueInThousands(max)}`;
  }
  return;
};

getValueInThousands = (value) => {
  return value
    .toString()
    .replace(/(\d{1,})(\d{3})$/, (_, prefix, lastThree) => prefix + "k");
};

module.exports = {
  getUpdatedRemoteJobs,
};
