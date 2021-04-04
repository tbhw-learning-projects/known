import React, { useState } from 'react';
import { Dialog, TextInput } from 'evergreen-ui';

interface NewFolderDialogProps {
  onNewFolder: (s: string) => Promise<void>;
  close: () => void;
  [props: string]: React.ReactNode;
}

const NewFolderDialog = ({ onNewFolder, close, ...props }: NewFolderDialogProps): JSX.Element => {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleNewFolder = async () => {
    setSaving(true);
    await onNewFolder(name);
    setSaving(false);
    setName('');
    close();
  };

  return (
    <Dialog
      {...props}
      title="New Folder"
      confirmLabel="create"
      intent="success"
      onConfirm={handleNewFolder}
      isConfirmLoading={saving}
      onCancel={close}
      onCloseComplete={close}
    >
      <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="folder name" />
    </Dialog>
  );
};

export default NewFolderDialog;
