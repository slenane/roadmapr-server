const Roadmap = require("../models/Roadmap.js");
const axios = require("axios");

const githubDataExpired = (lastUpdate) => {
  const dateObject = new Date(lastUpdate).getTime();
  const currentTime = new Date().getTime();
  return (currentTime - dateObject) / (1000 * 60 * 60) > 24;
};

const updateUserGithubData = async (user, github, token, next) => {
  try {
    const roadmap = await Roadmap.findOne({ user });

    if (github.lastUpdated) {
      const githubResponse = await axios({
        url: roadmap.github.url,
        method: "GET",
      });

      github = githubResponse.data;
    }

    if (github) {
      roadmap.github = {
        lastUpdated: new Date(),
        avatar: github.avatar_url,
        bio: github.bio,
        url: github.url,
        link: github.html_url,
        name: github.name,
        login: github.login,
        publicRepos: github.public_repos,
        privateRepos: github.total_private_repos
          ? github.total_private_repos
          : roadmap.github.privateRepos,
        followers: github.followers,
        reposUrl: github.repos_url,
        followers: github.followers,
        following: github.following,
        featuredRepo: await getFeaturedRepo(github.repos_url, token, next),
      };

      await roadmap.save();
    }

    return roadmap.github;
  } catch (error) {
    next(error);
  }
};

const getFeaturedRepo = async (url, token, next) => {
  try {
    const repos = await axios({
      url: url + "?sort=pushed&direction=desc&per_page=1",
      method: "GET",
      ...(token ? { headers: { Authorization: "token" + " " + token } } : {}),
    });

    const featuredRepo = [...repos.data][0];

    const repoLanguages = await axios({
      url: featuredRepo.languages_url,
      method: "GET",
      ...(token ? { headers: { Authorization: "token" + " " + token } } : {}),
    });

    return {
      createdAt: featuredRepo.created_at,
      updatedAt: featuredRepo.updated_at,
      link: featuredRepo.html_url,
      name: featuredRepo.name,
      description: featuredRepo.description,
      languages: repoLanguages.data,
    };
  } catch (error) {
    next(error);
  }
};

module.exports = {
  githubDataExpired,
  updateUserGithubData,
};
