import React from 'react';
import {Switch, SwitchProps} from '@mantine/core';

interface Props extends SwitchProps {
  activate: () => void;
  checked: boolean;
}

const Toggle = ({activate, checked, ...props}: Props) => {
  return (
    <Switch
      checked={checked}
      onChange={activate}
      styles={{
        switch: {
          width: 42,
          height: 26,
        },
        thumb: {
          width: 22,
          height: 22,
        },
        track: {
          borderRadius: 13,
          backgroundColor: '#E9E9EA',
        },
      }}
      {...props}
    />
  );
};

export default Toggle;
