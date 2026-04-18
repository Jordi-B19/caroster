import {useReducer, useState, useMemo, useCallback, useEffect} from 'react';
import {useRouter} from 'next/router';
import {Container, Paper, Divider, Typography, IconButton, Box} from '../../components/mui-wrappers';
import {IconSettings, IconCheck, IconChevronRight, IconX} from '@tabler/icons-react';
// Icons are replaced by simple glyphs and Mantine wrappers during migration
import {Trans, useTranslation} from 'next-i18next';
import useToastStore from '../../stores/useToastStore';
import useEventStore from '../../stores/useEventStore';
import usePassengersActions from '../../hooks/usePassengersActions';
import RemoveDialog from '../RemoveDialog';
import AddPassengerButtons from '../AddPassengerButtons';
import AssignButton from './AssignButton';
import PassengersList from '../PassengersList';
// theme is no longer required directly here; Mantine handles theming via MantineProvider

interface Props {
  canAddSelf?: boolean;
  registered: boolean;
  onAddSelf: () => void;
  onAddOther: () => void;
}

const WaitingList = (props: Props) => {
  const {registered} = props;
  const {t} = useTranslation();
  const event = useEventStore(s => s.event);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setMobile(!!mq.matches);
    update();
    if (typeof mq.addEventListener === 'function') mq.addEventListener('change', update);
    else if (typeof (mq as any).addListener === 'function') (mq as any).addListener(update);
    return () => {
      if (typeof mq.removeEventListener === 'function') mq.removeEventListener('change', update);
      else if (typeof (mq as any).removeListener === 'function') (mq as any).removeListener(update);
    };
  }, []);
  const addToast = useToastStore(s => s.addToast);
  const router = useRouter();
  const [isEditing, toggleEditing] = useReducer(i => !i, false);
  const [removingPassenger, setRemovingPassenger] = useState(null);
  const travels = useMemo(
    () =>
      event?.travels?.data?.length > 0
        ? event?.travels?.data.slice().sort(sortTravels)
        : [],
    [event?.travels?.data]
  );
  const {removePassenger} = usePassengersActions();

  const availability = useMemo(() => {
    if (!travels) return;
    return travels.reduce((count, {attributes: {seats, passengers}}) => {
      if (!seats) return 0;
      else if (!passengers) return count + seats;
      return count + seats - passengers?.data?.length;
    }, 0);
  }, [travels]);

  const removePassengerCallback = useCallback(removePassenger, [
    event,
    removePassenger,
  ]);

  const onClickPassenger = useCallback(
    (passengerId: string) => {
      const selectedPassenger = event?.waitingPassengers?.data.find(
        item => item.id === passengerId
      );
      if (isEditing) setRemovingPassenger(selectedPassenger);
      else router.push(`/e/${event.uuid}/assign/${selectedPassenger.id}`);
    },
    [isEditing, event]
  );

  const onRemove = async () => {
    try {
      await removePassengerCallback(removingPassenger.id);
      addToast(t('passenger.deleted'));
    } catch (error) {
      console.error(error);
      addToast(t('passenger.errors.cant_remove_passenger'));
    }
  };

  return (
    <Container
      style={{marginTop: mobile ? 60 : 40, paddingLeft: mobile ? 16 : 32, paddingRight: mobile ? 16 : 32}}
    >
      <Paper style={{width: '480px', maxWidth: '100%', position: 'relative'}}> 
        <Box p={2}>
          <IconButton
            size="small"
            color="primary"
            style={{position: 'absolute', top: 0, right: 0, margin: 8}}
            disabled={!event?.waitingPassengers?.data?.length}
            onClick={toggleEditing}
            >
            {isEditing ? <IconCheck size={16} /> : <IconSettings size={16} />}
          </IconButton>
          <Typography variant="h5">{t('passenger.title')}</Typography>
          <Typography variant="overline" style={{display:'block'}}>
            {t('passenger.availability.seats', {count: availability})}
          </Typography>
        </Box>
        <Divider />
        <AddPassengerButtons
          onAddOther={props.onAddOther}
          onAddSelf={props.onAddSelf}
          travelId={event?.uuid ?? ''}
          registered={registered}
          variant="waitingList"
        />
        <Divider />
        {event?.waitingPassengers?.data?.length > 0 && (
          <PassengersList
            passengers={event.waitingPassengers.data}
            onClickPassenger={onClickPassenger}
            Actions={({passenger}) =>
              isEditing ? (
                <Box style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                  <IconButton size="small" color="primary" onClick={() => onClickPassenger(passenger.id)}>
                    <IconX size={14} />
                  </IconButton>
                </Box>
              ) : (
                <AssignButton
                  tabIndex={-1}
                  onClick={() => onClickPassenger(passenger.id)}
                />
              )
            }
          />
        )}
      </Paper>
      <RemoveDialog
        text={
          <Trans
            i18nKey="passenger.actions.remove_alert"
            values={{
              name: removingPassenger?.name,
            }}
            components={{italic: <i />, bold: <strong />}}
          />
        }
        open={!!removingPassenger}
        onClose={() => setRemovingPassenger(null)}
        onRemove={onRemove}
      />
    </Container>
  );
};

const sortTravels = (a, b) => {
  const dateA = new Date(a.departureDate).getTime();
  const dateB = new Date(b.departureDate).getTime();
  if (dateA === dateB)
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  else return dateA - dateB;
};

export default WaitingList;
