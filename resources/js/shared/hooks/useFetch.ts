import { useEffect, useState } from "react";
import {zustandStore} from "@/shared/store/zustandStore";

export default function useFetch(url: string, parameters: object){
    let [data, setData] = useState(null)
    let [error, setError] = useState(null)
    const updateOverlayLoading = zustandStore((state) => state.updateOverlayLoading);

    useEffect(() => {
        updateOverlayLoading(true)// show overlay loading
        fetch(url)
            .then(response => response.json())
            .then(result => setData(result))
            .catch(err => setError(err))
            .finally(() => updateOverlayLoading(false))// hide overlay loading
    }, [url, JSON.stringify(parameters)])

    return {data, error}
}


