import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import Providers from 'next-auth/providers';
// eslint-disable-next-line import/no-unresolved
import { WithAdditionalParams } from 'next-auth/_utils';
import { connectToDB, folder, doc } from '../../../db';
import { UserSession } from '../../../types';

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> | void =>
  NextAuth(req, res, {
    session: {
      jwt: true,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
    },
    // Configure one or more authentication providers
    providers: [
      Providers.GitHub({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      }),

      // ...add more providers here
    ],

    database: process.env.DATABASE_URL,
    pages: {
      signIn: '/signin',
    },
    callbacks: {
      async redirect(url: string, baseUrl: string): Promise<string> {
        return url.startsWith(baseUrl) ? url : baseUrl;
      },
      async session(session: Session, user: User | JWT) {
        if (isJwt(user)) {
          session.user.id = user.id;
        }
        return session as WithAdditionalParams<Session>;
      },
      async jwt(tokenPayload, user: UserSession, account, profile, isNewUser) {
        const { db } = await connectToDB();

        if (isNewUser) {
          const personalFolder = await folder.createFolder(db, { createdBy: `${user.id}`, name: 'Getting Started' });
          await doc.createDoc(db, {
            name: 'Start Here',
            folder: personalFolder._id,
            createdBy: `${user.id}`,
            content: {
              time: 1556098174501,
              blocks: [
                {
                  type: 'header',
                  data: {
                    text: 'Some default content',
                    level: 2,
                  },
                },
              ],
              version: '2.12.4',
            },
          });
        }

        if (tokenPayload && user) {
          return { ...tokenPayload, id: `${user.id}` };
        }

        return tokenPayload;
      },
    },
  });

function isJwt(user: User | JWT): user is JWT {
  return user.hasOwnProperty('id');
}
