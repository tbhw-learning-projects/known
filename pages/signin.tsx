import React, { useEffect } from 'react';
import { Pane, majorScale, Text, Spinner } from 'evergreen-ui';
import Logo from '../components/logo';
import { signIn, useSession } from 'next-auth/client';
import SocialButton from '../components/socialButton';
import { useRouter } from 'next/router';

const Signin = (): JSX.Element => {
  const [session, loading] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/app');
    }
  }, [router, session]);

  return (
    <Pane height="100vh" width="100vw" display="flex">
      <Pane
        height="100%"
        width="50%"
        borderRight
        paddingX={majorScale(8)}
        paddingY={majorScale(5)}
        background="#47B881"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Pane>
          <Logo color="white" fontSize="60px" />
          <Pane marginTop={majorScale(2)}>
            <Text color="white" fontSize="22px">
              Sign in.
            </Text>
          </Pane>
        </Pane>
      </Pane>
      <Pane
        height="100%"
        width="50%"
        background="tint2"
        display="flex"
        alignItems="center"
        justifyContent="center"
        paddingX={majorScale(7)}
      >
        {(session || loading) && (
          <Pane width="100%" height="100%">
            <Spinner size={48} />
          </Pane>
        )}
        {!loading && (
          <Pane width="100%" textAlign="center">
            <SocialButton
              type="github"
              onClick={() => {
                signIn('github', { callbackUrl: `${process.env.NEXT_PUBLIC_API_HOST}/app` });
              }}
            />
          </Pane>
        )}
      </Pane>
    </Pane>
  );
};

export default Signin;
