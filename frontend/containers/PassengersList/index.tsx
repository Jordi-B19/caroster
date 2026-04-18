import {List, Box} from '@mantine/core';
import Passenger from './Passenger';
import {PassengerEntity, TravelEntity} from '../../generated/graphql';
import {ReactNode} from 'react';

interface Props {
  passengers: PassengerEntity[];
  travel?: TravelEntity;
  onClickPassenger?: (passengerId: string) => void;
  Actions?: (props: {passenger: PassengerEntity}) => ReactNode;
}

const PassengersList = (props: Props) => {
  const {passengers, onClickPassenger, travel, Actions} = props;

  return (
    <Box pb={1}>
      <List>
        {passengers?.map((passenger, index) => (
          <List.Item
            key={index}
            onClick={() => onClickPassenger?.(passenger.id)}
            style={{ cursor: onClickPassenger ? 'pointer' : 'default' }}
          >
            <Passenger
              key={index}
              passenger={{
                id: passenger.id,
                attributes: {...passenger.attributes, travel: {data: travel}},
              }}
              isTravel={!!travel}
              Actions={Actions}
            />
          </List.Item>
        ))}
      </List>
    </Box>
  );
};

export default PassengersList;
