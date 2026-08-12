import { create } from 'zustand'

interface zustandStoreInterface {
    breadcrumb: BreadcrumbInputInterface[];
    updateBreadcrumb: (payload: BreadcrumbInputInterface[]) => void;

    notification: NotificationInputInterface | null;
    updateNotification: (payload: NotificationInputInterface | null) => void;

    overlayLoading: boolean;
    updateOverlayLoading: (payload: boolean) => void;
}

//------------------------------| breadcrumb
export interface BreadcrumbInputInterface {
    text: string;
    url?: string;
}
//------------------------------| notification
export type NotificationMode = 'success' | 'warning' | 'error' | 'info';
export interface NotificationInputInterface {
    mode: NotificationMode;
    text: string;
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
