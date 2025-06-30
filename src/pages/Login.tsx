import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { Input } from '../components/shared/Input';
import { useAuth } from '../App';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.background.default};
  padding: ${theme.spacing.xl};
`;

const LoginCard = styled(Card)`
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

const ForgotPassword = styled(Link)`
  color: ${theme.colors.primary.main};
  text-decoration: none;
  font-size: ${theme.typography.body2.fontSize};
  align-self: flex-end;
  transition: ${theme.transitions.default};

  &:hover {
    color: ${theme.colors.primary.dark};
    text-decoration: underline;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: ${theme.spacing.xl} 0;
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.body2.fontSize};

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: ${theme.colors.border.light};
  }

  span {
    padding: 0 ${theme.spacing.md};
  }
`;

const RegisterLink = styled.div`
  margin-top: ${theme.spacing.xl};
  padding-top: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.border.light};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.body1.fontSize};

  a {
    color: ${theme.colors.primary.main};
    text-decoration: none;
    font-weight: 500;
    transition: ${theme.transitions.default};

    &:hover {
      color: ${theme.colors.primary.dark};
      text-decoration: underline;
    }
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

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/my-files');
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : 'Ошибка входа. Проверьте email и пароль.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard elevation="lg">
        <Logo>
          <i className="fas fa-graduation-cap"></i>
          Университет
        </Logo>
        
        <Title>Вход в систему</Title>
        <Subtitle>Войдите в свой аккаунт для доступа к файлам</Subtitle>

        {generalError && <ErrorMessage>{generalError}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Input
              type="email"
              name="email"
              label="Email"
              placeholder="Введите ваш email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              startIcon={<i className="fas fa-envelope"></i>}
              fullWidth
              required
            />
          </FormGroup>

          <FormGroup>
            <Input
              type="password"
              name="password"
              label="Пароль"
              placeholder="Введите ваш пароль"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              startIcon={<i className="fas fa-lock"></i>}
              fullWidth
              required
            />
            <ForgotPassword to="/forgot-password">
              Забыли пароль?
            </ForgotPassword>
          </FormGroup>

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            disabled={isLoading}
            startIcon={isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-sign-in-alt"></i>}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>
        </Form>

        <Divider>
          <span>или</span>
        </Divider>

        <RegisterLink>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </RegisterLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login; 