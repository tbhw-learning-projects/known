import React, { FC, useState } from 'react';
import { Pane, Dialog, majorScale } from 'evergreen-ui';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/client';
import Logo from '../../components/logo';
import FolderList from '../../components/folderList';
import NewFolderButton from '../../components/newFolderButton';
import User from '../../components/user';
import FolderPane from '../../components/folderPane';
import DocPane from '../../components/docPane';
import NewFolderDialog from '../../components/newFolderDialog';
import { connectToDB, doc, folder } from '../../db';
import { GetServerSideProps } from 'next';
import { UserSession } from '../../types';

interface AppProps {
  folders?: any[];
  activeFolder?: any;
  activeDoc?: any;
  activeDocs?: any[];
}

const App: FC<AppProps> = ({
  folders,
  activeDoc,
  activeFolder,
  activeDocs,
  // session
}) => {
  const router = useRouter();
  const [session, loading] = useSession();
  const [newFolderIsShown, setIsShown] = useState(false);
  const [allFolders, setAllFolders] = useState(folders);

  async function handleNewFolder(name: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/folder`, {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { data } = await res.json();
    setAllFolders((f) => [...f, data]);
  }

  if (loading) return null;

  const Page = () => {
    if (activeDoc) {
      return <DocPane folder={activeFolder} doc={activeDoc} />;
    }

    if (activeFolder) {
      return <FolderPane folder={activeFolder} docs={activeDocs} />;
    }

    return null;
  };

  if (!loading && !session) {
    return (
      <Dialog
        isShown
        title="Session expired"
        confirmLabel="Ok"
        hasCancel={false}
        hasClose={false}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEscapePress={false}
        onConfirm={() => router.push('/signin')}
      >
        Sign in to continue
      </Dialog>
    );
  }

  return (
    <Pane position="relative">
      <Pane width={300} position="absolute" top={0} left={0} background="tint2" height="100vh" borderRight>
        <Pane padding={majorScale(2)} display="flex" alignItems="center" justifyContent="space-between">
          <Logo />

          <NewFolderButton onClick={() => setIsShown(true)} />
        </Pane>
        <Pane>{folders.length === 0 ? null : <FolderList folders={allFolders} />}</Pane>
      </Pane>
      <Pane marginLeft={300} width="calc(100vw - 300px)" height="100vh" overflowY="auto" position="relative">
        <User user={(session.user as unknown) as UserSession} />
        <Page />
      </Pane>
      <NewFolderDialog close={() => setIsShown(false)} isShown={newFolderIsShown} onNewFolder={handleNewFolder} />
    </Pane>
  );
};

App.defaultProps = {
  folders: [],
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  // not signed in
  if (!session || !session.user) {
    return { props: {} };
  }

  const props: any = { session };
  const { db } = await connectToDB();
  const folders = await folder.getFolders(db, session.user.id as string);
  props.folders = folders;

  if (context.params.id) {
    const activeFolder = folders.find((f) => f._id === context.params.id[0]);
    const activeDocs = await doc.getDocsByFolder(db, activeFolder._id);
    props.activeFolder = activeFolder;
    props.activeDocs = activeDocs;

    const activeDocId = context.params.id[1];

    if (activeDocId) {
      props.activeDoc = await doc.getOneDoc(db, activeDocId);
    }
  }

  console.log(props);

  return {
    props,
  };
};

/**
 * Catch all handler. Must handle all different page
 * states.
 * 1. Folders - none selected
 * 2. Folders => Folder selected
 * 3. Folders => Folder selected => Document selected
 *
 * An unauth user should not be able to access this page.
 *
 * @param context
 */
export default App;
