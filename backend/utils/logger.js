const LOG_API_URL = process.env.LOG_API_URL || 'http://20.244.56.144/evaluation-service/logs';
const LOG_URL_KEY = process.env.LOG_URL_KEY || null;

export async function Log(stack, level, pkg, message) {
    const body = { stack, level, package: pkg, message };

    try {
        if (!LOG_URL_KEY) {
            console.log("");
            return null;
        }

        const res = await fetch(LOG_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${LOG_API_KEY}`
            },
            body: JSON.stringify(body)
        });
        if (!res.ok) {
            const txt = await res.text();
            console.warn('[LOG-WARN] remote failed', res.status, txt);
            return null;
        }
        const json = await res.json();
        return json;
    }
    catch (err) {
        console.error('[LOG] logging failed', err)
    }
}