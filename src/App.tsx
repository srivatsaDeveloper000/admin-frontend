import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ComponentMaster from './pages/ComponentsMaster/ComponentMaster';
import AddUser from './pages/Add user/AddUser';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/component_master" element={<ComponentMaster />} />
        <Route path="/add_user" element={<AddUser />} />
      </Routes>
    </BrowserRouter>
  )
};

export default App