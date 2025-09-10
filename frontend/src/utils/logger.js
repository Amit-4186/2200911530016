export async function Log(stack, level, pkg, message) {
    const body = { stack, level, package: pkg, message };
    try {
        if (!import.meta.env.VITE_LOG_KEY) {
            console.log('[FRONT-LOG]', body);
            return;
        }
        const res = await fetch(import.meta.env.VITE_LOG_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_LOG_KEY}`
            },
            body: JSON.stringify(body)
        });
        if (!res.ok) console.warn('[FRONT-LOG] failed', res.status);
    } catch (err) {
        console.error('[FRONT-LOG]', err.message);
    }
}