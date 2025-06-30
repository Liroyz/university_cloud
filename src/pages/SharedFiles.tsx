import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  getSharedFiles, 
  downloadFile,
  downloadFileDirect,
  getFileIcon, 
  formatFileSize, 
  formatDate 
} from '../services/fileService';
import { FileItem } from '../contracts/File';

const ContentHeader = styled.header`
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: #333;
  }
`;

const SharedContainer = styled.div`
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

const SharedSection = styled.section`
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

const SharedFilesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SharedFileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background-color: #e3f2fd;
  }
`;

const FileIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: #e3f2fd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: #1976d2;
`;

const FileInfo = styled.div`
  flex: 1;

  h3 {
    margin: 0;
    font-size: 1.1rem;
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
  display: flex;
  gap: 1rem;

  span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const FileActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #666;
  
  i {
    margin-right: 0.5rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  
  i {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #ddd;
  }
`;

const SharedFiles: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadSharedFiles();
  }, []);

  const loadSharedFiles = async () => {
    try {
      setLoading(true);
      const data = await getSharedFiles();
      setFiles(data);
    } catch (error) {
      console.error('Error loading shared files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileDownload = async (file: FileItem) => {
    try {
      await downloadFileDirect(file.id);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Ошибка при скачивании файла');
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesFilter = activeFilter === 'all' || file.file_type === activeFilter;
    const filename = file.original_filename || '';
    const description = file.description || '';
    const matchesSearch = filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <LoadingSpinner>
        <i className="fas fa-spinner fa-spin"></i>
        Загрузка общих файлов...
      </LoadingSpinner>
    );
  }

  return (
    <>
      <ContentHeader>
        <h1>Общие файлы</h1>
      </ContentHeader>

      <SharedContainer>
        <QuickActions>
          <FilterGroup>
            <Button 
              active={activeFilter === 'all'} 
              onClick={() => setActiveFilter('all')}
            >
              Все файлы
            </Button>
            <Button 
              active={activeFilter === 'document'} 
              onClick={() => setActiveFilter('document')}
            >
              Документы
            </Button>
            <Button 
              active={activeFilter === 'image'} 
              onClick={() => setActiveFilter('image')}
            >
              Изображения
            </Button>
            <Button 
              active={activeFilter === 'video'} 
              onClick={() => setActiveFilter('video')}
            >
              Видео
            </Button>
            <Button 
              active={activeFilter === 'audio'} 
              onClick={() => setActiveFilter('audio')}
            >
              Аудио
            </Button>
            <Button 
              active={activeFilter === 'archive'} 
              onClick={() => setActiveFilter('archive')}
            >
              Архивы
            </Button>
          </FilterGroup>
          <SearchBox>
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Поиск файлов..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>
        </QuickActions>

        <SharedSection>
          <SectionHeader>
            <h2>Общие файлы ({filteredFiles.length})</h2>
            <SectionActions>
              <Button className="btn-icon" title="Обновить" onClick={loadSharedFiles}>
                <i className="fas fa-sync-alt"></i>
              </Button>
            </SectionActions>
          </SectionHeader>
          
          {filteredFiles.length === 0 ? (
            <EmptyState>
              <i className="fas fa-share-alt"></i>
              <p>Общие файлы не найдены</p>
              <p>Публичные файлы появятся здесь</p>
            </EmptyState>
          ) : (
            <SharedFilesList>
              {filteredFiles.map((file) => (
                <SharedFileItem key={file.id}>
                  <FileIcon>
                    <i className={getFileIcon(file.file_type)}></i>
                  </FileIcon>
                  <FileInfo>
                    <h3>{file.original_filename}</h3>
                    <p>{file.description || 'Без описания'}</p>
                  </FileInfo>
                  <FileMeta>
                    <span>
                      <i className="fas fa-user"></i>
                      {file.uploaded_by.first_name} {file.uploaded_by.last_name}
                    </span>
                    <span>
                      <i className="fas fa-calendar"></i>
                      {formatDate(file.uploaded_at)}
                    </span>
                    <span>
                      <i className="fas fa-weight-hanging"></i>
                      {formatFileSize(file.file_size)}
                    </span>
                  </FileMeta>
                  <FileActions>
                    <Button 
                      className="btn-icon" 
                      title="Скачать"
                      onClick={() => handleFileDownload(file)}
                    >
                      <i className="fas fa-download"></i>
                    </Button>
                  </FileActions>
                </SharedFileItem>
              ))}
            </SharedFilesList>
          )}
        </SharedSection>
      </SharedContainer>
    </>
  );
};

export default SharedFiles; 