import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface CardProps {
  children: React.ReactNode;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  padding?: keyof typeof theme.spacing;
  onClick?: () => void;
}

const getElevation = (elevation: CardProps['elevation']) => {
  switch (elevation) {
    case 'none':
      return 'none';
    case 'sm':
      return theme.shadows.sm;
    case 'md':
      return theme.shadows.md;
    case 'lg':
      return theme.shadows.lg;
    default:
      return theme.shadows.md;
  }
};

const StyledCard = styled.div<CardProps>`
  background-color: ${theme.colors.background.paper};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${props => getElevation(props.elevation)};
  padding: ${props => theme.spacing[props.padding || 'lg']};
  transition: ${theme.transitions.default};
  cursor: ${props => props.onClick ? 'pointer' : 'default'};

  &:hover {
    box-shadow: ${props => props.onClick ? theme.shadows.lg : getElevation(props.elevation)};
    transform: ${props => props.onClick ? 'translateY(-2px)' : 'none'};
  }
`;

export const Card: React.FC<CardProps> = ({
  children,
  elevation = 'md',
  padding,
  onClick,
  ...props
}) => {
  return (
    <StyledCard
      elevation={elevation}
      padding={padding}
      onClick={onClick}
      {...props}
    >
      {children}
    </StyledCard>
  );
}; 