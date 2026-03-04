declare const process: {
  env: Record<string, string | undefined>;
};

export default {
  providers: [
    {
      domain: process.env.VITE_CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};
