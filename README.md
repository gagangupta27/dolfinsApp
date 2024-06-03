# Dope

### Dope is an offline & privacy first note taking app. 

### It is primarily for Sales People who are engaged in high stake deals where they quickly need to take notes, and analyze notes to deeply understand their clients.

### Features
- Login Screen
- Home Screen
- Contact Screen
- Calendar Screen
- Calendar Event Screen
- Ask Screen
- Multi Modal Note Taking Component

More documentation are present in `docs` folder.

### How to setup

#### Config
- There is `config_example.js` present in the root folder. Create a copy of it and name it `config.js`

- Dope App is designed to work without any backend, but few functionalities like Calendar, Ask Module and Linkedin Integration need a backend. First setup the backend by following the instructions in `dope-server` Github Repository. This is the url of the backend. Eg - `https://api.getdope.ai` or `http://localhost:8000`
```
BASE_URL
```

- Setup Account on Auth0. It is used for all the authentication in the app and also in the backend. Same details are used at both the places. Website [link](https://auth0.com)
```
AUTH0DOMAIN
AUTH0CLIENTID
```

- Setup a Mixpanel account and obtain the mixpanel client id. This is used for Analytics.
```
MIXPANEL_CLIENT_ID
```


#### Dependencies
- Ensure that you have `xcode` installed your system. Use this command `xcode-select --install` to install it. You can also install it from the Mac App Store by following the instructions [here](https://www.freecodecamp.org/news/how-to-download-and-install-xcode/)

#### Installation
- Install nvm on the system. Please see [this](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/)
- After installation of nvm, install node version `v18.16.1` using the command `nvm use v18.16.1`
- Run `npm i` to install all the dependencies
- Run `npx expo run:ios` to run the app. Press `i` to open the app.


#### Deployment
- For Deployment, you will need to configure Expo
- Expo provides a one stop solution for all building and distribution of IOS 
- For configuring Expo - first create an account on [Expo](https://expo.dev)
- Create a new app there and follow the instructions there to configure the current app. 
- Post that, follow the instructions from [here](https://docs.expo.dev/guides/local-app-development/) to setup Expo for local development
- To build the app using expo on the Expo Servers - Run the command `npx eas build -p ios`.
- To deploy the app using expo through the Expo Server  - Run the command `npx eas submit -p ios`
