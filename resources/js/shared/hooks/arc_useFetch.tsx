import { useEffect, useState } from "react";

export default function useFetch(url: string, parameters: object){
    let [data, setData] = useState(null)
    let [error, setError] = useState(null)

    // loading(true)
    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(result => setData(result))
            .catch(err => setError(err))
            //.finally(() => //loading(false))
    }, [url, parameters])

    return {data, error}
}
