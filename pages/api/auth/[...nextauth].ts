import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default (req, res) =>
  NextAuth(req, res, {
    sessions: { jwt: true },
    jwt: {
      secret: process.env.JWT_SECRET,
    },
    providers: [Providers.GitHub({ clientId: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET })],
    database: process.env.DATABASE_URL,
    pages: {
      // tells nextauth to not use its default sign-in page
      signIn: '/signin',
    },
  });
