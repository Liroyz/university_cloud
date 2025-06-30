import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { Input } from '../components/shared/Input';
import { useAuth } from '../App';
import { authService } from '../services/authService';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  margin-bottom: ${theme.spacing.xl};
  text-align: center;
`;

const Title = styled.h1`
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.h2.fontSize};
  font-weight: ${theme.typography.h2.fontWeight};
  margin-bottom: ${theme.spacing.md};
`;

const Subtitle = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.body1.fontSize};
`;

const ProfileSection = styled(Card)`
  margin-bottom: ${theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.h3.fontSize};
  font-weight: ${theme.typography.h3.fontWeight};
  margin-bottom: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
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

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: ${theme.borderRadius.round};
  background-color: ${theme.colors.primary.main};
  color: ${theme.colors.primary.contrast};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 600;
  border: 4px solid ${theme.colors.border.light};
`;

const AvatarInfo = styled.div`
  flex: 1;
`;

const AvatarTitle = styled.h3`
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.h4.fontSize};
  font-weight: ${theme.typography.h4.fontWeight};
  margin-bottom: ${theme.spacing.sm};
`;

const AvatarDescription = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.body2.fontSize};
  margin-bottom: ${theme.spacing.md};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${theme.spacing.lg};
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

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm} 0;
  border-bottom: 1px solid ${theme.colors.border.light};

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  color: ${theme.colors.text.secondary};
  font-weight: 500;
`;

const InfoValue = styled.span`
  color: ${theme.colors.text.primary};
`;

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await authService.updateProfile(formData);
      setSuccess('Профиль успешно обновлен');
      setIsEditing(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ошибка обновления профиля');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
      email: user?.email || ''
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const getUserInitials = () => {
    if (!user) return '?';
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getUserRoleText = () => {
    if (!user) return 'Гость';
    switch (user.role) {
      case 'student':
        return 'Студент';
      case 'teacher':
        return 'Преподаватель';
      case 'admin':
        return 'Администратор';
      default:
        return 'Пользователь';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <ProfileContainer>
        <ProfileHeader>
          <Title>Профиль не найден</Title>
        </ProfileHeader>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <Title>Мой профиль</Title>
        <Subtitle>Управление личной информацией и настройками аккаунта</Subtitle>
      </ProfileHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <ProfileSection>
        <SectionTitle>
          <i className="fas fa-user"></i>
          Личная информация
        </SectionTitle>

        <AvatarSection>
          <Avatar>
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            ) : (
              getUserInitials()
            )}
          </Avatar>
          <AvatarInfo>
            <AvatarTitle>{user.first_name} {user.last_name}</AvatarTitle>
            <AvatarDescription>
              {getUserRoleText()} • Аккаунт создан {formatDate(user.created_at)}
            </AvatarDescription>
            <Button
              variant="outlined"
              size="small"
              startIcon={<i className="fas fa-camera"></i>}
            >
              Изменить фото
            </Button>
          </AvatarInfo>
        </AvatarSection>

        {isEditing ? (
          <Form onSubmit={handleSave}>
            <FormRow>
              <FormGroup>
                <Input
                  type="text"
                  name="firstName"
                  label="Имя"
                  value={formData.firstName}
                  onChange={handleInputChange}
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
                  value={formData.lastName}
                  onChange={handleInputChange}
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
                value={formData.email}
                onChange={handleInputChange}
                startIcon={<i className="fas fa-envelope"></i>}
                fullWidth
                required
              />
            </FormGroup>
            <ButtonGroup>
              <Button
                type="button"
                variant="outlined"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                startIcon={isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
              >
                {isLoading ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </ButtonGroup>
          </Form>
        ) : (
          <>
            <div>
              <InfoItem>
                <InfoLabel>Имя</InfoLabel>
                <InfoValue>{user.first_name}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Фамилия</InfoLabel>
                <InfoValue>{user.last_name}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>{user.email}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Роль</InfoLabel>
                <InfoValue>{getUserRoleText()}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Дата регистрации</InfoLabel>
                <InfoValue>{formatDate(user.created_at)}</InfoValue>
              </InfoItem>
            </div>
            <ButtonGroup>
              <Button
                variant="primary"
                onClick={() => setIsEditing(true)}
                startIcon={<i className="fas fa-edit"></i>}
              >
                Редактировать
              </Button>
            </ButtonGroup>
          </>
        )}
      </ProfileSection>

      <ProfileSection>
        <SectionTitle>
          <i className="fas fa-shield-alt"></i>
          Безопасность
        </SectionTitle>
        <div>
          <InfoItem>
            <InfoLabel>Пароль</InfoLabel>
            <Button
              variant="outlined"
              size="small"
              startIcon={<i className="fas fa-key"></i>}
            >
              Изменить пароль
            </Button>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Двухфакторная аутентификация</InfoLabel>
            <Button
              variant="outlined"
              size="small"
              startIcon={<i className="fas fa-mobile-alt"></i>}
            >
              Настроить
            </Button>
          </InfoItem>
        </div>
      </ProfileSection>
    </ProfileContainer>
  );
};

export default Profile; 