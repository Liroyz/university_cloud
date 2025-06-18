import React, { useState } from 'react';
import styled from 'styled-components';

const ContentHeader = styled.header`
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: #333;
  }
`;

const CoursesContainer = styled.div`
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

const CoursesSection = styled.section`
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

const CoursesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const CourseCard = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CourseHeader = styled.div`
  display: flex;
  gap: 1rem;
`;

const CourseIcon = styled.div`
  width: 48px;
  height: 48px;
  background-color: #e3f2fd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #1976d2;
`;

const CourseInfo = styled.div`
  flex: 1;

  h3 {
    margin: 0;
    font-size: 1.1rem;
  }

  p {
    margin: 0.25rem 0 0;
    color: #666;
  }
`;

const CourseProgress = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
`;

const Progress = styled.div<{ width: number }>`
  width: ${props => props.width}%;
  height: 100%;
  background-color: #1976d2;
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const CourseMeta = styled.div`
  color: #666;
  font-size: 0.9rem;

  span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const CourseActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Courses: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <>
      <ContentHeader>
        <h1>Курсы</h1>
      </ContentHeader>

      <CoursesContainer>
        <QuickActions>
          <FilterGroup>
            <Button 
              active={activeFilter === 'all'} 
              onClick={() => setActiveFilter('all')}
            >
              Все курсы
            </Button>
            <Button 
              active={activeFilter === 'current'} 
              onClick={() => setActiveFilter('current')}
            >
              Текущие
            </Button>
            <Button 
              active={activeFilter === 'completed'} 
              onClick={() => setActiveFilter('completed')}
            >
              Завершенные
            </Button>
            <Button 
              active={activeFilter === 'favorite'} 
              onClick={() => setActiveFilter('favorite')}
            >
              Избранное
            </Button>
          </FilterGroup>
          <SearchBox>
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Поиск курсов..." />
          </SearchBox>
        </QuickActions>

        <CoursesSection>
          <SectionHeader>
            <h2>Текущие курсы</h2>
            <SectionActions>
              <Button className="btn-icon" title="Фильтр">
                <i className="fas fa-filter"></i>
              </Button>
              <Button className="btn-icon" title="Сортировка">
                <i className="fas fa-sort"></i>
              </Button>
            </SectionActions>
          </SectionHeader>
          <CoursesGrid>
            <CourseCard>
              <CourseHeader>
                <CourseIcon>
                  <i className="fas fa-database"></i>
                </CourseIcon>
                <CourseInfo>
                  <h3>Базы данных</h3>
                  <p>Проф. Иванов А.И.</p>
                </CourseInfo>
              </CourseHeader>
              <CourseProgress>
                <ProgressBar>
                  <Progress width={75} />
                </ProgressBar>
                <span>75% завершено</span>
              </CourseProgress>
              <CourseActions>
                <Button primary>
                  <i className="fas fa-play"></i>
                  Продолжить
                </Button>
                <Button className="btn-icon" title="Дополнительно">
                  <i className="fas fa-ellipsis-v"></i>
                </Button>
              </CourseActions>
            </CourseCard>

            <CourseCard>
              <CourseHeader>
                <CourseIcon>
                  <i className="fas fa-code"></i>
                </CourseIcon>
                <CourseInfo>
                  <h3>Программирование</h3>
                  <p>Доц. Петров В.С.</p>
                </CourseInfo>
              </CourseHeader>
              <CourseProgress>
                <ProgressBar>
                  <Progress width={45} />
                </ProgressBar>
                <span>45% завершено</span>
              </CourseProgress>
              <CourseActions>
                <Button primary>
                  <i className="fas fa-play"></i>
                  Продолжить
                </Button>
                <Button className="btn-icon" title="Дополнительно">
                  <i className="fas fa-ellipsis-v"></i>
                </Button>
              </CourseActions>
            </CourseCard>
          </CoursesGrid>
        </CoursesSection>

        <CoursesSection>
          <SectionHeader>
            <h2>Предстоящие курсы</h2>
            <SectionActions>
              <Button className="btn-icon" title="Фильтр">
                <i className="fas fa-filter"></i>
              </Button>
              <Button className="btn-icon" title="Сортировка">
                <i className="fas fa-sort"></i>
              </Button>
            </SectionActions>
          </SectionHeader>
          <CoursesGrid>
            <CourseCard>
              <CourseHeader>
                <CourseIcon>
                  <i className="fas fa-network-wired"></i>
                </CourseIcon>
                <CourseInfo>
                  <h3>Сети и телекоммуникации</h3>
                  <p>Ст. преп. Сидоров В.П.</p>
                </CourseInfo>
              </CourseHeader>
              <CourseMeta>
                <span>
                  <i className="fas fa-calendar"></i>
                  Начало: 1 сентября 2025
                </span>
              </CourseMeta>
              <CourseActions>
                <Button primary>
                  <i className="fas fa-info-circle"></i>
                  Подробнее
                </Button>
                <Button className="btn-icon" title="Дополнительно">
                  <i className="fas fa-ellipsis-v"></i>
                </Button>
              </CourseActions>
            </CourseCard>
          </CoursesGrid>
        </CoursesSection>
      </CoursesContainer>
    </>
  );
};

export default Courses; 