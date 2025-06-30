import React, { useState } from 'react';
import styled from 'styled-components';

const ContentHeader = styled.header`
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: #333;
  }
`;

const AssignmentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const QuickActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Button = styled.button<{ active?: boolean; primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  background-color: ${props => {
    if (props.active) return '#1976d2';
    if (props.primary) return '#1976d2';
    return '#f5f5f5';
  }};
  color: ${props => props.active || props.primary ? 'white' : '#333'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => {
      if (props.active || props.primary) return '#1565c0';
      return '#e0e0e0';
    }};
  }

  &.btn-icon {
    padding: 0.75rem;
    background: none;
    color: #666;

    &:hover {
      background-color: #f5f5f5;
      color: #1976d2;
    }
  }
`;

const SearchBox = styled.div`
  position: relative;
  min-width: 250px;

  input {
    width: 100%;
    padding: 0.75rem 1rem;
    padding-left: 2.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }

  i {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
  }
`;

const AssignmentsSection = styled.section`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h2 {
    margin: 0;
    font-size: 1.25rem;
  }
`;

const SectionActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const AssignmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AssignmentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background-color: #e3f2fd;
  }
`;

const AssignmentInfo = styled.div`
  flex: 1;
`;

const AssignmentHeader = styled.div`
  margin-bottom: 0.5rem;

  h3 {
    margin: 0;
    font-size: 1.1rem;
  }

  span {
    color: #666;
    font-size: 0.9rem;
  }
`;

const AssignmentMeta = styled.div`
  display: flex;
  gap: 1rem;
  color: #666;
  font-size: 0.9rem;

  span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .status {
    &.pending {
      color: #f57c00;
    }
    &.upcoming {
      color: #1976d2;
    }
  }
`;

const AssignmentActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Assignments: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <>
      <ContentHeader>
        <h1>Задания</h1>
      </ContentHeader>

      <AssignmentsContainer>
        <QuickActions>
          <FilterGroup>
            <Button 
              active={activeFilter === 'all'} 
              onClick={() => setActiveFilter('all')}
            >
              Все задания
            </Button>
            <Button 
              active={activeFilter === 'current'} 
              onClick={() => setActiveFilter('current')}
            >
              Текущие
            </Button>
            <Button 
              active={activeFilter === 'overdue'} 
              onClick={() => setActiveFilter('overdue')}
            >
              Просроченные
            </Button>
            <Button 
              active={activeFilter === 'completed'} 
              onClick={() => setActiveFilter('completed')}
            >
              Завершенные
            </Button>
          </FilterGroup>
          <SearchBox>
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Поиск заданий..." />
          </SearchBox>
        </QuickActions>

        <AssignmentsSection>
          <SectionHeader>
            <h2>Текущие задания</h2>
            <SectionActions>
              <Button className="btn-icon" title="Фильтр">
                <i className="fas fa-filter"></i>
              </Button>
              <Button className="btn-icon" title="Сортировка">
                <i className="fas fa-sort"></i>
              </Button>
            </SectionActions>
          </SectionHeader>
          <AssignmentsList>
            <AssignmentItem>
              <AssignmentInfo>
                <AssignmentHeader>
                  <h3>Лабораторная работа №3</h3>
                  <span>Базы данных</span>
                </AssignmentHeader>
                <AssignmentMeta>
                  <span>
                    <i className="fas fa-clock"></i>
                    Срок сдачи: 25 июня 2025
                  </span>
                  <span className="status pending">
                    <i className="fas fa-hourglass-half"></i>
                    В процессе
                  </span>
                </AssignmentMeta>
              </AssignmentInfo>
              <AssignmentActions>
                <Button primary>
                  <i className="fas fa-upload"></i>
                  Загрузить
                </Button>
                <Button className="btn-icon" title="Дополнительно">
                  <i className="fas fa-ellipsis-v"></i>
                </Button>
              </AssignmentActions>
            </AssignmentItem>

            <AssignmentItem>
              <AssignmentInfo>
                <AssignmentHeader>
                  <h3>Курсовая работа</h3>
                  <span>Программирование</span>
                </AssignmentHeader>
                <AssignmentMeta>
                  <span>
                    <i className="fas fa-clock"></i>
                    Срок сдачи: 30 июня 2025
                  </span>
                  <span className="status pending">
                    <i className="fas fa-hourglass-half"></i>
                    В процессе
                  </span>
                </AssignmentMeta>
              </AssignmentInfo>
              <AssignmentActions>
                <Button primary>
                  <i className="fas fa-upload"></i>
                  Загрузить
                </Button>
                <Button className="btn-icon" title="Дополнительно">
                  <i className="fas fa-ellipsis-v"></i>
                </Button>
              </AssignmentActions>
            </AssignmentItem>
          </AssignmentsList>
        </AssignmentsSection>

        <AssignmentsSection>
          <SectionHeader>
            <h2>Предстоящие задания</h2>
            <SectionActions>
              <Button className="btn-icon" title="Фильтр">
                <i className="fas fa-filter"></i>
              </Button>
              <Button className="btn-icon" title="Сортировка">
                <i className="fas fa-sort"></i>
              </Button>
            </SectionActions>
          </SectionHeader>
          <AssignmentsList>
            <AssignmentItem>
              <AssignmentInfo>
                <AssignmentHeader>
                  <h3>Контрольная работа</h3>
                  <span>Сети и телекоммуникации</span>
                </AssignmentHeader>
                <AssignmentMeta>
                  <span>
                    <i className="fas fa-clock"></i>
                    Срок сдачи: 5 июля 2025
                  </span>
                  <span className="status upcoming">
                    <i className="fas fa-calendar"></i>
                    Скоро
                  </span>
                </AssignmentMeta>
              </AssignmentInfo>
              <AssignmentActions>
                <Button>
                  <i className="fas fa-info-circle"></i>
                  Подробнее
                </Button>
                <Button className="btn-icon" title="Дополнительно">
                  <i className="fas fa-ellipsis-v"></i>
                </Button>
              </AssignmentActions>
            </AssignmentItem>
          </AssignmentsList>
        </AssignmentsSection>
      </AssignmentsContainer>
    </>
  );
};

export default Assignments; 