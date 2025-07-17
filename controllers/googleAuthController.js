// controllers/googleAuth.js
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const exchangeCodeForIdToken = async (code) => {
  const response = await axios.post('https://oauth2.googleapis.com/token', {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: 'postmessage',
    grant_type: 'authorization_code',
  });

  return response.data; 
};

async function verifyGoogleIdToken(code) {
  const tokens = await exchangeCodeForIdToken(code);

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const user = {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
  };

  return user;
}

export { verifyGoogleIdToken };
