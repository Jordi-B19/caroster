import {ReactNode} from 'react';
import { Box, Avatar, Text, Chip } from '@mantine/core';
import {useTranslation} from 'next-i18next';
import useProfile from '../../hooks/useProfile';
import {PassengerEntity} from '../../generated/graphql';
import usePermissions from '../../hooks/usePermissions';

interface Props {
  passenger?: PassengerEntity;
  isTravel?: boolean;
  Actions?: (props: {passenger: PassengerEntity}) => ReactNode;
}

const Passenger = (props: Props) => {
  const {passenger, isTravel, Actions} = props;
  const {t} = useTranslation();
  const {
    userPermissions: {canSeeFullName},
  } = usePermissions();

  const {userId} = useProfile();
  const isUser = `${userId}` === passenger?.attributes.user?.data?.id;

  if (passenger) {
    const initials = (passenger?.attributes?.name?.[0] ?? '?').toUpperCase();
    return (
      <Box style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar radius={28} size={28}>{initials}</Avatar>
          <Box style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <Text style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>
              {getPassengerName(passenger, canSeeFullName() || isUser)}
              {isUser && (
                <Chip size={"sm"} variant="outline" style={{ marginLeft: 6 }}>
                  {t('generic.me')}
                </Chip>
              )}
            </Text>
            {!isTravel && (
              <Text style={{ paddingTop: 2, color: 'gray' }}>{passenger.attributes.location}</Text>
            )}
          </Box>
        </Box>
        <Actions passenger={passenger} />
      </Box>
    );
  } else {
    return (
      <Box style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Avatar radius={12} size={16}>?</Avatar>
        <Text style={{ color: '#6b7280' }}>{t('travel.passengers.empty')}</Text>
      </Box>
    );
  }
};

const getPassengerName = (
  passenger: PassengerEntity,
  canSeeFullName: boolean
) => {
  const hideName = (name: string) => (canSeeFullName ? name : `${name[0]}.`);

  if (passenger.attributes.name && passenger.attributes.lastname)
    return `${passenger.attributes.name} ${hideName(
      passenger.attributes.lastname
    )}`;

  const linkedUser = passenger.attributes?.user?.data?.attributes;
  if (linkedUser?.firstName && linkedUser?.lastName)
    return `${linkedUser.firstName} ${hideName(linkedUser.lastName)}`;

  return passenger.attributes.name;
};

export default Passenger;
