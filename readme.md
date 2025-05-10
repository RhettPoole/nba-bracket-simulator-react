## Overview

**Project Title**: Customer Search

**Project Description**: The original intention of this product was to allow customers to create an account, then managers could login and search through the the customer to find their information. This could eventually be implemented in any POS system that need to store customer transactions or any customer information. It's ended as connecting a

**Project Goals**: Allow two different types of users to login, 'customers' or 'managers'. Error checking for matching username/password keys that will allow users to login. Connect to a database using react and firebase.

## Instructions for Build and Use

Steps to build and/or run the software:

1. Initialize a base repository for React using NPM
2. Modify and add any desired front-end pages
3. Test using local-host server
4. Add any desired folders for styles or any more files for HTML layouts
5. Organize routing on base App.js page
6. Connect Database
7. Perform testing by adding multiple customers of multiple types. Verify that desires actions create new items in your collections on Firebase.

Instructions for using the software:

1. (If starting project in root folder "react-web-app" instead of "customer-search") Open terminal window, "cd customer-search"
2. (Same terminal window) npm start
    Run's app automatically in a locally hosted browser window.
3. Navigate between pages by logging in or by using "/..." for whichever JS page you are trying to view.
4. "Ctrl + C" To close local server. (It will prompt you for "y/n" to confirm closure. Type "y")

## Development Environment 

To recreate the development environment, you need the following software and/or libraries with the specified versions:

* VSCode
* React
* NPM
* FireBase

## Useful Websites to Learn More

I found these websites useful in developing this software:

* https://create-react-app.dev/docs/deployment/
* https://react.dev/learn
* https://firebase.google.com/docs/guides?_gl=1*2u1ij6*_up*MQ..&gclid=CjwKCAjwz_bABhAGEiwAm-P8YUT3u2nLpornS9DLly6NIDP16r8SaLOo9HIZz0tSAlt1wwzD9hYhkRoCxVUQAvD_BwE&gclsrc=aw.ds&gbraid=0AAAAADpUDOiJ2MAAgCPHjx1ngWLoZKTWj 
* https://firebase.google.com/docs/projects/learn-more?_gl=1*2u1ij6*_up*MQ..&gclid=CjwKCAjwz_bABhAGEiwAm-P8YUT3u2nLpornS9DLly6NIDP16r8SaLOo9HIZz0tSAlt1wwzD9hYhkRoCxVUQAvD_BwE&gclsrc=aw.ds&gbraid=0AAAAADpUDOiJ2MAAgCPHjx1ngWLoZKTWj 
* https://react.dev/reference/react 

## Future Work

The following items I plan to fix, improve, and/or add to this project in the future:

* There are many comments throughout this project for things that I would like to add to this project. You can view those if this is not sufficient.
* [Move Routing into it's own Routes.js file to improve clarity in our folder structures and App.js file. ] 
* [Create Nav/Footer bars for user navigation. Right now you can only navigate to another page by logging in or typing in the route into the browser header. ]
* ["useEffect" - Implement this in a JS function to include more stored customer info such as a photo or their address. Currently all that is stored is the customer's login information.]
