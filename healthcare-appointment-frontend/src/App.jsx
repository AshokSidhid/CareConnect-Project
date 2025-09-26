// src/App.jsx

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer'; // 1. Import the Footer
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <div className="app-container"> {/* 2. Add a wrapper div with a class */}
      <Navbar />
      <main>
        <AppRoutes />
      </main>
      <Footer /> {/* 3. Place the Footer here */}
    </div>
  );
}

export default App;