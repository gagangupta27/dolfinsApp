import Auth0 from "react-native-auth0";
import { AUTH0DOMAIN, AUTH0CLIENTID } from "../../config";

// Initialize Auth0
const auth0 = new Auth0({
  domain: AUTH0DOMAIN,
  clientId: AUTH0CLIENTID,
});

export default auth0;
