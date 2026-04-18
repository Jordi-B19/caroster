import {useTranslation} from 'next-i18next';
import {Modal, Text, Button, Group} from '@mantine/core';
import useProfile from '../../hooks/useProfile';
import useEventStore from '../../stores/useEventStore';
import {PassengerEntity} from '../../generated/graphql';

interface Props {
  passenger: PassengerEntity;
  close: () => void;
  removePassenger: (id: string) => void;
}

const RemovePassengerModal = ({passenger, close, removePassenger}: Props) => {
  const {t} = useTranslation();
  const event = useEventStore(s => s.event);
  const isCarosterPlus = event.enabled_modules?.includes('caroster-plus');
  const {userId} = useProfile();
  const IsPassengerIsUser = passenger.attributes?.user?.data?.id === userId;

  const getDescriptionKey = () => {
    if (IsPassengerIsUser && isCarosterPlus) {
      return 'travel.removePassengerModal.plus.self.description';
    } else if (isCarosterPlus) {
      return 'travel.removePassengerModal.plus.description';
    } else if (IsPassengerIsUser) {
      return 'travel.removePassengerModal.self.description';
    } else {
      return 'travel.removePassengerModal.description';
    }
  };

  return (
    <Modal opened={!!passenger} onClose={close} title={IsPassengerIsUser ? t('travel.removePassengerModal.self.title') : t('travel.removePassengerModal.title')} withCloseButton>
      <Text mt="xs">{t(getDescriptionKey())}</Text>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
        <Button variant="outline" onClick={close}>
          {t('travel.removePassengerModal.cancel')}
        </Button>
        <Button onClick={() => { removePassenger(passenger.id); close(); }}>
          {t(IsPassengerIsUser ? 'travel.removePassengerModal.self.remove' : 'travel.removePassengerModal.remove')}
        </Button>
      </div>
    </Modal>
  );
};

export default RemovePassengerModal;
