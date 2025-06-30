import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  getMyFiles, 
  uploadFile, 
  deleteFile, 
  downloadFile,
  downloadFileDirect,
  getFileIcon, 
  formatFileSize, 
  formatDate,
  UploadFileData 
} from '../services/fileService';
import { FileItem } from '../contracts/File';

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

const UploadButton = styled(Button)`
  background-color: #4caf50;
  color: white;
  
  &:hover {
    background-color: #45a049;
  }
`;

const UploadModal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  min-width: 400px;
  max-width: 500px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h3 {
    margin: 0;
  }
  
  button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    
    &:hover {
      color: #333;
    }
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  input, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  textarea {
    resize: vertical;
    min-height: 80px;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  input[type="checkbox"] {
    width: auto;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
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

const MyFiles: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadData, setUploadData] = useState({
    description: '',
    is_public: false
  });

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const data = await getMyFiles();
      setFiles(data);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const uploadDataObj: UploadFileData = {
        file: selectedFile,
        description: uploadData.description,
        is_public: uploadData.is_public
      };

      await uploadFile(uploadDataObj);
      setUploadModalOpen(false);
      setSelectedFile(null);
      setUploadData({ description: '', is_public: false });
      loadFiles(); // Reload files
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Ошибка при загрузке файла');
    } finally {
      setUploading(false);
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

  const handleFileDelete = async (fileId: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот файл?')) return;

    try {
      await deleteFile(fileId);
      loadFiles(); // Reload files
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Ошибка при удалении файла');
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
        Загрузка файлов...
      </LoadingSpinner>
    );
  }

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
          <UploadButton onClick={() => setUploadModalOpen(true)}>
            <i className="fas fa-upload"></i>
            Загрузить файл
          </UploadButton>
        </QuickActions>

        <FilesSection>
          <SectionHeader>
            <h2>Мои файлы ({filteredFiles.length})</h2>
            <SectionActions>
              <Button className="btn-icon" title="Обновить" onClick={loadFiles}>
                <i className="fas fa-sync-alt"></i>
              </Button>
            </SectionActions>
          </SectionHeader>
          
          {filteredFiles.length === 0 ? (
            <EmptyState>
              <i className="fas fa-folder-open"></i>
              <p>Файлы не найдены</p>
              <Button onClick={() => setUploadModalOpen(true)}>
                <i className="fas fa-upload"></i>
                Загрузить первый файл
              </Button>
            </EmptyState>
          ) : (
            <FilesGrid>
              {filteredFiles.map((file) => (
                <FileCard key={file.id}>
                  <FileIcon>
                    <i className={getFileIcon(file.file_type)}></i>
                  </FileIcon>
                  <FileInfo>
                    <h3>{file.original_filename}</h3>
                    <p>{file.description || 'Без описания'}</p>
                  </FileInfo>
                  <FileMeta>
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
                    <Button 
                      className="btn-icon" 
                      title="Удалить"
                      onClick={() => handleFileDelete(file.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </FileActions>
                </FileCard>
              ))}
            </FilesGrid>
          )}
        </FilesSection>
      </FilesContainer>

      {/* Upload Modal */}
      <UploadModal isOpen={uploadModalOpen}>
        <ModalContent>
          <ModalHeader>
            <h3>Загрузить файл</h3>
            <button onClick={() => setUploadModalOpen(false)}>&times;</button>
          </ModalHeader>
          
          <FormGroup>
            <label>Выберите файл:</label>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
          </FormGroup>
          
          <FormGroup>
            <label>Описание:</label>
            <textarea
              value={uploadData.description}
              onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
              placeholder="Описание файла..."
            />
          </FormGroup>
          
          <CheckboxGroup>
            <input
              type="checkbox"
              id="is_public"
              checked={uploadData.is_public}
              onChange={(e) => setUploadData({...uploadData, is_public: e.target.checked})}
            />
            <label htmlFor="is_public">Сделать файл публичным</label>
          </CheckboxGroup>
          
          <ModalActions>
            <Button onClick={() => setUploadModalOpen(false)}>
              Отмена
            </Button>
            <UploadButton 
              onClick={handleFileUpload}
              disabled={!selectedFile || uploading}
            >
              {uploading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Загрузка...
                </>
              ) : (
                <>
                  <i className="fas fa-upload"></i>
                  Загрузить
                </>
              )}
            </UploadButton>
          </ModalActions>
        </ModalContent>
      </UploadModal>
    </>
  );
};

export default MyFiles; 