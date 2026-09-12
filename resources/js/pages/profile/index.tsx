import Layout from "@/pages/profile/_layout";
import {Head} from "@inertiajs/react";
import Widget from "@/components/profile/index/widget";

export default function Index(){
    const widgetItems = [
        { icon: 'fa-hourglass label-green', value: '۴۵ روز', title: 'اشتراک من' },
        { icon: 'fa-wallet label-blue', value: '۲,۴۵۰,۰۰۰ تومان', title: 'کیف پول' },
        { icon: 'fa-bullhorn label-red', value: '۳ آگهی', title: 'آگهی‌های من' },
        { icon: 'fa-barn-silo label-primary', value: '۲ واحد', title: 'واحدهای من' },
        { icon: 'fa-regular fa-cog label-secondary', value: 'تنظیمات مالی', title: 'تنظیمات مالی' },
    ];

    return (
        <>
            <Head title="پروفایل" />
            <Layout>
                <main className="index">
                    <section className="widget">
                        <Widget items={widgetItems} staticBreakpoint={3}/>
                    </section>
                </main>
            </Layout>
        </>
    )
}
