import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ComponentMaster from './pages/ComponentsMaster/ComponentMaster';
import AddUser from './pages/Add user/AddUser';
import Dashboard from './pages/dashboard/Dashboard';
import LogMaster from './pages/logMaster/LogMaster';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/component_master" element={<ComponentMaster />} />
        <Route path="/add_user" element={<AddUser />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/log_master" element={<LogMaster />} />
      </Routes>
    </BrowserRouter>
  )
};

export default App