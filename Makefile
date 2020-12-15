


init:
	npx create-react-app electron01

install:
	yarn add electron electron-builder --dev
	yarn add wait-on concurrently --dev
	yarn add cross-env electron-is-dev
	touch public/electron.js

start:
	electron .

built:
	yarn build && yarn electron-build

release:
	react-scripts build && electron-builder --publish=always

buildall:
	react-scripts build && electron-builder

## "concurrently \"cross-env BROWSER=none react-scripts start\" \"wait-on http://localhost:3000 && electron .\""

