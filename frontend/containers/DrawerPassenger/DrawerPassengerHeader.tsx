import React from 'react';
import { Box, Button, Text } from '@mantine/core';
import { useTranslation } from 'next-i18next';

interface DrawerHeaderProps {
  isMobile: boolean;
  onClose: () => void;
}

const DrawerPassengerHeader: React.FC<DrawerHeaderProps> = ({ isMobile, onClose }) => {
  const { t } = useTranslation();

  return (
    <Box style={{ padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {isMobile ? (
        <Button variant="light" size="xs" onClick={onClose} aria-label="close">&larr;</Button>
      ) : (
        <Box style={{ width: 40 }} />
      )}
      <Text style={{ fontWeight: 700, fontSize: 20, flex: 1, textAlign: 'center' }}>
        {t('passenger.informations.title')}
      </Text>
      <Box style={{ width: 40 }} />
    </Box>
  );
};

export default DrawerPassengerHeader;
