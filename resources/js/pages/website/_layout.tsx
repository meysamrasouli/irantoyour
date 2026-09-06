import * as React from "react";
import {useCallback, useRef, useState} from "react";
import {Link, usePage} from "@inertiajs/react";
import Navbar from './_navbar'
import ArcOverlayLoading from "@/components/ui/arc_overlay";
import {config, getFullName, logout} from "@/shared/utils/generalUtils";
import {useClickOutside} from "@/shared/hooks/useClickOutside";
import {AppSharedPropsInterface} from "@/shared/types/appSharedPropsInterface";


interface Props {
    children: React.ReactNode
}

export default function Layout({ children }: Props) {
    const [userMenuToggle, setUserMenuToggle] = useState<boolean>(false)

    const userMenuRef = useRef<HTMLDivElement>(null)

    const { auth } = usePage().props as unknown as AppSharedPropsInterface
    const user = auth?.user ?? null

    /**
     * @event onClick outside user menu
     */
    useClickOutside(userMenuRef,
        useCallback(() => {
            setUserMenuToggle(false)
        }, [])
    );

    return (
        <>
            <ArcOverlayLoading />
            <header>
                <div className="middle">
                    <Link href="/" className="logo">
                        <img src="/images/logo/logo.png" alt={config.APP_NAME_FA} />
                        <span>{config.APP_NAME_FA}</span>
                    </Link>

                    <Navbar />

                    <div className="user-menu-wrapper">
                        {user ? (
                            <div className="user-menu" ref={userMenuRef}>
                                <button type="button" className="user-menu-button" onClick={() => setUserMenuToggle(!userMenuToggle)}>
                                    <i className="fa-light fa-user"></i>
                                </button>

                                <div className={`user-toggle-menu ${userMenuToggle ? 'active' : ''}`}>
                                    <Link href="/profile" className="user-info" onClick={() => setUserMenuToggle(false)}>
                                        <i className="fa-thin fa-circle-user"></i>
                                        <span className="user-name">{ getFullName(user.first_name, user.last_name, user.mobile) }</span>
                                        <span className="user-mobile">{ user.mobile }</span>
                                    </Link>

                                    <ul className="profile-link">
                                        <li>
                                            <a href="/profile"><i className="fa-light fa-user"></i><span>اطلاعات کاربری</span></a>
                                        </li>
                                        <li>
                                            <a onClick={logout}><i className="fa-light fa-arrow-right-from-bracket"></i><span>خروج</span></a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="viewer-menu">
                                <Link href="/login" className="custom-button-trans-text">ورود</Link>
                                <Link href="/register" className="custom-button">عضویت</Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {children}

            <footer>
                <section className="detail">
                    <div className="middle">
                        <div className="about">
                            <img src="/images/logo/logo.png" alt={config.APP_NAME_FA} />
                            <p>ایران طیور با بهره‌گیری از تکنولوژی روز دنیا و تلفیق آن با نیازهای بومی صنعت مرغداری کشور، پلتفورمی پیشرو، امن و سریع برای ثبت آگهی در صنعت طیور ایران ایجاد نموده تا شما را در جریان آخرین معاملات کل کشور قرار دهد.</p>
                        </div>

                        <div className="quick-link">
                            <span>دسترسی سریع</span>
                            <ul>
                                <li><Link href="/about">درباره ما</Link></li>
                                <li><Link href="/terms">قوانین و مقررات</Link></li>
                                <li><Link href="/contact">تماس با ما</Link></li>
                            </ul>
                        </div>

                        <div className="contact">
                            <span>اطلاعات تماس</span>
                            <ul>
                                <li><i className="fa-light fa-location-dot"></i><a>{config.APP_ADDRESS}</a></li>
                                <li><i className="fa-light fa-phone-volume"></i><a>{config.APP_TELEPHONE}</a></li>
                                <li><i className="fa-light fa-envelope"></i><a>{config.APP_EMAIL}</a></li>
                            </ul>
                            <ul className="social-media">
                                <li><a href="/" rel="nofollow" target="_blank"><i className="fa-brands fa-instagram"></i></a></li>
                                <li><a href="/" rel="nofollow" target="_blank"><i className="fa-brands fa-telegram"></i></a></li>
                                <li><a href="/" rel="nofollow" target="_blank"><i className="fa-brands fa-whatsapp"></i></a></li>
                            </ul>
                        </div>

                        <div className="badge">
                            <span>نشان ها</span>
                            <ul className="badge">
                                <li><a href="/" rel="nofollow" target="_blank" title="نماد اعتماد"><i className="fa-solid fa-certificate"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </section>
                <section className="footer-bottom">
                    <div className="copy-right">© تمام حقوق این سایت متعلق به {config.APP_NAME_FA} می‌باشد.</div>
                </section>
            </footer>
        </>
    )
}
