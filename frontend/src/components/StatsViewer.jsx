import { useState } from "react"
import { Log } from "../utils/logger"

export default function StatsViewer() {
    const [code, setCode] = useState("")
    const [stats, setStats] = useState(null)
    const [error, setError] = useState(null)

    const getStats = async () => {
        setError(null)
        setStats(null)

        try {
            Log("frontend", "info", "component", `Fetching stats for "${code}"`)

            const response = await fetch(`${import.meta.env.VITE_API_URL}/shorturls/${code}`)
            const data = await response.json()

            if (!response.ok) {
                const message = data.error || "Something went wrong. Please try again."
                setError(message)
                Log("frontend", "error", "component", `Stats fetch failed: ${message}`)
            } else {
                setStats(data)
                Log("frontend", "info", "component", "Stats fetched successfully")
            }
        } catch (e) {
            setError("Unable to fetch stats right now. Please check your connection.")
            Log("frontend", "error", "component", `Exception: ${e.message}`)
        }
    }

    return (
        <div className="card">
            <h2>View Stats</h2>
            <input
                type="text"
                placeholder="Enter shortcode"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
            <button onClick={getStats}>Get Stats</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {stats && (
                <div className="stats">
                    <p><b>Original URL:</b> {stats.url}</p>
                    <p><b>Created At:</b> {stats.createdAt}</p>
                    <p><b>Expiry:</b> {stats.expiry}</p>
                    <p><b>Total Clicks:</b> {stats.clicks}</p>
                    <h4>Click Events</h4>
                    <ul>
                        {stats.events?.map((event, idx) => (
                            <li key={idx}>
                                {event.t} | {event.referrer || "no ref"} | {event.source}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
