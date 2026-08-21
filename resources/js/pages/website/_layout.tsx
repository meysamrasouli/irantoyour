import * as React from "react";
import {useState} from "react";
import {Link} from "@inertiajs/react";
import Navbar from './_navbar'
import ArcSelect from "@/components/ui/arc_select";
import ArcOverlayLoading from "@/components/ui/arc_overlay";

interface Props {
    children: React.ReactNode
}
export default function Layout({ children }: Props) {
    return (
        <>
            <ArcOverlayLoading />
            <header>
                <div className="middle">
                    <Link href="/" className="logo">
                        <img src="/images/logo/logo.png" alt="" />
                        <span>ایران طیور</span>
                    </Link>

                    <Navbar />

                    <div className="user-menu-wrapper">
                        <div className="viewer-menu">
                            <a href="/login" className="custom-button-trans-text">
                                <span>ورود</span><i className="fa-regular fa-sign-in icon-left"></i>
                            </a>
                            <Link href="/register" className="custom-button">عضویت</Link>
                        </div>
                        <div className="user-menu">
                            <a><i className="fa-regular fa-user"></i></a>
                            <ul>
                                <li>
                                    <a href="/profile"><i className="fa-regular fa-user"></i><span>حساب کاربری</span></a>
                                </li>
                                <li>
                                    <a><span><i className="fa-solid fa-arrow-right-from-bracket"></i>خروج</span></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>

            {children}

            <footer>
                <section className="detail">
                    <div className="middle">
                        <div className="about">
                            <img src="/images/logo/logo.png" alt="APP_NAME_FA" />
                            <p>ایران طیور با بهره‌گیری از تکنولوژی روز دنیا و تلفیق آن با نیازهای بومی صنعت مرغداری کشور، پلتفورمی پیشرو، امن و سریع برای ثبت آگهی در صنعت طیور ایران ایجاد نموده تا شما را در جریان آخرین معاملات کل کشور قرار دهد.</p>
                        </div>

                        <div className="quick-link">
                            <span>دسترسی سریع</span>
                            <ul>
                                <li><Link href="/about">درباره ما</Link></li>
                                <li><Link href="/term">قوانین و مقررات</Link></li>
                                <li><Link href="/contact">تماس با ما</Link></li>
                            </ul>
                        </div>

                        <div className="contact">
                            <span>اطلاعات تماس</span>
                            <ul>
                                <li><i className="fa-light fa-location-dot"></i><a>تهران، شهران</a></li>
                                <li><i className="fa-light fa-phone-volume"></i><a>09127979335</a></li>
                                <li><i className="fa-light fa-envelope"></i><a>info@irantoyour.com</a></li>
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
                                <li><a href="/" rel="nofollow" target="_blank"><i className="fa-brands fa-instagram"></i></a></li>
                                <li><a href="/" rel="nofollow" target="_blank"><i className="fa-brands fa-instagram"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </section>
                <section className="footer-bottom">
                    <div className="copy-right">© تمام حقوق این سایت متعلق به می‌باشد.</div>
                </section>
            </footer>
        </>
    )
}
