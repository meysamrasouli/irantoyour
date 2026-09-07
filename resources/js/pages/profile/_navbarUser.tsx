import { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { logout } from '@/shared/utils/generalUtils';

interface NavbarUserPropsInterface {
    onClick?: () => void;
}

export default function NavbarUser({ onClick }: NavbarUserPropsInterface) {
    const { component } = usePage();

    const [isFinanceOpen, setIsFinanceOpen] = useState<boolean>(() => component.includes('Profile/Finance'));

    useEffect(() => {
        if (component.includes('Profile/Finance')) {
            setIsFinanceOpen(true);
        }
    }, [component]);

    const onLinkClick = () => {
        onClick?.();
    };

    const onLogoutClick = () => {
        onClick?.();
        logout();
    };

    return (
        <nav className="navbar-user">
            <ul>
                <li>
                    <Link href="/profile/user" onClick={onLinkClick} className={component.includes('Profile/user') ? 'active' : ''}>
                        <span><i className="fa-regular fa-user-edit"></i>اطلاعات کاربری</span>
                    </Link>
                </li>
                <li>
                    <Link href="/profile/unit" onClick={onLinkClick} className={component.includes('Profile/Unit') ? 'active' : ''}>
                        <span><i className="fa-regular fa-barn-silo"></i>واحدهای من</span>
                    </Link>
                </li>
                <li>
                    <Link href="/profile/user-advertise" onClick={onLinkClick} className={component.includes('Profile/Advertise') ? 'active' : ''}>
                        <span><i className="fa-regular fa-bullhorn"></i>آگهی‌های من</span>
                    </Link>
                </li>
                <li>
                    <a onClick={() => setIsFinanceOpen((prev) => !prev)} className={component.includes('Profile/Finance/') ? 'active' : ''}>
                        <span><i className="fa-regular fa-coin-blank"></i>مالی</span>
                        <i className={`fa-solid ${isFinanceOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                    </a>

                    <div className={`slide-toggle-container ${isFinanceOpen ? 'is-open' : ''}`}>
                        <ul className="slide-toggle-wrapper">
                            <li>
                                <Link href="/profile/finance/setting" onClick={onLinkClick} className={component.includes('Profile/Finance/setting') ? 'active' : ''}>
                                    <span><i className="fa-regular fa-cog"></i>تنظیمات مالی</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/profile/finance/invoice" onClick={onLinkClick} className={component.includes('Profile/Finance/invoice') ? 'active' : ''}>
                                    <span><i className="fa-regular fa-file-invoice-dollar"></i>صورتحساب‌ها</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/profile/finance/wallet" onClick={onLinkClick} className={component.includes('Profile/Finance/wallet') ? 'active' : ''}>
                                    <span><i className="fa-regular fa-wallet"></i>کیف پول</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>

            <ul>
                <li>
                    <a onClick={onLogoutClick}>
                        <span><i className="fa-solid fa-arrow-right-from-bracket"></i>خروج</span>
                    </a>
                </li>
            </ul>
        </nav>
    );
}
