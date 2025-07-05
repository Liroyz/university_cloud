import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const getVariantStyles = (variant: ButtonVariant) => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: ${theme.colors.primary.main};
        color: ${theme.colors.primary.contrast};
        &:hover {
          background-color: ${theme.colors.primary.dark};
        }
      `;
    case 'secondary':
      return css`
        background-color: ${theme.colors.secondary.main};
        color: ${theme.colors.secondary.contrast};
        &:hover {
          background-color: ${theme.colors.secondary.dark};
        }
      `;
    case 'outlined':
      return css`
        background-color: transparent;
        color: ${theme.colors.primary.main};
        border: 1px solid ${theme.colors.primary.main};
        &:hover {
          background-color: ${theme.colors.primary.main}10;
        }
      `;
    case 'text':
      return css`
        background-color: transparent;
        color: ${theme.colors.primary.main};
        padding: ${theme.spacing.xs} ${theme.spacing.sm};
        &:hover {
          background-color: ${theme.colors.primary.main}10;
        }
      `;
  }
};

const getSizeStyles = (size: ButtonSize) => {
  switch (size) {
    case 'small':
      return css`
        padding: ${theme.spacing.xs} ${theme.spacing.md};
        font-size: ${theme.typography.body2.fontSize};
      `;
    case 'medium':
      return css`
        padding: ${theme.spacing.sm} ${theme.spacing.lg};
        font-size: ${theme.typography.button.fontSize};
      `;
    case 'large':
      return css`
        padding: ${theme.spacing.md} ${theme.spacing.xl};
        font-size: ${theme.typography.body1.fontSize};
      `;
  }
};

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.button.fontWeight};
  cursor: pointer;
  transition: ${theme.transitions.default};
  width: ${props => props.fullWidth ? '100%' : 'auto'};

  ${props => getVariantStyles(props.variant || 'primary')}
  ${props => getSizeStyles(props.size || 'medium')}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  startIcon,
  endIcon,
  fullWidth = false,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      {...props}
    >
      {startIcon && <span className="icon">{startIcon}</span>}
      {children}
      {endIcon && <span className="icon">{endIcon}</span>}
    </StyledButton>
  );
}; 