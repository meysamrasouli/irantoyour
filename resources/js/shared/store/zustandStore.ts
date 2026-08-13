import { create } from 'zustand'
import { BreadcrumbInputInterface } from '@/components/ui/arc_breadcrumb'
import { NotificationInputInterface } from '@/components/ui/arc_notification'

interface zustandStoreInterface {
    breadcrumb: BreadcrumbInputInterface[];
    updateBreadcrumb: (payload: BreadcrumbInputInterface[]) => void;

    notification: NotificationInputInterface | null;
    updateNotification: (payload: NotificationInputInterface | null) => void;

    overlayLoading: boolean;
    updateOverlayLoading: (payload: boolean) => void;
}

export const zustandStore = create<zustandStoreInterface>()((set) => ({
    breadcrumb: [],
    updateBreadcrumb: (payload) => set({ breadcrumb: payload }),

    notification: null,
    updateNotification: (payload) => set({ notification: payload }),

    overlayLoading: false,
    updateOverlayLoading: (payload) => set({ overlayLoading: payload }),
}))

// USE:
// let breadcrumb = zustandStore(state => state.breadcrumb)
// let updateBreadcrumb = zustandStore(state => state.updateBreadcrumb)


// WATCH: after every change subscribe function is called
// zustandStore.subscribe((state) => {
//     state.breadcrumb
// })

//# with "persist" you can store variables directly in localStorage
//#
