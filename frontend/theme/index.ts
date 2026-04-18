import { createTheme } from '@mantine/core';

export default createTheme({
  primaryColor: 'teal',
  fontFamily: 'Inter, sans-serif',
  headings: {
    h1: { fontSize: '27px', fontWeight: 600, lineHeight: '37.8px' },
    h2: { fontSize: '25.23px', fontWeight: 600, lineHeight: '35.32px' },
    h3: { fontSize: '22.42px', fontWeight: 600, lineHeight: '31.39px' },
    h4: { fontSize: '19px', fontWeight: 500, lineHeight: '26.6px' },
    h5: { fontSize: '17.72px', fontWeight: 400, lineHeight: '24.8px' },
    h6: { fontSize: '15.75px', fontWeight: 500, lineHeight: '22.1px' },
  },
  components: {
    Text: {
      styles: (theme) => ({
        root: {
          fontSize: '14px',
          lineHeight: '19.6px',
        },
      }),
    },
  },
});
