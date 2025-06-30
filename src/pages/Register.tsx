import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { Input } from '../components/shared/Input';
import { useAuth } from '../App';

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.background.default};
  padding: ${theme.spacing.xl};
`;

const RegisterCard = styled(Card)`
  width: 100%;
  max-width: 500px;
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

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const RoleSelector = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.sm};
`;

const RoleOption = styled.label<{ selected: boolean }>`
  flex: 1;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${props => props.selected ? theme.colors.primary.main : theme.colors.border.main};
  border-radius: ${theme.borderRadius.md};
  background-color: ${props => props.selected ? theme.colors.primary.main + '10' : theme.colors.background.paper};
  color: ${props => props.selected ? theme.colors.primary.main : theme.colors.text.primary};
  cursor: pointer;
  transition: ${theme.transitions.default};
  text-align: center;
  font-size: ${theme.typography.body2.fontSize};
  font-weight: 500;

  &:hover {
    border-color: ${theme.colors.primary.main};
    background-color: ${theme.colors.primary.main}10;
  }

  input {
    display: none;
  }
`;

const TermsCheckbox = styled.label`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.sm};
  cursor: pointer;
  font-size: ${theme.typography.body2.fontSize};
  color: ${theme.colors.text.secondary};

  input[type="checkbox"] {
    margin-top: 2px;
    accent-color: ${theme.colors.primary.main};
  }

  a {
    color: ${theme.colors.primary.main};
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
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

const LoginLink = styled.div`
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

const SuccessMessage = styled.div`
  color: ${theme.colors.success.main};
  background-color: ${theme.colors.success.light}20;
  border: 1px solid ${theme.colors.success.light};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.body2.fontSize};
  margin-bottom: ${theme.spacing.md};
`;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    acceptTerms: false
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRoleChange = (role: string) => {
    setFormData(prev => ({
      ...prev,
      role
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Имя обязательно';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Фамилия обязательна';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Подтверждение пароля обязательно';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Необходимо принять условия использования';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, acceptTerms, ...registerData } = formData;
      await register(registerData);
      setSuccessMessage('Регистрация успешно завершена! Перенаправление...');
      
      // Navigate to main page after successful registration
      setTimeout(() => {
        navigate('/my-files');
      }, 1500);
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : 'Ошибка регистрации. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard elevation="lg">
        <Logo>
          <i className="fas fa-graduation-cap"></i>
          Университет
        </Logo>
        
        <Title>Регистрация</Title>
        <Subtitle>Создайте аккаунт для доступа к университетской системе</Subtitle>

        {generalError && <ErrorMessage>{generalError}</ErrorMessage>}
        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

        <Form onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Input
                type="text"
                name="firstName"
                label="Имя"
                placeholder="Введите ваше имя"
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                startIcon={<i className="fas fa-user"></i>}
                fullWidth
                required
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="text"
                name="lastName"
                label="Фамилия"
                placeholder="Введите вашу фамилию"
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
                startIcon={<i className="fas fa-user"></i>}
                fullWidth
                required
              />
            </FormGroup>
          </FormRow>

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

          <FormRow>
            <FormGroup>
              <Input
                type="password"
                name="password"
                label="Пароль"
                placeholder="Создайте пароль"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                startIcon={<i className="fas fa-lock"></i>}
                fullWidth
                required
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                name="confirmPassword"
                label="Подтверждение пароля"
                placeholder="Повторите пароль"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
                startIcon={<i className="fas fa-lock"></i>}
                fullWidth
                required
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <label style={{ color: theme.colors.text.secondary, fontSize: theme.typography.body2.fontSize, fontWeight: 500 }}>
              Роль в системе
            </label>
            <RoleSelector>
              <RoleOption selected={formData.role === 'student'}>
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={formData.role === 'student'}
                  onChange={() => handleRoleChange('student')}
                />
                <i className="fas fa-user-graduate"></i> Студент
              </RoleOption>
              <RoleOption selected={formData.role === 'teacher'}>
                <input
                  type="radio"
                  name="role"
                  value="teacher"
                  checked={formData.role === 'teacher'}
                  onChange={() => handleRoleChange('teacher')}
                />
                <i className="fas fa-chalkboard-teacher"></i> Преподаватель
              </RoleOption>
            </RoleSelector>
          </FormGroup>

          <FormGroup>
            <TermsCheckbox>
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
              />
              <span>
                Я принимаю <a href="/terms" target="_blank">условия использования</a> и{' '}
                <a href="/privacy" target="_blank">политику конфиденциальности</a>
              </span>
            </TermsCheckbox>
            {errors.acceptTerms && (
              <span style={{ color: theme.colors.error.main, fontSize: theme.typography.body2.fontSize }}>
                {errors.acceptTerms}
              </span>
            )}
          </FormGroup>

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            disabled={isLoading}
            startIcon={isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-user-plus"></i>}
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </Form>

        <Divider>
          <span>или</span>
        </Divider>

        <LoginLink>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register; 