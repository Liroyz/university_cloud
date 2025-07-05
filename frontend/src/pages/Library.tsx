import React, { useState } from 'react';
import styled from 'styled-components';

const ContentHeader = styled.header`
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: #333;
  }
`;

const LibraryContainer = styled.div`
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

const LibrarySection = styled.section`
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

const MaterialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const MaterialCard = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const MaterialImage = styled.div`
  height: 150px;
  background-color: #e3f2fd;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1976d2;
  font-size: 2rem;
`;

const MaterialContent = styled.div`
  padding: 1rem;
`;

const MaterialTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
`;

const MaterialMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;

  span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const MaterialActions = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #eee;
`;

const Library: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <>
      <ContentHeader>
        <h1>Библиотека</h1>
      </ContentHeader>

      <LibraryContainer>
        <QuickActions>
          <FilterGroup>
            <Button 
              active={activeFilter === 'all'} 
              onClick={() => setActiveFilter('all')}
            >
              Все материалы
            </Button>
            <Button 
              active={activeFilter === 'books'} 
              onClick={() => setActiveFilter('books')}
            >
              Книги
            </Button>
            <Button 
              active={activeFilter === 'articles'} 
              onClick={() => setActiveFilter('articles')}
            >
              Статьи
            </Button>
            <Button 
              active={activeFilter === 'videos'} 
              onClick={() => setActiveFilter('videos')}
            >
              Видео
            </Button>
          </FilterGroup>
          <SearchBox>
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Поиск материалов..." />
          </SearchBox>
        </QuickActions>

        <LibrarySection>
          <SectionHeader>
            <h2>Рекомендуемые материалы</h2>
            <SectionActions>
              <Button className="btn-icon" title="Фильтр">
                <i className="fas fa-filter"></i>
              </Button>
              <Button className="btn-icon" title="Сортировка">
                <i className="fas fa-sort"></i>
              </Button>
            </SectionActions>
          </SectionHeader>
          <MaterialsGrid>
            <MaterialCard>
              <MaterialImage>
                <i className="fas fa-book"></i>
              </MaterialImage>
              <MaterialContent>
                <MaterialTitle>Введение в программирование</MaterialTitle>
                <MaterialMeta>
                  <span>
                    <i className="fas fa-user"></i>
                    Автор: Иван Петров
                  </span>
                  <span>
                    <i className="fas fa-calendar"></i>
                    Добавлено: 15 июня 2025
                  </span>
                </MaterialMeta>
              </MaterialContent>
              <MaterialActions>
                <Button primary>
                  <i className="fas fa-download"></i>
                  Скачать
                </Button>
                <Button className="btn-icon" title="Дополнительно">
                  <i className="fas fa-ellipsis-v"></i>
                </Button>
              </MaterialActions>
            </MaterialCard>

            <MaterialCard>
              <MaterialImage>
                <i className="fas fa-video"></i>
              </MaterialImage>
              <MaterialContent>
                <MaterialTitle>Основы веб-разработки</MaterialTitle>
                <MaterialMeta>
                  <span>
                    <i className="fas fa-user"></i>
                    Автор: Мария Сидорова
                  </span>
                  <span>
                    <i className="fas fa-calendar"></i>
                    Добавлено: 10 июня 2025
                  </span>
                </MaterialMeta>
              </MaterialContent>
              <MaterialActions>
                <Button primary>
                  <i className="fas fa-play"></i>
                  Смотреть
                </Button>
                <Button className="btn-icon" title="Дополнительно">
                  <i className="fas fa-ellipsis-v"></i>
                </Button>
              </MaterialActions>
            </MaterialCard>
          </MaterialsGrid>
        </LibrarySection>

        <LibrarySection>
          <SectionHeader>
            <h2>Недавние материалы</h2>
            <SectionActions>
              <Button className="btn-icon" title="Фильтр">
                <i className="fas fa-filter"></i>
              </Button>
              <Button className="btn-icon" title="Сортировка">
                <i className="fas fa-sort"></i>
              </Button>
            </SectionActions>
          </SectionHeader>
          <MaterialsGrid>
            <MaterialCard>
              <MaterialImage>
                <i className="fas fa-file-alt"></i>
              </MaterialImage>
              <MaterialContent>
                <MaterialTitle>Алгоритмы и структуры данных</MaterialTitle>
                <MaterialMeta>
                  <span>
                    <i className="fas fa-user"></i>
                    Автор: Алексей Иванов
                  </span>
                  <span>
                    <i className="fas fa-calendar"></i>
                    Добавлено: 5 июня 2025
                  </span>
                </MaterialMeta>
              </MaterialContent>
              <MaterialActions>
                <Button primary>
                  <i className="fas fa-download"></i>
                  Скачать
                </Button>
                <Button className="btn-icon" title="Дополнительно">
                  <i className="fas fa-ellipsis-v"></i>
                </Button>
              </MaterialActions>
            </MaterialCard>
          </MaterialsGrid>
        </LibrarySection>
      </LibraryContainer>
    </>
  );
};

export default Library; 