import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  keyFile: 'credentialss.json',
  scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

export default auth;
