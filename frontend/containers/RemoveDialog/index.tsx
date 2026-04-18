import React from 'react';
import {Modal, Button, Text} from '@mantine/core';
import {useTranslation} from 'next-i18next';

const RemoveDialog = ({text, open, onClose, onRemove}) => {
  const {t} = useTranslation();

  return (
    <Modal opened={open} onClose={onClose} title={null} withCloseButton={false} padding="md">
      <div>{text}</div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
        <Button variant="outline" onClick={onClose} id="CarRemoveCancel">
          {t('generic.cancel')}
        </Button>
        <Button
          id="CarRemoveConfirm"
          onClick={() => {
            onRemove();
            onClose();
          }}
        >
          {t('generic.confirm')}
        </Button>
      </div>
    </Modal>
  );
};

export default RemoveDialog;
