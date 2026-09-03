import Layout from "@/pages/profile/_layout";
import {Head} from "@inertiajs/react";

export default function Index(){
    return (
        <>
            <Head title="صفحه اصلی" />
            <Layout>
                <main className="index">
                    <section className="widget"></section>
                    this is profile page
                </main>
            </Layout>
        </>
    )
}
