# Backend Basics

Backend is entirely written in Python. It is based on Django Framework which is one of the most popular and robust web framework in Python. Top companies like Instagram, Spotify, Youtube, Pinterest have their backend written in Django.

The backend server provides the following functionalities via APIs

- **SignUp/SignIn** - To allow users to sign-up using any of the Social Logins via Auth0
- **Calendar Integration** - To connect user calendars and sync events
- **LinkedIn Integration** - To fetch linkedIn summary of any contact using LinkedIn Id
- **Ask Module** - Integrating ChatGPT with the contact and event notes

**It contains integrations with the following system**

- Auth0 - Used for authentication of users ([link](https://auth0.com/))
- GCP - To connect Google Calendar and sync events ([link](https://console.cloud.google.com/))
- Azure - To connect Outlook Calendar and sync events ([link](https://azure.microsoft.com/en-in))
- Azure OpenAI - To ask questions on our contact and notes data in ChatGPT style ([link](https://oai.azure.com/))
- AWS - Preferably for setting up Linux Machine. Azure could also be used. ([link](https://docs.aws.amazon.com/SetUp/latest/UserGuide/setup-prereqs-instructions.html))
- Rapid API - To fetch linkedIn profile of contact ([link](https://rapidapi.com/iscraper/api/linkedin-profiles-and-company-data))

**Deployment Steps**

- Setup a linux machine via any Cloud Provider. Preferably AWS. ([link](https://docs.aws.amazon.com/SetUp/latest/UserGuide/setup-prereqs-instructions.html))
- Connect Domain with the machine by using either AWS Route53 or by directly pointing the Domain to Machine using IP Address using GoDaddy ([link](https://www.godaddy.com/resources/ae/skills/how-to-connect-your-domain-name-to-your-hosting-account))
- Setup Nginx on the machine ([link](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/))
- Install Certificate on the machine (to enable https) using LetEncrypt/Certbot ([link](https://certbot.eff.org/))
- Setup a Gunicorn Server on the machine which will run Django Workers. Connect Nginx with Gunicorn using sockets.  ([link](https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu))
- Setup PostGres on the machine via Docker or using a dedicated database instance on AWS ([link](https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu))

**All APIs**

**User Management**

- Create a user: POST /api/user/1.0/user/create
- Get a user: GET /api/user/1.0/user
- Update a user: POST /api/user/1.0/user/update

### Authentication

- Google OAuth Login: GET /api/user/1.0/auth/google/
- Google OAuth Callback: GET /api/user/1.0/auth/google/callback/
- Microsoft OAuth Login: GET /api/user/1.0/auth/microsoft/
- Microsoft OAuth Callback: GET /api/user/1.0/auth/microsoft/callback/

### LinkedIn

- Get LinkedIn details: POST /api/user/1.0/linkedin-details

### **Calendar**

- Setup calendar: POST /api/user/1.0/calendar/setup
- Sync calendar events: POST /api/user/1.0/calendar/<int:calendar_id>/sync
- Check if calendar exists: GET /api/user/1.0/calendar/exists
- List calendars: GET /api/user/1.0/calendar/list

### Calendar Events

- Get a calendar event: GET /api/user/1.0/calendar_event/<int:event_id>
- Update a calendar event: POST /api/user/1.0/calendar_event/<int:event_id>/update
- List calendar events: GET /api/user/1.0/calendar_event/list

### Queries

- Create a query: POST /api/user/1.0/query/create
- Get a query response: GET /api/user/1.0/query/<int:query_id>/response

### **Intelligence**

- Get an answer: POST /api/user/1.0/intelligence/answer
- Stream an answer: GET /api/user/1.0/intelligence/answer/stream
- Get a chat reply: POST /api/user/1.0/intelligence/chat
- Stream a chat reply: POST /api/user/1.0/intelligence/chat/stream