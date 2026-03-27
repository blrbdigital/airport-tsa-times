import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AirportDetail from './pages/AirportDetail';
import Report from './pages/Report';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/airport/:code" element={<AirportDetail />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
