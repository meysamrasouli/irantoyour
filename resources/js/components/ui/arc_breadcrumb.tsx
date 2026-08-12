import React from 'react';
import { Link } from '@inertiajs/react';
import { zustandStore } from '@/shared/store/zustandStore';

export default function AvcBreadcrumb() {
    const breadcrumb = zustandStore((state) => state.breadcrumb);

    return (
        <ul className="arc-breadcrumb">
            {breadcrumb.map((item, index) => (
                <li key={index}>
                    {item.url ? (
                        <Link href={ item.url }>{ item.text }</Link>
                    ) : (
                        <a>{ item.text }</a>
                    )}
                </li>
            ))}
        </ul>
    );
}
