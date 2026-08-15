import * as React from "react";
import {Link} from "@inertiajs/react";
import {zustandStore} from "@/shared/store/zustandStore";
import Navbar from './_navbar'
import ArcNotification from '@/components/ui/arc_notification'
import ArcSelect from "@/components/ui/arc_select";
import ArcOverlayLoading from "@/components/ui/arc_overlay";

interface Props {
    children: React.ReactNode
}
export default function Layout({ children }: Props) {
    let overlayLoading = zustandStore(state => state.overlayLoading)
    let updateNotification = zustandStore(state => state.updateNotification)
    updateNotification({mode: 'success', text: 'heyyyyy'})

    return (
        <>
            <ArcOverlayLoading />
            <ArcNotification />

            <header></header>

            {children}

            <footer></footer>
        </>
    )
}
