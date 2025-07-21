import { useLocation, Link } from 'react-router-dom';
import AdminNavigation from "./nav/AdminNavigation";
import HomeNavigation from './nav/HomeNavigation';
import Logo from './Logo';

export default function Header() {
    const location = useLocation();

    return (
        <header className="bg-slate-700 py-4 shadow-md">
            <div className="mx-auto max-w-6xl flex items-center justify-between px-5">
                <div className="w-auto">
                    <Logo />
                </div>

                <div className="flex items-center space-x-6">
                    {location.pathname !== '/' && (
    <ul className="flex space-x-6">
    {[
        { to: "/admin", text: "Redes" },
        { to: "/admin/profile", text: "Mi Perfil" },
        { to: "/admin/historial", text: "Historial" },
    ].map((item) => (
        <li key={item.to} className="group relative">
        <Link
            to={item.to}
            className="text-white font-semibold px-2 py-1 transition-all duration-300 ease-in-out transform group-hover:scale-105"
        >
            {item.text}
            <span className="absolute left-1/2 bottom-0 w-0 h-0.5 bg-cyan-300 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
        </Link>
        </li>
    ))}
    </ul>


                    )}
                    <div>
                        {location.pathname === '/' ? <HomeNavigation /> : <AdminNavigation />}
                    </div>
                </div>
            </div>
        </header>
    );
}
