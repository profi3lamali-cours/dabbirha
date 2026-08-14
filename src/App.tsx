import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppData } from './context/AppDataContext';
import BottomNav from './components/BottomNav';
import InstallPrompt from './components/InstallPrompt';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Expenses from './pages/Expenses';
import Goals from './pages/Goals';
import Analysis from './pages/Analysis';
import More from './pages/More';
import Simulator from './pages/Simulator';
import CanIBuy from './pages/CanIBuy';
import SavingsPlan from './pages/SavingsPlan';
import AnnualExpenses from './pages/AnnualExpenses';
import About from './pages/About';
import Privacy from './pages/Privacy';

function AppRoutes() {
  const { data } = useAppData();

  if (!data.profile.onboardingComplete) {
    return (
      <HashRouter>
        <Routes>
          <Route path="*" element={<Onboarding />} />
        </Routes>
      </HashRouter>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/more" element={<More />} />
          <Route path="/more/simulator" element={<Simulator />} />
          <Route path="/more/can-i-buy" element={<CanIBuy />} />
          <Route path="/more/savings-plan" element={<SavingsPlan />} />
          <Route path="/more/annual" element={<AnnualExpenses />} />
          <Route path="/more/about" element={<About />} />
          <Route path="/more/privacy" element={<Privacy />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <BottomNav />
        <InstallPrompt />
      </div>
    </HashRouter>
  );
}

export default function App() {
  return <AppRoutes />;
}
