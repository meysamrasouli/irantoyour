import * as React from "react";
import {useCallback, useRef, useState} from "react";
import {Link} from "@inertiajs/react";
import {zustandStore} from "@/shared/store/zustandStore";
import Navbar from './_navbar'
import NavbarUser from './_navbarUser'
import ArcNotification from '@/components/ui/arc_notification'
import ArcOverlayLoading from "@/components/ui/arc_overlay";
import {FormatNumber} from "@/shared/utils/convertUtils"
import {config, getFullName} from "@/shared/utils/generalUtils"
import {useClickOutside} from "@/shared/hooks/useClickOutside";
import ArcProgressBar from "@/components/ui/arc_progress_bar";
import {useFlushNotification} from "@/shared/hooks/useFlushNotification";

interface Props {
    children: React.ReactNode
}
export default function Layout({ children }: Props) {
    const overlayLoading = zustandStore(state => state.overlayLoading)
    useFlushNotification();// توست session flash (مثل redirect()->with('notification', ...)) رو نشون می‌ده


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

    return (
        <>
            <ArcOverlayLoading />
            <ArcNotification />

            <header>
                <div className="middle">
                    {/*<!--------------------| Hamburger |-------------------->*/}
                    <div className="hamburger-button">
                        <input type="checkbox"
                               className="ham-btn"
                               checked={navbarToggle}
                               onChange={(e) => setNavbarToggle(e.target.checked)}/>
                        <span className="ham-bar"></span>
                    </div>
                    <div>
                        <Link href="/profile/shop" className="custom-button-trans">
                            <i className="fa-regular fa-wallet icon-right"></i><span className="price-toman">{ FormatNumber(100000) }</span><i className="fa-regular fa-plus"></i>
                        </Link>
                        <div className="navbar-user" ref={navbarUserRef}>
                            <a className="custom-button-trans" onClick={() => setNavbarUserToggle(!navbarUserToggle)}>
                                <i className="fa-regular fa-user-cog"></i>
                                <i className="fa-regular fa-chevron-down"></i>
                            </a>

                            <aside className={`${(navbarUserToggle) && 'active'}`}>
                                {/*<!--------------------| Shop |-------------------->*/}
                                <div className="quick-access">
                                    <Link href="/profile/shop" className="custom-button-primary" onClick={() => setNavbarUserToggle(false)}>
                                        <i className="fa-regular fa-shopping-bag icon-right"></i><span>فروشگاه</span>
                                    </Link>
                                    <Link href="/profile/checkout" className="custom-button-secondary" onClick={() => setNavbarUserToggle(false)}>
                                        <i className="fa-regular fa-shopping-cart icon-right"></i><span>سبدخرید</span>
                                    </Link>
                                </div>

                                {/*<!--------------------| Navbar |-------------------->*/}
                                <NavbarUser onClick={() => setNavbarUserToggle(false)}/>
                            </aside>
                        </div>
                        <Link href="/profile/user-advertise/create" className="custom-button-red">ثبت آگهی</Link>
                    </div>
                </div>
            </header>
            <aside>
                <a href="/" className="logo">
                    <img src="/images/logo/logo.png" alt="لوگو"/>
                    <span>{config.APP_NAME_FA}</span>
                </a>

                <div className="user-detail">
                    <div className="user-info">
                        <i className="fa-thin fa-user-circle"></i>
                        <span className="user-name">{ getFullName('meysam') }</span>
                        <div className="user-rule">
                            <span>کاربر عادی</span>
                        </div>
                    </div>
                    <div className="account-detail">
                        <ArcProgressBar value={50}
                                        max={100}
                                        title={'اعتبار اشتراک'}
                                        text={'روز مانده'}
                                        textType="text"
                                        color={{ background: '#FFB95F', progress: '#fff', text: '#1a1a1a' }}
                                        colorType="fix"
                        />
                    </div>
                </div>

                <Navbar/>
            </aside>

            {children}
        </>
    )
}
