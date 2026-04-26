import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra ?? {};

export const Config = {
  apiUrl: (extra.apiUrl as string) || "http://localhost:3000",
  cognitoUserPoolId: (extra.cognitoUserPoolId as string) || "",
  cognitoClientId: (extra.cognitoClientId as string) || "",
  assetsBucketUrl: (extra.assetsBucketUrl as string) || "",
};
