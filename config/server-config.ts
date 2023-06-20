export const serverConfig = {
  useSecureCookies: process.env.USE_SECURE_COOKIES === "true",
  firebaseApiKey: process.env.FB_API_KEY!,
  serviceAccount: {
    projectId: process.env.FB_PROJECT_ID!,
    clientEmail: process.env.FB_ADMIN_CLIENT_EMAIL!,
    privateKey: process.env.FB_ADMIN_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  },
  databaseURL: `https://${process.env.NEXT_PUBLIC_FB_PROJECT_ID}.firebaseio.com`,
  client: process.env.NEXT_PUBLIC_CLIENT,
};

export const tokenConfig = {
  serviceAccount: serverConfig.serviceAccount,
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY!,
  cookieName: "AuthToken",
  cookieSignatureKeys: [
    process.env.COOKIE_SECRET_1!,
    process.env.COOKIE_SECRET_2!,
  ],
};
