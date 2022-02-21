import 'bootstrap/dist/css/bootstrap.min.css';
import Documentation from './Components/Documentation';
import Footer from './Components/Footer';
import Herosection from './Components/HeroSection';
import NavBar from './Components/NavBar'
import Theory from './Components/Theory'
function App() {
  return (
    <div>
      <NavBar />
      <Herosection/>
      <Documentation/>
      <Theory />
      <Footer />
    </div>
  );
}

export default App;
