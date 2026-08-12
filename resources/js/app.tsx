import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import type { ComponentType } from 'react'

createInertiaApp({
    title: (title) => import.meta.env.VITE_APP_NAME_FA + (title ? ' - ' : '') + title,

    // resolve: (name: string) => {
    //     const pages = import.meta.glob<{ default: ComponentType }>('./pages/**/*.tsx')
    //     return pages[`./pages/${name}.tsx`]()
    // },

    resolve: (name: string) => {
        const pages = import.meta.glob('./pages/**/*.tsx', { eager: true })
        return pages[`./pages/${name}.tsx`] as any
    },

    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />)
    },

    progress: {
        delay: 250,
        color: '#0F6E56',
        includeCSS: true,
        showSpinner: false,
    },
})
