const STACK_LIST = [
  { title: "AArch64", name: "aarch64", type: "backend" },
  { title: "Adobe After Effects", name: "aftereffects", type: "frontend" },
  { title: "Adobe Illustrator", name: "illustrator", type: "frontend" },
  { title: "Adobe Photoshop", name: "photoshop", type: "frontend" },
  { title: "Adobe Premiere Pro", name: "premierepro", type: "frontend" },
  { title: "Adobe XD", name: "xd", type: "frontend" },
  { title: "AdonisJS", name: "adonisjs", type: "backend" },
  { title: "Amazon Web Services", name: "amazonwebservices", type: "backend" },
  { title: "Anaconda", name: "anaconda", type: "backend" },
  { title: "Android", name: "android", type: "frontend" },
  { title: "Android Studio", name: "androidstudio", type: "frontend" },
  { title: "Angular", name: "angularjs", type: "frontend" },
  { title: "Ansible", name: "ansible", type: "backend" },
  { title: "Apache", name: "apache", type: "backend" },
  { title: "Apache Kafka", name: "apachekafka", type: "backend" },
  { title: "Appcelerator", name: "appcelerator", type: "frontend" },
  { title: "Apple", name: "apple", type: "frontend" },
  { title: "Appwrite", name: "appwrite", type: "backend" },
  { title: "Argo CD", name: "argocd", type: "backend" },
  { title: "Atom", name: "atom", type: "frontend" },
  { title: "Azure", name: "azure", type: "backend" },
  { title: "Babel", name: "babel", type: "frontend" },
  { title: "Backbone.js", name: "backbonejs", type: "frontend" },
  { title: "Bamboo", name: "bamboo", type: "backend" },
  { title: "Bash", name: "bash", type: "backend" },
  { title: "Behance", name: "behance", type: "frontend" },
  { title: "Bitbucket", name: "bitbucket", type: "backend" },
  { title: "Blender", name: "blender", type: "frontend" },
  { title: "Bootstrap", name: "bootstrap", type: "frontend" },
  { title: "Bower", name: "bower", type: "frontend" },
  { title: "Bulma", name: "bulma", type: "frontend" },
  { title: "C", name: "c", type: "backend" },
  { title: "CakePHP", name: "cakephp", type: "backend" },
  { title: "Canva", name: "canva", type: "frontend" },
  { title: "CentOS", name: "centos", type: "backend" },
  { title: "Ceylon", name: "ceylon", type: "backend" },
  { title: "Chrome", name: "chrome", type: "frontend" },
  { title: "CircleCI", name: "circleci", type: "backend" },
  { title: "Clojure", name: "clojure", type: "backend" },
  { title: "ClojureScript", name: "clojurescript", type: "frontend" },
  { title: "CMake", name: "cmake", type: "backend" },
  { title: "Codecov", name: "codecov", type: "backend" },
  { title: "CodeIgniter", name: "codeigniter", type: "backend" },
  { title: "CodePen", name: "codepen", type: "frontend" },
  { title: "CoffeeScript", name: "coffeescript", type: "frontend" },
  { title: "Composer", name: "composer", type: "backend" },
  { title: "Confluence", name: "confluence", type: "backend" },
  { title: "CouchDB", name: "couchdb", type: "backend" },
  { title: "C++", name: "cplusplus", type: "backend" },
  { title: "Crystal", name: "crystal", type: "backend" },
  { title: "C#", name: "csharp", type: "backend" },
  { title: "CSS", name: "css3", type: "frontend" },
  { title: "Cucumber", name: "cucumber", type: "backend" },
  { title: "D3.js", name: "d3js", type: "frontend" },
  { title: "Dart", name: "dart", type: "frontend" },
  { title: "Debian", name: "debian", type: "backend" },
  { title: "Deno", name: "denojs", type: "backend" },
  { title: "DigitalOcean", name: "digitalocean", type: "backend" },
  { title: "discord.js", name: "discordjs", type: "frontend" },
  { title: "Django", name: "django", type: "backend" },
  { title: "Docker", name: "docker", type: "backend" },
  { title: "Doctrine", name: "doctrine", type: "backend" },
  { title: ".NET", name: "dot-net", type: "backend" },
  { title: ".NET Core", name: "dotnetcore", type: "backend" },
  { title: "Dropwizard", name: "dropwizard", type: "backend" },
  { title: "Drupal", name: "drupal", type: "backend" },
  { title: "Electron", name: "electron", type: "frontend" },
  { title: "Eleventy", name: "eleventy", type: "frontend" },
  { title: "Elixir", name: "elixir", type: "backend" },
  { title: "Elm", name: "elm", type: "frontend" },
  { title: "Embedded C", name: "embeddedc", type: "backend" },
  { title: "Ember.js", name: "ember", type: "frontend" },
  { title: "Erlang", name: "erlang", type: "backend" },
  { title: "ESLint", name: "eslint", type: "frontend" },
  { title: "Express.js", name: "express", type: "backend" },
  { title: "FastAPI", name: "fastapi", type: "backend" },
  { title: "Feathers", name: "feathersjs", type: "backend" },
  { title: "Fedora", name: "fedora", type: "backend" },
  { title: "Figma", name: "figma", type: "frontend" },
  { title: "FileZilla", name: "filezilla", type: "backend" },
  { title: "Firebase", name: "firebase", type: "backend" },
  { title: "Firefox", name: "firefox", type: "frontend" },
  { title: "Flask", name: "flask", type: "backend" },
  { title: "Flutter", name: "flutter", type: "frontend" },
  { title: "Foundation", name: "foundation", type: "frontend" },
  { title: "F#", name: "fsharp", type: "backend" },
  { title: "Gatling", name: "gatling", type: "backend" },
  { title: "Gatsby", name: "gatsby", type: "frontend" },
  { title: "GCC", name: "gcc", type: "backend" },
  { title: "Gentoo", name: "gentoo", type: "backend" },
  { title: "GIMP", name: "gimp", type: "frontend" },
  { title: "Git", name: "git", type: "backend" },
  { title: "GitHub", name: "github", type: "backend" },
  { title: "GitLab", name: "gitlab", type: "backend" },
  { title: "Gitter", name: "gitter", type: "frontend" },
  { title: "Go", name: "go", type: "backend" },
  { title: "Godot", name: "godot", type: "frontend" },
  { title: "Google", name: "google", type: "frontend" },
  { title: "Google Cloud", name: "googlecloud", type: "backend" },
  { title: "Gradle", name: "gradle", type: "backend" },
  { title: "Grafana", name: "grafana", type: "backend" },
  { title: "Grails", name: "grails", type: "backend" },
  { title: "GraphQL", name: "graphql", type: "backend" },
  { title: "Groovy", name: "groovy", type: "backend" },
  { title: "Grunt", name: "grunt", type: "frontend" },
  { title: "Gulp.js", name: "gulp", type: "frontend" },
  { title: "Handlebars", name: "handlebars", type: "frontend" },
  { title: "Haskell", name: "haskell", type: "backend" },
  { title: "Haxe", name: "haxe", type: "backend" },
  { title: "Heroku", name: "heroku", type: "backend" },
  { title: "HTML", name: "html5", type: "frontend" },
  { title: "Hugo", name: "hugo", type: "frontend" },
  { title: "IE10", name: "ie10", type: "frontend" },
  { title: "IFTTT", name: "ifttt", type: "backend" },
  { title: "Inkscape", name: "inkscape", type: "frontend" },
  { title: "IntelliJ", name: "intellij", type: "backend" },
  { title: "Ionic", name: "ionic", type: "frontend" },
  { title: "Jamstack", name: "jamstack", type: "frontend" },
  { title: "Jasmine", name: "jasmine", type: "frontend" },
  { title: "Java", name: "java", type: "backend" },
  { title: "JavaScript", name: "javascript", type: "full-stack" },
  { title: "Jeet", name: "jeet", type: "frontend" },
  { title: "Jenkins", name: "jenkins", type: "backend" },
  { title: "Jest", name: "jest", type: "frontend" },
  { title: "JetBrains", name: "jetbrains", type: "backend" },
  { title: "Jira", name: "jira", type: "backend" },
  { title: "jQuery", name: "jquery", type: "frontend" },
  { title: "Julia", name: "julia", type: "backend" },
  { title: "Jupyter", name: "jupyter", type: "backend" },
  { title: "K3s", name: "k3s", type: "backend" },
  { title: "Kaggle", name: "kaggle", type: "backend" },
  { title: "Karma", name: "karma", type: "frontend" },
  { title: "Knockout", name: "knockout", type: "frontend" },
  { title: "Kotlin", name: "kotlin", type: "backend" },
  { title: "Kraken.js", name: "krakenjs", type: "backend" },
  { title: "Kubernetes", name: "kubernetes", type: "backend" },
  { title: "LabVIEW", name: "labview", type: "backend" },
  { title: "Laravel", name: "laravel", type: "backend" },
  { title: "LaTeX", name: "latex", type: "backend" },
  { title: "Less", name: "less", type: "frontend" },
  { title: "Linux", name: "linux", type: "backend" },
  { title: "Lua", name: "lua", type: "backend" },
  { title: "Magento", name: "magento", type: "backend" },
  { title: "Markdown", name: "markdown", type: "frontend" },
  { title: "Material UI", name: "materialui", type: "frontend" },
  { title: "MATLAB", name: "matlab", type: "backend" },
  { title: "Maya", name: "maya", type: "frontend" },
  { title: "Meteor", name: "meteor", type: "full-stack" },
  {
    title: "Microsoft SQL Server",
    name: "microsoftsqlserver",
    type: "backend",
  },
  { title: "Minitab", name: "minitab", type: "backend" },
  { title: "Mocha", name: "mocha", type: "backend" },
  { title: "MODX", name: "modx", type: "backend" },
  { title: "MongoDB", name: "mongodb", type: "database" },
  { title: "Moodle", name: "moodle", type: "backend" },
  { title: "MySQL", name: "mysql", type: "database" },
  { title: "Neo4j", name: "neo4j", type: "database" },
  { title: "NestJS", name: "nestjs", type: "backend" },
  { title: "NetworkX", name: "networkx", type: "backend" },
  { title: "Next.js", name: "nextjs", type: "frontend" },
  { title: "NGINX", name: "nginx", type: "backend" },
  { title: "Node.js", name: "nodejs", type: "backend" },
  { title: "NW.js", name: "nodewebkit", type: "frontend" },
  { title: "npm", name: "npm", type: "backend" },
  { title: "NuGet", name: "nuget", type: "backend" },
  { title: "NumPy", name: "numpy", type: "backend" },
  { title: "Nuxt.js", name: "nuxtjs", type: "frontend" },
  { title: "Objective-C", name: "objectivec", type: "backend" },
  { title: "OCaml", name: "ocaml", type: "backend" },
  { title: "OpenAL", name: "openal", type: "backend" },
  { title: "OpenCV", name: "opencv", type: "backend" },
  { title: "OpenGL", name: "opengl", type: "backend" },
  { title: "Opera", name: "opera", type: "frontend" },
  { title: "Oracle", name: "oracle", type: "database" },
  { title: "Packer", name: "packer", type: "backend" },
  { title: "Pandas", name: "pandas", type: "backend" },
  { title: "Perl", name: "perl", type: "backend" },
  { title: "Phalcon", name: "phalcon", type: "backend" },
  { title: "Phoenix", name: "phoenix", type: "backend" },
  { title: "PHP", name: "php", type: "backend" },
  { title: "PhpStorm", name: "phpstorm", type: "backend" },
  { title: "Podman", name: "podman", type: "backend" },
  { title: "Polygon", name: "polygon", type: "backend" },
  { title: "PostgreSQL", name: "postgresql", type: "database" },
  { title: "Processing", name: "processing", type: "backend" },
  { title: "Prometheus", name: "prometheus", type: "backend" },
  { title: "Protractor", name: "protractor", type: "frontend" },
  { title: "PuTTY", name: "putty", type: "backend" },
  { title: "PyCharm", name: "pycharm", type: "backend" },
  { title: "PyTest", name: "pytest", type: "backend" },
  { title: "Python", name: "python", type: "backend" },
  { title: "PyTorch", name: "pytorch", type: "backend" },
  { title: "Qt", name: "qt", type: "frontend" },
  { title: "R", name: "r", type: "backend" },
  { title: "Rails", name: "rails", type: "backend" },
  { title: "React", name: "react", type: "frontend" },
  { title: "Rect", name: "rect", type: "frontend" },
  { title: "Redis", name: "redis", type: "database" },
  { title: "Redux", name: "redux", type: "frontend" },
  { title: "RocksDB", name: "rocksdb", type: "database" },
  { title: "RSpec", name: "rspec", type: "backend" },
  { title: "RStudio", name: "rstudio", type: "backend" },
  { title: "Ruby", name: "ruby", type: "backend" },
  { title: "RubyMine", name: "rubymine", type: "backend" },
  { title: "Rust", name: "rust", type: "backend" },
  { title: "Safari", name: "safari", type: "frontend" },
  { title: "Salesforce", name: "salesforce", type: "backend" },
  { title: "Sass", name: "sass", type: "frontend" },
  { title: "Scala", name: "scala", type: "backend" },
  { title: "SDL", name: "sdl", type: "frontend" },
  { title: "Selenium", name: "selenium", type: "backend" },
  { title: "Sequelize", name: "sequelize", type: "backend" },
  { title: "Shopware", name: "shopware", type: "backend" },
  { title: "ShotGrid", name: "shotgrid", type: "backend" },
  { title: "Scratch", name: "sketch", type: "frontend" },
  { title: "Slack", name: "slack", type: "backend" },
  { title: "Socket.IO", name: "socketio", type: "backend" },
  { title: "Solidity", name: "solidity", type: "backend" },
  { title: "Sourcetree", name: "sourcetree", type: "frontend" },
  { title: "Spring", name: "spring", type: "backend" },
  { title: "SPSS", name: "spss", type: "backend" },
  { title: "SQLAlchemy", name: "sqlalchemy", type: "backend" },
  { title: "SQLite", name: "sqlite", type: "database" },
  { title: "SSH", name: "ssh", type: "backend" },
  { title: "Storybook", name: "storybook", type: "frontend" },
  { title: "Stylus", name: "stylus", type: "frontend" },
  { title: "Subversion", name: "subversion", type: "backend" },
  { title: "Svelte", name: "svelte", type: "frontend" },
  { title: "Swift", name: "swift", type: "backend" },
  { title: "Symfony", name: "symfony", type: "backend" },
  { title: "Tailwind CSS", name: "tailwindcss", type: "frontend" },
  { title: "TensorFlow", name: "tensorflow", type: "backend" },
  { title: "Terraform", name: "terraform", type: "backend" },
  { title: "The Algorithms", name: "thealgorithms", type: "backend" },
  { title: "Three.js", name: "threejs", type: "frontend" },
  { title: "Tomcat", name: "tomcat", type: "backend" },
  { title: "TortoiseGit", name: "tortoisegit", type: "backend" },
  { title: "Tower Git", name: "towergit", type: "backend" },
  { title: "Travis CI", name: "travis", type: "backend" },
  { title: "TypeScript", name: "typescript", type: "backend" },
  { title: "TYPO3", name: "typo3", type: "backend" },
  { title: "Unity", name: "unity", type: "backend" },
  { title: "Unreal Engine", name: "unrealengine", type: "backend" },
  { title: "uWSGI", name: "uwsgi", type: "backend" },
  { title: "Vagrant", name: "vagrant", type: "backend" },
  { title: "Vim", name: "vim", type: "backend" },
  { title: "Visual Studio", name: "visualstudio", type: "backend" },
  { title: "VS Code", name: "vscode", type: "backend" },
  { title: "Vue.js", name: "vuejs", type: "frontend" },
  { title: "Vue Storefront", name: "vuestorefront", type: "frontend" },
  { title: "Vuetify", name: "vuetify", type: "frontend" },
  { title: "Webflow", name: "webflow", type: "frontend" },
  { title: "Weblate", name: "weblate", type: "backend" },
  { title: "Webpack", name: "webpack", type: "backend" },
  { title: "WebStorm", name: "webstorm", type: "backend" },
  { title: "WooCommerce", name: "woocommerce", type: "backend" },
  { title: "WordPress", name: "wordpress", type: "backend" },
  { title: "Xamarin", name: "xamarin", type: "backend" },
  { title: "Xcode", name: "xcode", type: "backend" },
  { title: "Yarn", name: "yarn", type: "frontend" },
  { title: "Yii", name: "yii", type: "backend" },
  { title: "YunoHost", name: "yunohost", type: "backend" },
  { title: "Zend", name: "zend", type: "backend" },
  { title: "Zig", name: "zig", type: "backend" },
];

