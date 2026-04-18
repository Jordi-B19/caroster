import {Box} from '@mantine/core';
import theme from '../../theme';

const Logo = () => {
  return (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '8px',
      }}
    >
      <Box
        component="img"
        src={'/assets/logo.svg'}
        alt="Caroster"
        style={{
          display: 'block',
          width: '68px',
          height: 'auto',
          margin: '0 auto',
        }}
      />
    </Box>
  );
};

export default Logo;
