import React, { useState } from 'react';
import styled from 'styled-components';

const ContentHeader = styled.header`
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: #333;
  }
`;

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SettingsSection = styled.section`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;

  .header-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e3f2fd;
    border-radius: 8px;
    color: #1976d2;
    font-size: 1.25rem;
  }

  h2 {
    margin: 0;
    font-size: 1.25rem;
    color: #333;
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ProfileAvatar = styled.div`
  position: relative;
  width: 100px;
  height: 100px;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  .avatar-edit {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #1976d2;
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;

    &:hover {
      background-color: #1565c0;
    }
  }
`;

const ProfileInfo = styled.div`
  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
    color: #333;
  }

  p {
    margin: 0;
    color: #666;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #666;
  }

  input, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: #1976d2;
    }
  }
`;

const ToggleOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const ToggleInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  i {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e3f2fd;
    border-radius: 8px;
    color: #1976d2;
    font-size: 1.25rem;
  }
`;

const ToggleText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  .toggle-title {
    font-weight: 500;
    color: #333;
  }

  .toggle-description {
    font-size: 0.9rem;
    color: #666;
  }
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 24px;

    &:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
  }

  input:checked + .slider {
    background-color: #1976d2;
  }

  input:checked + .slider:before {
    transform: translateX(26px);
  }
`;

const StorageInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StorageProgress = styled.div`
  .progress-bar {
    height: 8px;
    background-color: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;

    .progress {
      height: 100%;
      background-color: #1976d2;
      border-radius: 4px;
    }
  }

  .storage-details {
    display: flex;
    justify-content: space-between;
    color: #666;
    font-size: 0.9rem;
  }
`;

const StorageActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  background-color: ${props => props.primary ? '#1976d2' : '#f5f5f5'};
  color: ${props => props.primary ? 'white' : '#333'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.primary ? '#1565c0' : '#e0e0e0'};
  }
`;

const Settings: React.FC = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [fileNotifications, setFileNotifications] = useState(true);
  const [deadlineNotifications, setDeadlineNotifications] = useState(true);

  return (
    <>
      <ContentHeader>
        <h1>Настройки</h1>
      </ContentHeader>

      <SettingsContainer>
        {/* Profile Settings */}
        <SettingsSection>
          <CardHeader>
            <div className="header-icon">
              <i className="fas fa-user"></i>
            </div>
            <h2>Профиль</h2>
          </CardHeader>
          <CardContent>
            <ProfileHeader>
              <ProfileAvatar>
                <img src="https://via.placeholder.com/100" alt="Profile" />
                <button className="avatar-edit">
                  <i className="fas fa-camera"></i>
                </button>
              </ProfileAvatar>
              <ProfileInfo>
                <h3>Иван Петров</h3>
                <p>ivan.petrov@university.edu</p>
              </ProfileInfo>
            </ProfileHeader>
            <FormGroup>
              <label htmlFor="fullName">Полное имя</label>
              <input type="text" id="fullName" defaultValue="Иванов Иван Иванович" />
            </FormGroup>
            <FormGroup>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" defaultValue="ivanov@example.com" />
            </FormGroup>
            <FormGroup>
              <label htmlFor="role">Роль</label>
              <select id="role">
                <option value="student">Студент</option>
                <option value="teacher">Преподаватель</option>
              </select>
            </FormGroup>
          </CardContent>
        </SettingsSection>

        {/* Security Settings */}
        <SettingsSection>
          <CardHeader>
            <div className="header-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h2>Безопасность</h2>
          </CardHeader>
          <CardContent>
            <FormGroup>
              <label htmlFor="currentPassword">Текущий пароль</label>
              <input type="password" id="currentPassword" />
            </FormGroup>
            <FormGroup>
              <label htmlFor="newPassword">Новый пароль</label>
              <input type="password" id="newPassword" />
            </FormGroup>
            <FormGroup>
              <label htmlFor="confirmPassword">Подтвердите пароль</label>
              <input type="password" id="confirmPassword" />
            </FormGroup>
            <ToggleOption>
              <ToggleInfo>
                <i className="fas fa-lock"></i>
                <ToggleText>
                  <span className="toggle-title">Двухфакторная аутентификация</span>
                  <span className="toggle-description">Дополнительный уровень защиты вашего аккаунта</span>
                </ToggleText>
              </ToggleInfo>
              <Switch>
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                />
                <span className="slider"></span>
              </Switch>
            </ToggleOption>
            <ToggleOption>
              <ToggleInfo>
                <i className="fas fa-bell"></i>
                <ToggleText>
                  <span className="toggle-title">Уведомления о входе</span>
                  <span className="toggle-description">Получать уведомления о новых входах в аккаунт</span>
                </ToggleText>
              </ToggleInfo>
              <Switch>
                <input
                  type="checkbox"
                  checked={loginNotifications}
                  onChange={(e) => setLoginNotifications(e.target.checked)}
                />
                <span className="slider"></span>
              </Switch>
            </ToggleOption>
          </CardContent>
        </SettingsSection>

        {/* Notification Settings */}
        <SettingsSection>
          <CardHeader>
            <div className="header-icon">
              <i className="fas fa-bell"></i>
            </div>
            <h2>Уведомления</h2>
          </CardHeader>
          <CardContent>
            <ToggleOption>
              <ToggleInfo>
                <i className="fas fa-envelope"></i>
                <ToggleText>
                  <span className="toggle-title">Email уведомления</span>
                  <span className="toggle-description">Получать важные уведомления на email</span>
                </ToggleText>
              </ToggleInfo>
              <Switch>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
                <span className="slider"></span>
              </Switch>
            </ToggleOption>
            <ToggleOption>
              <ToggleInfo>
                <i className="fas fa-file-alt"></i>
                <ToggleText>
                  <span className="toggle-title">Уведомления о новых файлах</span>
                  <span className="toggle-description">Получать уведомления о новых файлах в курсах</span>
                </ToggleText>
              </ToggleInfo>
              <Switch>
                <input
                  type="checkbox"
                  checked={fileNotifications}
                  onChange={(e) => setFileNotifications(e.target.checked)}
                />
                <span className="slider"></span>
              </Switch>
            </ToggleOption>
            <ToggleOption>
              <ToggleInfo>
                <i className="fas fa-clock"></i>
                <ToggleText>
                  <span className="toggle-title">Уведомления о дедлайнах</span>
                  <span className="toggle-description">Напоминания о приближающихся сроках сдачи</span>
                </ToggleText>
              </ToggleInfo>
              <Switch>
                <input
                  type="checkbox"
                  checked={deadlineNotifications}
                  onChange={(e) => setDeadlineNotifications(e.target.checked)}
                />
                <span className="slider"></span>
              </Switch>
            </ToggleOption>
          </CardContent>
        </SettingsSection>

        {/* Storage Settings */}
        <SettingsSection>
          <CardHeader>
            <div className="header-icon">
              <i className="fas fa-database"></i>
            </div>
            <h2>Хранилище</h2>
          </CardHeader>
          <CardContent>
            <StorageInfo>
              <StorageProgress>
                <div className="progress-bar">
                  <div className="progress" style={{ width: '65%' }}></div>
                </div>
                <div className="storage-details">
                  <span>Использовано 65%</span>
                  <span>6.5 ГБ из 10 ГБ</span>
                </div>
              </StorageProgress>
              <StorageActions>
                <Button>Очистить кэш</Button>
                <Button primary>Увеличить хранилище</Button>
              </StorageActions>
            </StorageInfo>
          </CardContent>
        </SettingsSection>
      </SettingsContainer>
    </>
  );
};

export default Settings; 