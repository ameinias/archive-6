import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import Home from '../main/components/Home';
import UserProfile from '../main/components/UserProfile';
import NavBar from '../main/components/NavBar';
import AddEntry from '../main/components/Friends/AddEntry';
import ImportExport from '../main/components/ImportExport';
import ShowSingle from '../main/components/Friends/ShowSingle';

function Hello() {
  return (
    <div>
      <h1>Hello, World!</h1>
      <img src={icon} alt="Icon" />
      <p>This is a simple React application.</p>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <NavBar />
      <h3>archive software</h3>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/edit-item/:id" element={<AddEntry />} />
          <Route path="/import-export" element={<ImportExport />} />
          <Route path="/entry/:id" element={<ShowSingle />} />
        </Routes>
      </div>
    </Router>
  );
}
