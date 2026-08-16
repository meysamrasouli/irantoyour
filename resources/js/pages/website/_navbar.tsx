import { Link } from '@inertiajs/react'

export default function Navbar() {
    return (
        <nav>
            <ul className="nav-root">
                <li><Link href="/about">درباره ما</Link></li>
                <li><Link href="/contact">تماس با ما</Link></li>
            </ul>
        </nav>
    )
}
