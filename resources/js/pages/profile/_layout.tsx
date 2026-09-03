import * as React from "react";
import {useCallback, useRef, useState} from "react";
import {Link} from "@inertiajs/react";
import {zustandStore} from "@/shared/store/zustandStore";
import Navbar from './_navbar'
import NavbarUser from './_navbarUser'
import ArcNotification from '@/components/ui/arc_notification'
import ArcOverlayLoading from "@/components/ui/arc_overlay";
import {FormatNumber} from "@/shared/utils/convertUtils"
import {getFullName} from "@/shared/utils/generalUtils"
import { usePage } from '@inertiajs/react';
import {useClickOutside} from "@/shared/hooks/useClickOutside";

interface Props {
    children: React.ReactNode
}
export default function Layout({ children }: Props) {
    const overlayLoading = zustandStore(state => state.overlayLoading)
    const updateNotification = zustandStore(state => state.updateNotification)
    //updateNotification({mode: 'success', text: 'heyyyyy'})



    const [navbarToggle, setNavbarToggle] = useState<boolean>(false)
    const [navbarUserToggle, setNavbarUserToggle] = useState<boolean>(false)

    const navbarUserRef = useRef<HTMLDivElement>(null);



    /**
     * @event onClick outside navbar user
     * */
    useClickOutside(navbarUserRef,
        useCallback(() => {
            setNavbarUserToggle(false)
        }, [navbarUserToggle])
    );


    console.log(usePage())

    return (
        <>
            <ArcOverlayLoading />
            <ArcNotification />

            <header>
                {/*<!--------------------| Hamburger |-------------------->*/}
                <div className="hamburger-button">
                    <input type="checkbox"
                           className="ham-btn"
                           checked={navbarToggle}
                           onChange={(e) => setNavbarToggle(e.target.checked)}/>
                    <span className="ham-bar"></span>
                </div>
                {/*<!--------------------| Hamburger |-------------------->*/}
                <div>
                    <div>
                        <Link href="/profile/shop" className="custom-button-trans">
                            <i className="fa-regular fa-wallet icon-right"></i><span className="price-toman">{ FormatNumber(100000) }</span><i className="fa-regular fa-plus"></i>
                        </Link>
                    </div>
                    <div className="navbar-user" ref={navbarUserRef}>
                        <a className="custom-button-trans" onClick={() => setNavbarUserToggle(!navbarUserToggle)}>
                        <i className="fa-regular fa-user-cog"></i>
                        <i className="fa-regular fa-chevron-down"></i>
                    </a>

                    <aside className={`${(navbarUserToggle) && 'active'}`}>
                        {/*<!--------------------| User Detail |-------------------->*/}
                        <div className="user-detail">
                            <i className="fa-thin fa-user-circle"></i>
                            <span className="user-name">{ getFullName('meysam') }</span>
                            <div className="user-rule">
                                <span>کاربر عادی</span>
                            </div>
                        </div>

                        {/*<!--------------------| Shop |-------------------->*/}
                        <div className="quick-access">
                            <Link href="/profile/shop" className="custom-button-trans-primary" onClick={() => setNavbarUserToggle(false)}>
                                <i className="fa-regular fa-shopping-bag icon-right"></i><span>فروشگاه</span>
                            </Link>
                            <Link href="/profile/checkout" className="custom-button-trans-primary" onClick={() => setNavbarUserToggle(false)}>
                                <i className="fa-regular fa-shopping-cart icon-right"></i><span>سبدخرید</span>
                            </Link>
                        </div>

                        {/*<!--------------------| Navbar |-------------------->*/}
                        {/*<NavbarUser onClick={() => setNavbarUserToggle(false)}/>*/}
                    </aside>
                </div>
                    <Link href="/profile/user-advertise/create" className="custom-button-red">ثبت آگهی</Link>
                </div>
            </header>
            <aside>
                <Navbar/>
            </aside>

            {children}

            <footer></footer>
        </>
    )
}
