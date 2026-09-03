import {Link} from "@inertiajs/react";
import { usePage } from '@inertiajs/react';

export default function Navbar(){
    const onclickLink = () => {

    }

    return (
        <nav>
            <ul>
                <li>
                    <Link href="/profile" onClick={onclickLink} className={usePage().component.includes('Profile/index') ? 'active' : ''}>
                        <span><i className="fa-regular fa-chart-line"></i>داشبورد</span>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}
