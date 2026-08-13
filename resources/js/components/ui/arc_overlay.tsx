import React from 'react';
import { zustandStore } from '@/shared/store/zustandStore';

export default function AvcOverlayLoading() {
    let overlayLoading = zustandStore(state => state.overlayLoading)

    return (
        <>
            { overlayLoading && <div className="overlay overlay-loading">LOADING ...</div> }
        </>
    );
}
