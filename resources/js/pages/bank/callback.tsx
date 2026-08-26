import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from "@/pages/website/_layout";

// تعریف نوع Props با دقت بیشتر
interface BankCallbackPropsInterface {
    page: string,
    error: string;
    redirectUrl: string,
}

interface PageDetailInterface {
    title: string;
    description: string;
    icon: {
        src: string,
        alt: string;
    };
    button: {
        text: string;
        href: string;
    };
}

export default function BankCallback({ page, error, redirectUrl }: BankCallbackPropsInterface) {
    const pageDetail: PageDetailInterface = (error === '')
            ? {// success
                title: 'پرداخت موفق',
                description: 'پرداخت با موفقیت انجام شد. برای مشاهده فاکتور به پروفایل مراجعه کنید',
                icon: {
                    src: '/images/icons/modal/success.svg',
                    alt: 'پرداخت موفق',
                },
                button: {
                    text: (page === 'register') ? 'ورود به پروقایل' : 'مشاهده فاکتور',
                    href: redirectUrl,
                },
            } : {// error
                title: 'خطا در پرداخت',
                description: error,
                icon: {
                    src: '/images/icons/modal/error.svg',
                    alt: 'خطا در پرداخت',
                },
                button: {
                    text: 'تلاش مجدد',
                    href: redirectUrl,
                },
            }

    return (
        <>
            <Head title={pageDetail.title} />

            <Layout>
                <main className="bank-callback">
                    <section className="callback-result">
                        <div>
                            <img src={pageDetail.icon.src} alt={pageDetail.icon.alt}/>
                            <h1>{pageDetail.title}</h1>
                            <p>{pageDetail.description}</p>

                            <div className="button-container">
                                <Link className="custom-button-trans-primary" href="/">بازگشت به سایت</Link>
                                <Link className="custom-button" href={pageDetail.button.href}>{pageDetail.button.text}</Link>
                            </div>
                        </div>
                    </section>
                </main>
            </Layout>
        </>
    );
};
