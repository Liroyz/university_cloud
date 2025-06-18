import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from './styles/theme';
import Navbar from './components/Navbar';
import MyFiles from './pages/MyFiles';
import SharedFiles from './pages/SharedFiles';
import Courses from './pages/Courses';
import Assignments from './pages/Assignments';
import Library from './pages/Library';
import Settings from './pages/Settings';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${theme.colors.background.default};
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Navbar />
        <MainContent>
          <Routes>
            <Route path="/" element={<Navigate to="/my-files" replace />} />
            <Route path="/my-files" element={<MyFiles />} />
            <Route path="/shared" element={<SharedFiles />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/library" element={<Library />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App;
