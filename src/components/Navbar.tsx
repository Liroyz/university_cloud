import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { useAuth } from '../App';

const Nav = styled.nav`
  background-color: ${theme.colors.background.paper};
  border-bottom: 1px solid ${theme.colors.border.light};
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(8px);
  background-color: ${theme.colors.background.paper}dd;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  color: ${theme.colors.primary.main};
  font-size: ${theme.typography.h4.fontSize};
  font-weight: ${theme.typography.h4.fontWeight};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  i {
    font-size: 1.5em;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  align-items: center;
`;

const StyledNavLink = styled(NavLink)`
  color: ${theme.colors.text.secondary};
  text-decoration: none;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  transition: ${theme.transitions.default};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-weight: 500;

  i {
    font-size: 1.1em;
  }

  &:hover {
    color: ${theme.colors.primary.main};
    background-color: ${theme.colors.primary.main}10;
  }

  &.active {
    color: ${theme.colors.primary.main};
    background-color: ${theme.colors.primary.main}10;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: ${theme.transitions.default};
  position: relative;

  &:hover {
    background-color: ${theme.colors.background.default};
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.round};
  background-color: ${theme.colors.primary.main};
  color: ${theme.colors.primary.contrast};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const UserName = styled.span`
  color: ${theme.colors.text.primary};
  font-weight: 500;
`;

const UserRole = styled.span`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.body2.fontSize};
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${theme.colors.background.paper};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.lg};
  min-width: 200px;
  z-index: 1000;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: ${theme.transitions.default};
  margin-top: ${theme.spacing.xs};
`;

const DropdownItem = styled.div`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  cursor: pointer;
  transition: ${theme.transitions.default};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  color: ${theme.colors.text.primary};

  &:hover {
    background-color: ${theme.colors.background.default};
  }

  &:first-child {
    border-radius: ${theme.borderRadius.md} ${theme.borderRadius.md} 0 0;
  }

  &:last-child {
    border-radius: 0 0 ${theme.borderRadius.md} ${theme.borderRadius.md};
    border-top: 1px solid ${theme.colors.border.light};
    color: ${theme.colors.error.main};
  }
`;

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
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

  const getUserFullName = () => {
    if (!user) return 'Гость';
    return user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'Пользователь';
  };

  return (
    <Nav>
      <NavContainer>
        <Logo>
          <i className="fas fa-graduation-cap"></i>
          Университет
        </Logo>
        <NavLinks>
          <StyledNavLink to="/my-files">
            <i className="fas fa-folder"></i>
            Мои файлы
          </StyledNavLink>
          <StyledNavLink to="/shared">
            <i className="fas fa-share-alt"></i>
            Общие файлы
          </StyledNavLink>
          {/*
          <StyledNavLink to="/courses">
            <i className="fas fa-graduation-cap"></i>
            Курсы
          </StyledNavLink>
          <StyledNavLink to="/assignments">
            <i className="fas fa-tasks"></i>
            Задания
          </StyledNavLink>
          <StyledNavLink to="/library">
            <i className="fas fa-book"></i>
            Библиотека
          </StyledNavLink>
          <StyledNavLink to="/settings">
            <i className="fas fa-cog"></i>
            Настройки
          </StyledNavLink>
          */}
        </NavLinks>
        <UserInfo ref={dropdownRef} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <UserAvatar>
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            ) : (
              getUserInitials()
            )}
          </UserAvatar>
          <UserDetails>
            <UserName>{getUserFullName()}</UserName>
            <UserRole>{getUserRoleText()}</UserRole>
          </UserDetails>
          <DropdownMenu isOpen={isDropdownOpen}>
            <DropdownItem onClick={() => navigate('/settings')}>
              <i className="fas fa-cog"></i>
              Настройки
            </DropdownItem>
            <DropdownItem onClick={() => navigate('/profile')}>
              <i className="fas fa-user"></i>
              Профиль
            </DropdownItem>
            <DropdownItem onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              Выйти
            </DropdownItem>
          </DropdownMenu>
        </UserInfo>
      </NavContainer>
    </Nav>
  );
};

export default Navbar; 