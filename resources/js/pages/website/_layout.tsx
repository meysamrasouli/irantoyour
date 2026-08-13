import * as React from "react";
import {useState} from "react";
import {Link} from "@inertiajs/react";
import Navbar from './_navbar'
import ArcSelect from "@/components/ui/arc_select";
import AvcOverlayLoading from "@/components/ui/arc_overlay";

interface Props {
    children: React.ReactNode
}
export default function Layout({ children }: Props) {
    let [province, setProvince] = useState('')
    let list_province = [{id:1,name:"tehran"},{id:2,name:"karaj"}]

    function onclick_btn (){
        console.log("sdfsdf")

    }



    return (
        <>
            <AvcOverlayLoading />



            <button onClick={ onclick_btn }>loading on</button>
            <ArcSelect
                options={list_province}
                option_properties={{ type: 'array_object', value: 'id', text: 'name' }}
                value={province}
                setValue={setProvince}
                onChange={(val) => console.log('changed:', val)}
                placeholder={'select your province'}
                //selected={{value: 1}}
            />






            <header>
                <div className="middle">
                    <Link href="/" className="logo">
                        <img src="/images/logo/logo.png" alt="" />
                        <span>ایران طیور</span>
                    </Link>

                    <Navbar />

                    <div className="user-detail">
                        <a href="/login" className="custom-button">
                            <span>ورود</span><i className="fa-regular fa-sign-in icon-left"></i>
                        </a>

                        <div>
                            <a><i className="fa-regular fa-regular"></i></a>
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
                            <p>ایران طیور یک پلتفورم پیشرو برای ثبت آگهی در صنعت طیور ایران است. ایران طیور شما را در جریان آخرین معاملات کل کشور قرار می دهد.</p>
                        </div>

                        <div className="social-media">
                            <span>ما را دنبال کنید</span>
                            <ul>
                                <li><a href="/" rel="nofollow" target="_blank"><i className="fa-brands fa-instagram"></i></a></li>
                                <li><a href="/" rel="nofollow" target="_blank"><i className="fa-brands fa-telegram"></i></a></li>
                                <li><a href="/" rel="nofollow" target="_blank"><i className="fa-brands fa-whatsapp"></i></a></li>
                            </ul>
                        </div>

                        <div className="badge">
                            <span>نشان ها</span>
                            <ul>
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
