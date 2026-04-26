import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import { Config } from "../config";

let pool: CognitoUserPool | null = null;

function getPool() {
  if (!pool) {
    pool = new CognitoUserPool({
      UserPoolId: Config.cognitoUserPoolId,
      ClientId: Config.cognitoClientId,
    });
  }
  return pool;
}

export interface AuthTokens {
  idToken: string;
  accessToken: string;
  refreshToken: string;
}

export function signIn(email: string, password: string): Promise<AuthTokens> {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: getPool() });
    const details = new AuthenticationDetails({ Username: email, Password: password });

    user.authenticateUser(details, {
      onSuccess: (session) => {
        resolve({
          idToken: session.getIdToken().getJwtToken(),
          accessToken: session.getAccessToken().getJwtToken(),
          refreshToken: session.getRefreshToken().getToken(),
        });
      },
      onFailure: reject,
    });
  });
}

export function signUp(email: string, password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const attrs = [new CognitoUserAttribute({ Name: "email", Value: email })];
    getPool().signUp(email, password, attrs, [], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export function confirmSignUp(email: string, code: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: getPool() });
    user.confirmRegistration(code, true, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export function signOut() {
  getPool().getCurrentUser()?.signOut();
}
