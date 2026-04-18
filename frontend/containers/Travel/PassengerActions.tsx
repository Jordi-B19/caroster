import {useState} from 'react';
import {Box, IconButton} from '../../components/mui-wrappers';
import {IconTrash} from '@tabler/icons-react';
import usePermissions from '../../hooks/usePermissions';
import RemovePassengerModal from './RemovePassengerModal';
import useActions from './useActions';
import {PassengerEntity, TravelEntity} from '../../generated/graphql';

type Props = {
  passenger: PassengerEntity;
  travel: TravelEntity;
  setFocusPassenger: (passenger: PassengerEntity) => void;
};

const PassengerActions = (props: Props) => {
  const {passenger, travel, setFocusPassenger} = props;
  const [isRemovingPassenger, setIsRemovingPassenger] = useState(false);
  const {
    userPermissions: {canDeletePassenger, canSeePassengerDetails},
  } = usePermissions();
  const {removePassengerFromTravel} = useActions({travel});

  return (
    <>
      <Box style={{ display: 'flex' }}>
        {canDeletePassenger(passenger) && (
          <IconButton color="primary" onClick={() => setIsRemovingPassenger(true)} tabIndex={-1}>
            <span role="img" aria-label="delete">🗑️</span>
          </IconButton>
        )}
        {canSeePassengerDetails(passenger) && (
          <IconButton color="primary" onClick={() => setFocusPassenger(passenger)}>
            <span role="img" aria-label="info">ℹ️</span>
          </IconButton>
        )}
      </Box>
      <RemovePassengerModal
        passenger={isRemovingPassenger && passenger}
        close={() => setIsRemovingPassenger(false)}
        removePassenger={removePassengerFromTravel}
      />
    </>
  );
};

export default PassengerActions;
