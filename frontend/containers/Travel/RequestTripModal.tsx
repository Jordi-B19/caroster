import {useTranslation} from 'next-i18next';
import {Modal, Text, Button, Box, TextInput} from '@mantine/core';
import {PhoneInput} from '../../components/PhoneInput';
import {useEffect, useState} from 'react';
import useProfile from '../../hooks/useProfile';
import useAddToEvents from '../../hooks/useAddToEvents';
import useToastStore from '../../stores/useToastStore';
import useEventStore from '../../stores/useEventStore';
import {validateEmail} from '../../lib/validation';
import {
  TravelEntity,
  useCreatePassengerMutation,
} from '../../generated/graphql';

interface Props {
  open: boolean;
  toggle: () => void;
  travel: TravelEntity;
}

const RequestTripModal = ({open, toggle, travel}: Props) => {
  const {t} = useTranslation();
  const {profile, userId} = useProfile();
  const [createPassenger] = useCreatePassengerMutation();
  const [email, setEmail] = useState('');
  useEffect(() => {
    setEmail(profile?.email || '');
  }, [profile?.email]);
  const [phone, setPhone] = useState('');
  const [phoneCountry, setPhoneCountry] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const {event} = useEventStore();
  const {addToEvent} = useAddToEvents();
  const addToast = useToastStore(s => s.addToast);
  const isEmailValid = validateEmail(email);
  const emailError = email !== '' && !isEmailValid;

  const onSubmit = async () => {
    const hasName = profile.firstName && profile.lastName;
    const userName = profile.firstName + ' ' + profile.lastName;
    try {
      await createPassenger({
        variables: {
          passenger: {
            user: userId,
            email,
            phone,
            phoneCountry,
            name: hasName ? userName : profile.username,
            travel: travel.id,
            event: event.id,
          },
        },
        refetchQueries: ['eventByUUID'],
      });
      addToEvent(event.id);
      addToast(t('passenger.success.added_self_to_car'));
      toggle();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal opened={open} onClose={toggle} title={t('travel.requestTrip.title')} withCloseButton>
      <Text style={{ marginBottom: 16 }}>{t('travel.requestTrip.description')}</Text>
      <Box py={2}>
        <PhoneInput
          value={phone}
          onChange={({phone, country, error}) => {
            setPhone(phone);
            setPhoneCountry(country);
            setPhoneError(error);
          }}
          label={t('travel.requestTrip.phone')}
        />
      </Box>
      <TextInput
        label={t('travel.requestTrip.email')}
        value={email}
        onChange={e => setEmail((e.target as HTMLInputElement).value)}
        error={emailError || phoneError}
        placeholder={t('travel.requestTrip.email')}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
        <Button variant="outline" onClick={toggle}>
          {t('generic.cancel')}
        </Button>
        <Button onClick={onSubmit} disabled={emailError || phoneError}>
          {t('travel.requestTrip.send')}
        </Button>
      </div>
    </Modal>
  );
};

export default RequestTripModal;
