// components/LinkButton.tsx
import React from 'react';
import { Button, ButtonProps } from 'react-native';
import { Link } from 'expo-router';

interface LinkButtonProps extends ButtonProps {
  to: string; 
}

const LinkButton: React.FC<LinkButtonProps> = ({ to, title, ...props }) => {
  return (
    <Link href={to} asChild>
      <Button title={title} {...props} />
    </Link> 
  );
};
    
export default LinkButton;
