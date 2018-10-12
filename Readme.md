# Google Project Zero Issue Downloader:
	Project to clone and convert awesome issues reported/maintained at Google project-zero to pdf to read on the go. 
	Couldn't find rss feed. This tool could be used to fetch an issue or all issues with description and pocs attached to an them.

# Installation and Usage:

```
-> Installation:
    hc@d3n:~/D/P/google-pzero> npm install pzeropdf

-> To download a particular issue
    hc@d3n:~/D/P/google-pzero> pzeropdf -i "https://bugs.chromium.org/p/project-zero/issues/detail?id=1556&desc=4"

-> To download all issue under project-zero
    hc@d3n:~/D/P/google-pzero> pzeropdf -r ianbeer
```

# Credits:
	
	- Google Project Zero, mahalo :heart_eyes: :heart_eyes: ¯\_(^▾^)_/¯

# Developement

```
npm install -> install dependencies and dev dependencies, including typescript from the package lock file
npm run build -> this will convert typescript files in to js and put it inside ./dist folder
npm link -> creates a sym link to the command inside the package.json bin object
npm install -g -> install the package globally so you can use from anywhere
```
