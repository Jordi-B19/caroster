import React from 'react';
import {Group, Title} from '@mantine/core';
import Toggle from '../../components/Toggle/index';
import {useTranslation} from 'next-i18next';
import {EventEntity} from '../../generated/graphql';
import useCreateTripAlert from './useCreateTripAlert';

interface Props {
  event: EventEntity;
  switchChecked: boolean;
  disabled: boolean;
  handleToggle: () => void;
}

const AlertsHeader = ({
  event,
  switchChecked,
  disabled,
  handleToggle,
}: Props) => {
  const {t} = useTranslation();
  const handleCreateTripAlert = useCreateTripAlert();

  const eventId = event.id;

  const handleToggleClick = async () => {
    if (!disabled) {
      await handleCreateTripAlert({
        eventId,
        enabled: !switchChecked,
      });
     handleToggle();
    }
  };

  return (
    <Group justify="space-between" align="center">
      <Title order={2}>{t('alert.title')}</Title>
      <Toggle
        activate={handleToggleClick}
        checked={switchChecked}
        disabled={disabled}
      />
    </Group>
  );
};

export default AlertsHeader;
