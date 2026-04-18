import {PropsWithChildren} from 'react';
import { Box } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const MapWrapper = ({children}: PropsWithChildren) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return (
    <Box
      id="map"
      style={{ width: '100%', height: isMobile ? '60vh' : '50vh', paddingTop: isMobile ? 12 : 0 }}
    >
      {children}
    </Box>
  );
};

export default MapWrapper;
