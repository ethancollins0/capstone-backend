# Water.pi
*A Web App to Automate Monitoring and Watering of Plants!*

![intro](https://github.com/ethancollins0/capstone-backend/blob/master/GitFiles/Home.png)

Water.pi is a web app I made in 3 weeks at Flatiron School. The app allows a user to signup and login, 
and securely keeps the user logged in using JWT. The user can go to their home page, and see a list of all of their pi's,
and easily navigate to a page to add more pi's to their collection. The home page allows the user to see whether their 
pi's are online, and see whether the plant needs to be watered. Finally, it lets the user know if the plant is being 
watered by the pi using WebSockets.


 
##### [Frontend](https://github.com/ethancollins0/capstone-frontend)
- Vue.js
- Vuex
- Vue-router
- Vue-socket.io

##### [Raspberry Pi](https://github.com/ethancollins0/raspberry-pi-api)
- Python
- Node.js
- Socket.io

##### [Backend](https://github.com/ethancollins0/capstone-backend)
- Node.js
- Express.js
- Socket.io
- PostgreSQL
- Knex.js

## Features
- Uses JWT and bcrypt to secure user signup, login, and following requests through HTTP or WebSockets.
- Creates live connections between the frontend user and their raspberry pi using Socket.io, secured using JWT.
- Using WebSockets, lets the frontend user know when their raspberry pi is online and when it is watering.
- Queries a deployed PostgreSQL database with Knex and Objection.js.
- Deployed to Heroku, which allows users anywhere to connect their Raspberry Pi's.

## Contributing
Please feel free to open a pull request or report any bugs, thanks!
