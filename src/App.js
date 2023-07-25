import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateGroups from './components/CreateGroups';
import ExpenseMain from './components/ExpenseMain';
import AddMembers from './components/AddMembers';
import { RecoilRoot } from 'recoil'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CreateGroups />} />
          <Route path="/members" element={<AddMembers />} />
          <Route path="/expense" element={<ExpenseMain />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}
export default App;
