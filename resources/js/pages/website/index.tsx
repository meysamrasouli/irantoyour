import { Head } from '@inertiajs/react'
import Layout from "@/pages/website/_layout";
import { PageDetailInterface } from "@/shared/types/pageDetailInterface";

interface ControllerPropsInterface {
    pageDetail: PageDetailInterface;
}

export default function Home() {
    return (
        <>
            <Head title="صفحه اصلی" />
            <Layout>
                <main className="index">
                    <section className="hero">
                        <div className="middle">
                            <img src="/images/pages/website/index/section_hero.jpg" alt=""/>
                            <div>
                                <h1>ایران طیور</h1>
                                <p>بازار تخصصی و هوشمند صنعت طیور ایران</p>
                                <p>اولین پلتفرم تخصصی مبتنی بر نقشه برای پایش قیمت، تامین نهاده و مدیریت لجستیک زنده</p>
                            </div>
                        </div>
                    </section>
                    <section className="section-block benefit">
                        <div className="middle">
                            <div className="section-detail">
                                <h2>مزایای <span className="accent-text">سامانه هوشمند ما</span></h2>
                                <div className="section-description">یافتن شرکای تجاری، رصد قیمت‌ها در مناطق مختلف و مسیریابی بهینه لجستیک، همه در یک پلتفرم جامع.</div>
                            </div>

                            <ul className="benefit-list">
                                <li>
                                    <i className="fa-regular fa-crosshairs label-green"></i>
                                    <div>مکان‌یابی دقیق آگهی‌ها</div>
                                    <p>مشاهده لحظه‌ای موقعیت جغرافیایی فروشندگان و خریداران فعال در سطح کشور</p>
                                </li>
                                <li>
                                    <i className="fa-regular fa-chart-line-up label-orange"></i>
                                    <div>رصد منطقه‌ای قیمت‌ها</div>
                                    <p>تحلیل و مقایسه شاخص‌های قیمتی محصولات طیور به تفکیک استان‌ها</p>
                                </li>
                                <li>
                                    <i className="fa-regular fa-truck label-secondary"></i>
                                    <div>مدیریت هوشمند لجستیک</div>
                                    <p>اتصال مستقیم به ناوگان حمل و نقل تخصصی طیور و مسیریابی امن بار</p>
                                </li>
                                <li>
                                    <i className="fa-regular fa-chart-mixed-up-circle-dollar label-red"></i>
                                    <div>تحلیل و پیش بینی بازار</div>
                                    <p>دسترسی به گزارش های نحلیلی و پیش بینی نوسان قیمت در بازار طیور</p>
                                </li>
                            </ul>
                        </div>
                    </section>
                    <section className="section-block chain-supply">
                        <div className="middle">
                            <div>
                                <div className="section-detail">
                                    <h2>پوشش کامل <span className="accent-text">زنجیره تامین</span></h2>
                                    <p>پوشش مراحل زنجیره تامین از نهاده تا رسیدن محصول به دست مصرف‌کننده.</p>
                                </div>
                                <ul>
                                    <li>
                                        <i className="fa-regular fa-wheat-alt label-primary"></i>
                                        <h3>تامین نهاده‌های دامی</h3>
                                        <p>دسترسی بی‌واسطه به واردکنندگان و تولیدکنندگان برتر خوراک دام و طیور در سراسر کشور.</p>
                                    </li>
                                    <li>
                                        <i className="fa-regular fa-chart-network label-primary"></i>
                                        <h3>تولید و پرورش</h3>
                                        <p>ارتباط مستقیم مرغداران با خریداران عمده و شبکه‌های توزیع برای فروش سریع‌تر محصولات.</p>
                                    </li>
                                    <li>
                                        <i className="fa-regular fa-truck-ramp-box label-primary"></i>
                                        <h3>لجستیک و توزیع</h3>
                                        <p>هماهنگی هوشمند حمل و نقل تخصصی برای انتقال ایمن و سریع محصولات به بازارها.</p>
                                    </li>
                                </ul>
                            </div>

                            <img src="/images/pages/website/index/chain_supply.jpg" alt=""/>
                        </div>
                    </section>
                    <section className="section-block register">
                        <div className="middle">
                            <h2>آماده پیوستن به بزرگترین شبکه تجارت طیور هستید؟</h2>
                            <p>همین حالا ثبت نام کنید و به جمع هزاران فعال صنعت طیور بپیوندید و کسب‌وکار خود را متحول کنید.</p>
                            <button type="button" className="custom-button-secondary"><i className="fa-regular fa-user-check icon-right"></i><span>ثبت نام فوری</span></button>
                        </div>
                    </section>
                </main>
            </Layout>
        </>
    )
}
