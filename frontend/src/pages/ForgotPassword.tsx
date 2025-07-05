import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { Input } from '../components/shared/Input';
import { authService } from '../services/authService';

const ForgotPasswordContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.background.default};
  padding: ${theme.spacing.xl};
`;

const ForgotPasswordCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Logo = styled.div`
  color: ${theme.colors.primary.main};
  font-size: ${theme.typography.h2.fontSize};
  font-weight: ${theme.typography.h2.fontWeight};
  margin-bottom: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};

  i {
    font-size: 1.2em;
  }
`;

const Title = styled.h1`
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.h3.fontSize};
  font-weight: ${theme.typography.h3.fontWeight};
  margin-bottom: ${theme.spacing.md};
`;

const Subtitle = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.body1.fontSize};
  margin-bottom: ${theme.spacing.xl};
  line-height: 1.6;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const BackToLogin = styled(Link)`
  color: ${theme.colors.primary.main};
  text-decoration: none;
  font-size: ${theme.typography.body1.fontSize};
  font-weight: 500;
  transition: ${theme.transitions.default};

  &:hover {
    color: ${theme.colors.primary.dark};
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error.main};
  background-color: ${theme.colors.error.light}20;
  border: 1px solid ${theme.colors.error.light};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.body2.fontSize};
  margin-bottom: ${theme.spacing.md};
`;

const SuccessMessage = styled.div`
  color: ${theme.colors.success.main};
  background-color: ${theme.colors.success.light}20;
  border: 1px solid ${theme.colors.success.light};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.body2.fontSize};
  margin-bottom: ${theme.spacing.md};
`;

const InfoBox = styled.div`
  background-color: ${theme.colors.info.light}20;
  border: 1px solid ${theme.colors.info.light};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  font-size: ${theme.typography.body2.fontSize};
  color: ${theme.colors.info.dark};
  margin-bottom: ${theme.spacing.md};
  text-align: left;
`;

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const validateEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Email обязателен');
      return;
    }

    if (!validateEmail(email)) {
      setError('Введите корректный email');
      return;
    }

    setIsLoading(true);

    try {
      await authService.requestPasswordReset(email);
      setSuccess('Инструкции по сбросу пароля отправлены на ваш email');
      setEmail('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ForgotPasswordContainer>
      <ForgotPasswordCard elevation="lg">
        <Logo>
          <i className="fas fa-graduation-cap"></i>
          Университет
        </Logo>
        
        <Title>Забыли пароль?</Title>
        <Subtitle>
          Введите ваш email, и мы отправим инструкции по восстановлению пароля
        </Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        {!success && (
          <>
            <InfoBox>
              <i className="fas fa-info-circle"></i>
              {' '}Проверьте папку "Спам" в вашей почте, если не получили письмо в течение нескольких минут.
            </InfoBox>

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Input
                  type="email"
                  name="email"
                  label="Email"
                  placeholder="Введите ваш email"
                  value={email}
                  onChange={handleEmailChange}
                  startIcon={<i className="fas fa-envelope"></i>}
                  fullWidth
                  required
                />
              </FormGroup>

              <Button
                type="submit"
                variant="primary"
                size="large"
                fullWidth
                disabled={isLoading}
                startIcon={isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
              >
                {isLoading ? 'Отправка...' : 'Отправить инструкции'}
              </Button>
            </Form>
          </>
        )}

        <BackToLogin to="/login">
          <i className="fas fa-arrow-left"></i> Вернуться к входу
        </BackToLogin>
      </ForgotPasswordCard>
    </ForgotPasswordContainer>
  );
};

export default ForgotPassword; 