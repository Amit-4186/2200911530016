import { useState } from "react";
import { Log } from "../utils/logger";

export default function ShortenerForm() {
    const [url, setUrl] = useState("");
    const [validity, setValidity] = useState("");
    const [shortcode, setShortcode] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setResult(null);

        try {
            Log("frontend", "info", "component", "sending create short url request");

            const res = await fetch(`${import.meta.env.VITE_API_URL}/shorturls`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    url: url,
                    ...(validity ? { validity: parseInt(validity) } : {}),
                    ...(shortcode ? { shortcode } : {})
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong");
                Log("frontend", "error", "component", `create failed ${data.error}`);
            } else {
                setResult(data);
                Log("frontend", "info", "component", "create success");
            }
        } catch (err) {
            setError("Network error");
            Log("frontend", "error", "component", err.message);
        }
    }

    return (
        <div className="card">
            <h2>Create Short URL</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Long URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Validity (minutes)"
                    value={validity}
                    onChange={(e) => setValidity(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Custom shortcode (optional)"
                    value={shortcode}
                    onChange={(e) => setShortcode(e.target.value)}
                />

                <button type="submit">Shorten</button>
            </form>

            {error && <p className="error">{error}</p>}

            {result && (
                <div className="result">
                    <p>
                        <b>Short Link:</b>{" "}
                        <a href={result.shortLink} target="_blank" rel="noreferrer">
                            {result.shortLink}
                        </a>
                    </p>
                    <p><b>Expires:</b> {result.expiry}</p>
                </div>
            )}
        </div>
    );
}
