import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CreateGroups from './components/CreateGroups';
import ExpenseMain from './components/ExpenseMain';
import AddMembers from './components/AddMembers';
import { RecoilRoot } from 'recoil'
import 'bootstrap/dist/css/bootstrap.min.css';
import {ROUTES} from './routes';

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to={ROUTES.CREATE_GROUP} />} />
          <Route path={ROUTES.CREATE_GROUP} element={<CreateGroups />} />
          <Route path={ROUTES.ADD_MEMBERS} element={<AddMembers />} />
          <Route path={ROUTES.EXPENSE_MAIN} element={<ExpenseMain />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}
export default App;
