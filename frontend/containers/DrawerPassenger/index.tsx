import React from 'react';
import { Drawer, Text, Box, Anchor } from '@mantine/core';
import { useTranslation } from 'next-i18next';
import DrawerPassengerHeader from './DrawerPassengerHeader';
import { getFormatedPhoneNumber } from '../../lib/phoneNumbers';
import { CountryIso2 } from 'react-international-phone';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  phoneCountry?: '' | CountryIso2;
}

const DrawerPassenger = ({ isOpen, onClose, lastName, firstName, email, phone, phoneCountry }: Props) => {
  const { t } = useTranslation();
  const isMobile = false; // simplified for Mantine; Drawer width handles responsiveness

  return (
    <Drawer opened={isOpen} onClose={onClose} position="right" padding="md" size={isMobile ? '100%' : 375}>
      <Box>
        <DrawerPassengerHeader isMobile={isMobile} onClose={onClose} />
        <Box style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 8 }}>
          <Box>
            <Text style={{fontWeight:600}}>{t('passenger.informations.name.label')}</Text>
            <Text style={{marginTop:4}}>{firstName}</Text>
          </Box>
          <Box>
            <Text style={{fontWeight:600}}>{t('passenger.informations.surname.label')}</Text>
            <Text style={{marginTop:4}}>{lastName}</Text>
          </Box>
          <Box>
            <Text style={{fontWeight:600}}>{t('passenger.informations.email.label')}</Text>
            <Anchor href={`mailto:${email}`}>{email}</Anchor>
          </Box>
          <Box>
            <Text style={{fontWeight:600}}>{t('passenger.informations.phone.label')}</Text>
            {phone ? (
              <Anchor href={`tel:${phone}`}>{phone}</Anchor>
            ) : (
              <Text style={{ color: 'gray' }}>{t('passenger.informations.notSpecify')}, {t('passenger.informations.byAdmin')}</Text>
            )}
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default DrawerPassenger;
