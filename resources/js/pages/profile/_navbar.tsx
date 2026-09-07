import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Navbar() {
    const { component, url } = usePage();

    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => ({
        search: url.startsWith('/profile/search/offer'),
        //index: true/false
    }));

    useEffect(() => {
        if (url.startsWith('/profile/search/offer')) {
            setOpenMenus(prev => ({ ...prev, search: true }));
        }
    }, [url]);

    const toggleMenu = (menuKey: string) => {
        setOpenMenus(prev => ({ ...prev, [menuKey]: !prev[menuKey] }));
    };
    const isMenuOpen = (menuKey: string) => openMenus[menuKey];

    return (
        <nav className="navbar-profile">
            <ul>
                <li>
                    <Link href="/profile" className={component.includes('Profile/index') ? 'active' : ''}>
                        <span><i className="fa-regular fa-chart-line"></i>داشبورد</span>
                    </Link>
                </li>
                <li>
                    <a onClick={() => toggleMenu('search')} className={component.includes('Profile/Search/') ? 'active' : ''}>
                        <span><i className="fa-regular fa-magnifying-glass"></i>جستجوی آگهی ها</span>
                        <i className={`fa-solid ${isMenuOpen('search') ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                    </a>

                    <div className={`slide-toggle-container ${isMenuOpen('search') ? 'is-open' : ''}`}>
                        <ul className="slide-toggle-wrapper">
                            <li>
                                <Link href="/profile/search/offer/chick" className={url.includes('/profile/search/offer/chick') ? 'active' : ''}>
                                    <span><i className="fa-regular fa-dash"></i>جوجه یکروزه</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </li>
                <li>
                    <a onClick={() => toggleMenu('reports')}>
                        <span><i className="fa-regular fa-chart-bar"></i>گزارش‌ها</span>
                        <i className={`fa-solid ${isMenuOpen('reports') ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                    </a>
                    <div className={`slide-toggle-container ${isMenuOpen('reports') ? 'is-open' : ''}`}>
                        <ul className="slide-toggle-wrapper">
                            {/* آیتم‌های زیرمنو */}
                        </ul>
                    </div>
                </li>
            </ul>
        </nav>
    );
}
