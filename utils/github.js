const Roadmap = require("../models/Roadmap.js");
const axios = require("axios");
const Http404Error = require("../utils/errorHandling/http404Error.js");
const ALERTS = require("../utils/alerts");

const githubDataExpired = (lastUpdate) => {
  const dateObject = new Date(lastUpdate).getTime();
  const currentTime = new Date().getTime();
  return (currentTime - dateObject) / (1000 * 60 * 60) > 24;
};

const updateUserGithubData = async (user, github, token, next) => {
  try {
    const roadmap = await Roadmap.findOne({ user: user });

    if (!roadmap) {
      throw new Http404Error(ALERTS.AUTH.ERROR.USER_NOT_FOUND);
    }

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
        ...(github?.avatar_url && { avatar: github.avatar_url }),
        ...(github?.bio && { bio: github.bio }),
        ...(github?.url && { url: github.url }),
        ...(github?.html_url && { link: github.html_url }),
        ...(github?.name && { name: github.name }),
        ...(github?.login && { login: github.login }),
        ...(github?.public_repos && { publicRepos: github.public_repos }),
        ...(github?.total_private_repos && {
          privateRepos: github.total_private_repos,
        }),
        ...(github?.repos_url && { reposUrl: github.repos_url }),
        ...(github?.followers && { followers: github.followers }),
        ...(github?.following && { following: github.following }),
        ...(github?.repos_url && {
          featuredRepo: await getFeaturedRepo(github.repos_url, token, next),
        }),
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
    if (url) {
      const repos = await axios({
        url: url + "?sort=pushed&direction=desc&per_page=1",
        method: "GET",
        ...(token ? { headers: { Authorization: "token" + " " + token } } : {}),
      });

      const featuredRepo = [...repos.data][0];

      if (featuredRepo) {
        const repoLanguages = await axios({
          url: featuredRepo?.languages_url,
          method: "GET",
          ...(token
            ? { headers: { Authorization: "token" + " " + token } }
            : {}),
        });

        return {
          ...(featuredRepo?.created_at && {
            createdAt: featuredRepo.created_at,
          }),
          ...(featuredRepo?.updated_at && {
            updatedAt: featuredRepo.updated_at,
          }),
          ...(featuredRepo?.html_url && { link: featuredRepo.html_url }),
          ...(featuredRepo?.name && { name: featuredRepo.name }),
          ...(featuredRepo?.description && {
            description: featuredRepo.description,
          }),
          ...(repoLanguages?.data && { languages: repoLanguages.data }),
        };
      }

      return null;
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  githubDataExpired,
  updateUserGithubData,
};
