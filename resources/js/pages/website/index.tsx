import { Head } from '@inertiajs/react'
import Layout from "@/pages/website/_layout";

export default function Home() {
    return (
        <>
            <Head title="صفحه اصلی" />
            <Layout>
                <main className="index">
                    <section className="hero">
                        <div className="middle">
                            <h1>ایران طیور</h1>
                            <div>بازار تخصصی و هوشمند صنعت طیور ایران</div>
                        </div>
                    </section>
                    <section className="benefit">
                        <div className="middle">
                            <h2 className="section-title">مزایای <span className="accent-text">سامانه هوشمند ما</span></h2>
                            <div className="section-title-description">یافتن شرکای تجاری، رصد قیمت‌ها در مناطق مختلف و مسیریابی بهینه لجستیک، همه در یک پلتفرم جامع.</div>

                            <ul className="benefit-list">
                                <li>
                                    <i className="fa-regular fa-crosshairs"></i>
                                    <div>مکان‌یابی دقیق آگهی‌ها</div>
                                    <div>مشاهده لحظه‌ای موقعیت جغرافیایی فروشندگان و خریداران فعال در سطح کشور.</div>
                                </li>
                                <li>
                                    <i className="fa-regular fa-chart-line-up"></i>
                                    <div>رصد منطقه‌ای قیمت‌ها</div>
                                    <div>تحلیل و مقایسه شاخص‌های قیمتی محصولات طیور به تفکیک استان‌ها و شهرستان‌ها.</div>
                                </li>
                                <li>
                                    <i className="fa-regular fa-truck"></i>
                                    <div>مدیریت هوشمند لجستیک</div>
                                    <div>اتصال مستقیم به ناوگان حمل و نقل تخصصی طیور و مسیریابی امن بار.</div>
                                </li>
                            </ul>
                        </div>
                    </section>

                </main>
            </Layout>
        </>
    )
}
