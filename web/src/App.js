import 'bootstrap/dist/css/bootstrap.min.css';
import Documentation from './Components/Documentation';
import Herosection from './Components/HeroSection';
import NavBar from './Components/NavBar'
function App() {
  return (
    <div>
      <NavBar />
      <Herosection/>
      <Documentation/>
    </div>
  );
}

export default App;
