import React, { useState } from 'react';
import styled from 'styled-components';

const ContentHeader = styled.header`
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: #333;
  }
`;

const FilesContainer = styled.div`
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

const FilesSection = styled.section`
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

const FilesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const FileCard = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const FileIcon = styled.div`
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

const FileInfo = styled.div`
  h3 {
    margin: 0;
    font-size: 1.1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    margin: 0.25rem 0 0;
    color: #666;
    font-size: 0.9rem;
  }
`;

const FileMeta = styled.div`
  color: #666;
  font-size: 0.9rem;

  span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const FileActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MyFiles: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <>
      <ContentHeader>
        <h1>Мои файлы</h1>
      </ContentHeader>

      <FilesContainer>
        <QuickActions>
          <FilterGroup>
            <Button 
              active={activeFilter === 'all'} 
              onClick={() => setActiveFilter('all')}
            >
              Все файлы
            </Button>
            <Button 
              active={activeFilter === 'documents'} 
              onClick={() => setActiveFilter('documents')}
            >
              Документы
            </Button>
            <Button 
              active={activeFilter === 'presentations'} 
              onClick={() => setActiveFilter('presentations')}
            >
              Презентации
            </Button>
            <Button 
              active={activeFilter === 'images'} 
              onClick={() => setActiveFilter('images')}
            >
              Изображения
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
            <input type="text" placeholder="Поиск файлов..." />
          </SearchBox>
        </QuickActions>

        <FilesSection>
          <SectionHeader>
            <h2>Недавние файлы</h2>
            <SectionActions>
              <Button className="btn-icon" title="Фильтр">
                <i className="fas fa-filter"></i>
              </Button>
              <Button className="btn-icon" title="Сортировка">
                <i className="fas fa-sort"></i>
              </Button>
            </SectionActions>
          </SectionHeader>
          <FilesGrid>
            <FileCard>
              <FileIcon>
                <i className="fas fa-file-word"></i>
              </FileIcon>
              <FileInfo>
                <h3>Курсовая работа.docx</h3>
                <p>Документ Word</p>
              </FileInfo>
              <FileMeta>
                <span>
                  <i className="fas fa-calendar"></i>
                  Изменен: 15.06.2025
                </span>
              </FileMeta>
              <FileActions>
                <Button className="btn-icon" title="Скачать">
                  <i className="fas fa-download"></i>
                </Button>
                <Button className="btn-icon" title="Поделиться">
                  <i className="fas fa-share-alt"></i>
                </Button>
                <Button className="btn-icon" title="Дополнительно">
                  <i className="fas fa-ellipsis-v"></i>
                </Button>
              </FileActions>
            </FileCard>

            <FileCard>
              <FileIcon>
                <i className="fas fa-file-powerpoint"></i>
              </FileIcon>
              <FileInfo>
                <h3>Презентация.pptx</h3>
                <p>Презентация PowerPoint</p>
              </FileInfo>
              <FileMeta>
                <span>
                  <i className="fas fa-calendar"></i>
                  Изменен: 14.06.2025
                </span>
              </FileMeta>
              <FileActions>
                <Button className="btn-icon" title="Скачать">
                  <i className="fas fa-download"></i>
                </Button>
                <Button className="btn-icon" title="Поделиться">
                  <i className="fas fa-share-alt"></i>
                </Button>
                <Button className="btn-icon" title="Дополнительно">
                  <i className="fas fa-ellipsis-v"></i>
                </Button>
              </FileActions>
            </FileCard>
          </FilesGrid>
        </FilesSection>
      </FilesContainer>
    </>
  );
};

export default MyFiles; 