import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useUIStore } from '../../store/useUIStore';
import clsx from 'clsx';


export default function AppShell() {
  const sidebarOpen = useUIStore(s => s.sidebarOpen);

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <div className="flex pt-14"> {/* pt-14 = navbar height offset */}
        {/*window.innerWidth > 768 && <Sidebar />*/}
        <Sidebar/>

        {/* Main content area shifts right when sidebar is open */}
        <main
          className={clsx(
            'flex-1 min-w-0 flex flex-col transition-all duration-normal',
            sidebarOpen ? 'ml-60' : 'ml-0'
          )}
        >
          <div className="flex-1 px-6 py-6 max-w-6xl w-full mx-auto">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}