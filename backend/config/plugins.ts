export default ({ env }) => ({
  sentry: {
    enabled: true,
    config: {
      dsn: env("SENTRY_DSN"),
      sendMetadata: true,
    },
  },
  email: {
    config: {
      provider: env("EMAIL_PROVIDER", "nodemailer"),
      providerOptions: {
        host: env("SMTP_HOST", "smtp.gmail.com"),
        port: env("SMTP_PORT", 465),
        secure: true,
        auth: env("SMTP_CLIENT_ID")
          ? {
              type: "OAuth2",
              user: env("SMTP_USERNAME"),
              serviceClient: env("SMTP_CLIENT_ID"),
              privateKey: env("SMTP_PRIVATE_KEY")?.replace(/\\n/g, "\n"),
            }
          : {
              user: env("SMTP_USERNAME"),
              pass: env("SMTP_PASSWORD"),
            },
        // ... any custom nodemailer options
      },
      settings: {
        defaultFrom: `EcoNature <${env("DEFAULT_EMAIL")}>`,
        defaultReplyTo: `EcoNature <${env("DEFAULT_EMAIL")}>`,
      },
    },
  },
});
