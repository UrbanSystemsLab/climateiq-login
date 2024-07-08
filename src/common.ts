import axios, { AxiosResponse } from 'axios';
import cookie from 'cookie';
import moment from 'moment';

const TOKEN_COOKIE_ID = 'climateiq_access_token';
const EXPIRY_COOKIE_ID = 'climateiq_access_token_expiry';
const TOKEN_API_ENDPOINT_URI = 'https://api.climateiq.org/oauth/token';
// This authorization code is used for identifying this user authentication app. The
// Apigee /oauth/token endpoint will only return an API access token if a valid JWT
// issued by the authentication app is also present in the request.
const AUTH_CODE =
  'cDF1QXM4T3NGdDI2emlUYWIzQmt2cFdNOUJIbDVyUmNjT25CZHhzVFIya3MwVEZ0OmNTNU1WSFFjTkI4VHJ0UXJLOVZpc09BNDFNUGVRQUtjWHc5ZmRPcTZIWFN4aDBUdU1Va0h5Tk9wZ0ZsYTBpYnI=';
const SAML_API_ENDPOINT_URI =
  'https://api.climateiq.org/apigee-saml-idp/authcomplete';

export const REDIRECT_URI_PROP = {
  redirectUri: {
    type: String,
    default: '',
  },
};

export function deleteCookies() {
  document.cookie = cookie.serialize(TOKEN_COOKIE_ID, '', {
    maxAge: -1,
    path: '/',
    domain: 'climateiq.org',
  });
  document.cookie = cookie.serialize(EXPIRY_COOKIE_ID, '', {
    maxAge: -1,
    path: '/',
    domain: 'climateiq.org',
  });
}

let cookiesSetResolve: Function;
let cookiesSetReject: Function;
export const cookiesSet = new Promise((resolve, reject) => {
  cookiesSetResolve = resolve;
  cookiesSetReject = reject;
});

export async function getApigeeTokenAndSetCookies(
  firebaseToken: string | null,
) {
  const cookies = cookie.parse(document.cookie);
  if (cookies[TOKEN_COOKIE_ID] && cookies[EXPIRY_COOKIE_ID]) {
    if (parseInt(cookies[EXPIRY_COOKIE_ID]) > moment().unix()) {
      cookiesSetResolve();
      return;
    }
  }

  let response: AxiosResponse<any, any>;
  try {
    response = await axios.post(
      TOKEN_API_ENDPOINT_URI,
      {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: firebaseToken,
      },
      {
        headers: {
          Authorization: `Basic ${AUTH_CODE}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
  } catch (error) {
    cookiesSetReject(error);
    return;
  }

  document.cookie = cookie.serialize(
    TOKEN_COOKIE_ID,
    response.data['access_token'],
    { maxAge: response.data['expires_in'], path: '/', domain: 'climateiq.org' },
  );
  document.cookie = cookie.serialize(
    EXPIRY_COOKIE_ID,
    String(moment().unix() + parseInt(response.data['expires_in'])),
    { maxAge: response.data['expires_in'], path: '/', domain: 'climateiq.org' },
  );
  cookiesSetResolve();
}

export async function getSamlSignedResponse(
  firebaseToken: string | null,
  sessionId: string,
): Promise<{ [id: string]: string }> {
  const response = await axios.post(
    SAML_API_ENDPOINT_URI,
    {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: firebaseToken,
      session_id: sessionId,
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
  return response.data;
}
