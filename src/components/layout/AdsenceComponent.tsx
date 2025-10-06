import { useEffect } from "react"

export default function AdsenceComponent() {

    if(import.meta.env.VITE_NODE_ENV === "development") {
        return <></>
    }

    useEffect(() => {
        // Push the ad after component mounts
        try {
            // (window.adsbygoogle = window.adsbygoogle || []).push({});
            (window['adsbygoogle'] = window['adsbygoogle'] || []).push();
        } catch (e) {
            console.error('AdSense error:', e);
        }
    }, []);

    return (
        <div className="listing--card">
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-format="fluid"
                data-ad-layout-key="-6t+ed+2i-1n-4w"
                data-ad-client="ca-pub-4055209295792111"
                data-ad-slot="8660047318"
            ></ins>
        </div>
    )
        // <script>
        // (adsbygoogle = window.adsbygoogle || []).push({});
        // </script>
}
