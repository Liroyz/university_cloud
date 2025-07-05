import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '../components/shared/Button';
import { useAuth } from '../App';
import { 
  getCourses, 
  createCourse, 
  updateCourse, 
  deleteCourse,
  CreateCourseData
} from '../services/courseService';
import { Course } from '../contracts/Course';

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

const AddCourseButton = styled(Button)`
  background-color: #4caf50;
  color: white;
  
  &:hover {
    background-color: #45a049;
  }
`;

const CourseModal = styled.div<{ isOpen: boolean }>`
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

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: ''
  });
  
  const { user } = useAuth();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await getCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    if (!formData.name || !formData.code) return;

    try {
      const courseData: CreateCourseData = {
        name: formData.name,
        code: formData.code,
        description: formData.description
      };

      await createCourse(courseData);
      setModalOpen(false);
      setFormData({ name: '', code: '', description: '' });
      loadCourses();
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Ошибка при создании курса');
    }
  };

  const handleUpdateCourse = async () => {
    if (!editingCourse || !formData.name || !formData.code) return;

    try {
      await updateCourse(editingCourse.id, {
        name: formData.name,
        code: formData.code,
        description: formData.description
      });
      setModalOpen(false);
      setEditingCourse(null);
      setFormData({ name: '', code: '', description: '' });
      loadCourses();
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Ошибка при обновлении курса');
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот курс?')) return;

    try {
      await deleteCourse(courseId);
      loadCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Ошибка при удалении курса');
    }
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      code: course.code,
      description: course.description
    });
    setModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingCourse(null);
    setFormData({ name: '', code: '', description: '' });
    setModalOpen(true);
  };

  const filteredCourses = courses.filter(course => {
    const name = course.name || '';
    const code = course.code || '';
    const description = course.description || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <LoadingSpinner>
        <i className="fas fa-spinner fa-spin"></i>
        Загрузка курсов...
      </LoadingSpinner>
    );
  }

  return (
    <>
      <ContentHeader>
        <h1>Курсы</h1>
      </ContentHeader>

      <CoursesContainer>
        <QuickActions>
          <SearchBox>
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Поиск курсов..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>
          {user?.role === 'teacher' && (
            <AddCourseButton onClick={openCreateModal}>
              <i className="fas fa-plus"></i>
              Создать курс
            </AddCourseButton>
          )}
        </QuickActions>

        <CoursesSection>
          <SectionHeader>
            <h2>Курсы ({filteredCourses.length})</h2>
            <SectionActions>
              <Button className="btn-icon" title="Обновить" onClick={loadCourses}>
                <i className="fas fa-sync-alt"></i>
              </Button>
            </SectionActions>
          </SectionHeader>
          
          {filteredCourses.length === 0 ? (
            <EmptyState>
              <i className="fas fa-graduation-cap"></i>
              <p>Курсы не найдены</p>
              {user?.role === 'teacher' && (
                <Button onClick={openCreateModal}>
                  <i className="fas fa-plus"></i>
                  Создать первый курс
                </Button>
              )}
            </EmptyState>
          ) : (
            <CoursesGrid>
              {filteredCourses.map((course) => (
                <CourseCard key={course.id}>
                  <CourseHeader>
                    <CourseIcon>
                      <i className="fas fa-graduation-cap"></i>
                    </CourseIcon>
                    <CourseInfo>
                      <h3>{course.name}</h3>
                      <p>Код: {course.code}</p>
                    </CourseInfo>
                  </CourseHeader>
                  
                  <p>{course.description || 'Описание отсутствует'}</p>
                  
                  <CourseMeta>
                    <span>
                      <i className="fas fa-user"></i>
                      Преподаватель: {course.teacher.first_name} {course.teacher.last_name}
                    </span>
                    <span>
                      <i className="fas fa-calendar"></i>
                      Создан: {new Date(course.created_at).toLocaleDateString('ru-RU')}
                    </span>
                  </CourseMeta>
                  
                  <CourseActions>
                    <Button 
                      className="btn-icon" 
                      title="Просмотр"
                      onClick={() => {/* TODO: Navigate to course details */}}
                    >
                      <i className="fas fa-eye"></i>
                    </Button>
                    {user?.role === 'teacher' && course.teacher.id === user.id && (
                      <>
                        <Button 
                          className="btn-icon" 
                          title="Редактировать"
                          onClick={() => openEditModal(course)}
                        >
                          <i className="fas fa-edit"></i>
                        </Button>
                        <Button 
                          className="btn-icon" 
                          title="Удалить"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </>
                    )}
                  </CourseActions>
                </CourseCard>
              ))}
            </CoursesGrid>
          )}
        </CoursesSection>
      </CoursesContainer>

      {/* Course Modal */}
      <CourseModal isOpen={modalOpen}>
        <ModalContent>
          <ModalHeader>
            <h3>{editingCourse ? 'Редактировать курс' : 'Создать курс'}</h3>
            <button onClick={() => setModalOpen(false)}>&times;</button>
          </ModalHeader>
          
          <FormGroup>
            <label>Название курса:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Введите название курса"
            />
          </FormGroup>
          
          <FormGroup>
            <label>Код курса:</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              placeholder="Введите код курса"
            />
          </FormGroup>
          
          <FormGroup>
            <label>Описание:</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Описание курса..."
            />
          </FormGroup>
          
          <ModalActions>
            <Button onClick={() => setModalOpen(false)}>
              Отмена
            </Button>
            <AddCourseButton 
              onClick={editingCourse ? handleUpdateCourse : handleCreateCourse}
              disabled={!formData.name || !formData.code}
            >
              {editingCourse ? 'Обновить' : 'Создать'}
            </AddCourseButton>
          </ModalActions>
        </ModalContent>
      </CourseModal>
    </>
  );
};

export default Courses; 