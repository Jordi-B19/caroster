import React from 'react';
// Mantine imports used to simulate MUI components via thin adapters
import {
  Button as MantineButton,
  Container as MantineContainer,
  Box as MantineBox,
  Paper as MantinePaper,
  Divider as MantineDivider,
  Text as MantineText,
  Title as MantineTitle,
  ActionIcon as MantineActionIcon,
  TextInput as MantineTextInput,
} from '@mantine/core';
import { useMediaQuery as useMantineMediaQuery } from '@mantine/hooks';

// Simple mapping helpers to bridge common MUI props to Mantine components.
// This wrapper set is intentionally lightweight to enable a staged migration.

type ButtonProps = React.ComponentProps<typeof MantineButton> & {
  variant?: 'text' | 'outlined' | 'contained';
  color?: string;
  size?: 'small' | 'medium' | 'large';
};
export const Button: React.FC<ButtonProps> = ({ variant, color, size, ...rest }) => {
  let mVariant: any = 'filled';
  if (variant === 'outlined') mVariant = 'outline';
  if (variant === 'text') mVariant = 'subtle';
  // Map MUI primary color to Mantine's teal (as defined in theme)
  const mColor = color === 'primary' ? 'teal' : color;
  const mSize = size === 'small' ? 'sm' : size === 'large' ? 'md' : 'md';
  return <MantineButton variant={mVariant} color={mColor as any} size={mSize as any} {...rest} />;
};

type TextFieldProps = React.ComponentProps<typeof MantineTextInput> & {
  label?: string;
  variant?: 'outlined' | 'filled' | 'standard';
};
export const TextField: React.FC<TextFieldProps> = ({ label, variant, ...rest }) => {
  // Mantine's TextInput does not expose an exact variant prop like MUI; we ignore variant for now
  return <MantineTextInput label={label} {...rest} />;
};

export const Container: React.FC<any> = (props) => <MantineContainer {...props} />;
export const Box: React.FC<any> = (props) => <MantineBox {...props} />;
export const Paper: React.FC<any> = (props) => <MantinePaper {...props} />;
export const Divider: React.FC<any> = (props) => <MantineDivider {...props} />;
export const Typography: React.FC<any> = ({ variant, children, ...rest }) => {
  // Map h1-h6 to Mantine Title orders, otherwise fall back to Mantine Text
  if (variant && /^h[1-6]$/.test(variant)) {
    const order = parseInt(variant[1], 10);
    return <MantineTitle order={order as any} {...rest}>{children}</MantineTitle>;
  }
  return <MantineText {...rest}>{children}</MantineText>;
};
export const IconButton: React.FC<any> = (props) => {
  // Map to Mantine's ActionIcon for icon-only buttons
  const { children, ...rest } = props;
  return <MantineActionIcon {...rest}>{children}</MantineActionIcon>;
};
export const Icon: React.FC<any> = (props) => {
  // Expose a generic wrapper around icons (provided as children)
  const { children, ...rest } = props;
  return <span {...rest}>{children}</span>;
};
export { useMantineMediaQuery as useMediaQuery };
export { MantineTextInput as TextInput };
export default {};