const getJobStack = (job) => {
  const results = [];

  STACK_LIST.forEach((language) => {
    if (
      job.tags?.includes(language.title) ||
      job.tags?.includes(language.name)
    ) {
      results.push(language);
      return;
    }

    const titleRegex = new RegExp(
      `\\b${language.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "gi"
    );
    const nameRegex = new RegExp(
      `\\b${language.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "gi"
    );

    if (titleRegex.test(job.position) || nameRegex.test(job.position)) {
      results.push(language);
      return;
    } else if (
      titleRegex.test(job.description) ||
      nameRegex.test(job.description)
    ) {
      results.push(language);
      return;
    }
  });

  return results;
};

const getJobTypes = (job) => {
  const results = [];

  const jobTypes = {
    "PATHS.TITLES.FRONTEND": ["frontend", "front end", "front-end"],
    "PATHS.TITLES.BACKEND": ["backend", "back end", "back-end"],
    "PATHS.TITLES.FULL_STACK": ["fullstack", "full stack", "full-stack"],
    "PATHS.TITLES.MOBILE": ["mobile", "mobile app"],
    "PATHS.TITLES.GAME": ["game", "games"],
  };

  for (let jobType in jobTypes) {
    jobTypes[jobType].forEach((type) => {
      if (job.tags?.includes(type)) {
        if (!results.includes(jobType)) {
          results.push(jobType);
        }
        return;
      }

      const typeRegex = new RegExp(
        `\\b${jobType.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
        "gi"
      );

      if (typeRegex.test(job.position)) {
        if (!results.includes(jobType)) {
          results.push(jobType);
        }
        return;
      } else if (typeRegex.test(job.description)) {
        if (!results.includes(jobType)) {
          results.push(jobType);
        }
        return;
      }
    });
  }

  return results;
};

module.exports = {
  getJobStack,
  getJobTypes,
};
