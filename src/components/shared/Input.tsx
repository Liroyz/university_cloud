import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const InputWrapper = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
`;

const Label = styled.label`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.body2.fontSize};
  font-weight: 500;
`;

const InputContainer = styled.div<{ hasError?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;

  input {
    width: 100%;
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    padding-left: ${props => props.children ? theme.spacing.xl : theme.spacing.md};
    padding-right: ${props => props.children ? theme.spacing.xl : theme.spacing.md};
    border: 1px solid ${props => props.hasError ? theme.colors.error.main : theme.colors.border.main};
    border-radius: ${theme.borderRadius.md};
    font-size: ${theme.typography.body1.fontSize};
    color: ${theme.colors.text.primary};
    background-color: ${theme.colors.background.paper};
    transition: ${theme.transitions.default};

    &:focus {
      outline: none;
      border-color: ${props => props.hasError ? theme.colors.error.main : theme.colors.primary.main};
      box-shadow: 0 0 0 2px ${props => props.hasError ? theme.colors.error.light + '40' : theme.colors.primary.light + '40'};
    }

    &::placeholder {
      color: ${theme.colors.text.disabled};
    }

    &:disabled {
      background-color: ${theme.colors.background.default};
      cursor: not-allowed;
    }
  }

  .start-icon {
    position: absolute;
    left: ${theme.spacing.md};
    color: ${theme.colors.text.secondary};
    display: flex;
    align-items: center;
  }

  .end-icon {
    position: absolute;
    right: ${theme.spacing.md};
    color: ${theme.colors.text.secondary};
    display: flex;
    align-items: center;
  }
`;

const ErrorText = styled.span`
  color: ${theme.colors.error.main};
  font-size: ${theme.typography.body2.fontSize};
`;

export const Input: React.FC<InputProps> = ({
  label,
  error,
  startIcon,
  endIcon,
  fullWidth = false,
  ...props
}) => {
  return (
    <InputWrapper fullWidth={fullWidth}>
      {label && <Label>{label}</Label>}
      <InputContainer hasError={!!error}>
        {startIcon && <span className="start-icon">{startIcon}</span>}
        <input {...props} />
        {endIcon && <span className="end-icon">{endIcon}</span>}
      </InputContainer>
      {error && <ErrorText>{error}</ErrorText>}
    </InputWrapper>
  );
}; 