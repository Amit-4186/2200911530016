// Shouldn't be public but added for testing
const API = import.meta.env.VITE_LOG_API || 'http://20.244.56.144/evaluation-service/logs';
const KEY = import.meta.env.VITE_LOG_KEY || eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhbWl0a3JwYXRlbDQuMTg2QGdtYWlsLmNvbSIsImV4cCI6MTc1NzQ5MTA1MiwiaWF0IjoxNzU3NDkwMTUyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZTdlYWNiNjQtZThlMC00ZWU2LWJkNTYtMDdhZTM0Yjk4MDBhIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYW1pdCBrdW1hciBwYXRlbCIsInN1YiI6IjJlYTM4NDY2LTczZDgtNGFiNy1iMTMwLTE3MDE0YzFjMjdmYiJ9LCJlbWFpbCI6ImFtaXRrcnBhdGVsNC4xODZAZ21haWwuY29tIiwibmFtZSI6ImFtaXQga3VtYXIgcGF0ZWwiLCJyb2xsTm8iOiIyMjAwOTExNTMwMDE2IiwiYWNjZXNzQ29kZSI6Ik5Xa3RCdSIsImNsaWVudElEIjoiMmVhMzg0NjYtNzNkOC00YWI3LWIxMzAtMTcwMTRjMWMyN2ZiIiwiY2xpZW50U2VjcmV0IjoiWXZXd0toS1lFUnZSZkVVSiJ9.rpE7D9DEqR3Q7nh6lVioRIuRIDU - KMA95YDXyYYzJ9Y;

export async function Log(stack, level, pkg, message) {
    const body = { stack, level, package: pkg, message };
    try {
        if (KEY) {
            console.log('[FRONT-LOG]', body);
            return;
        }
        const res = await fetch(API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${import.meta.env.KEY}`
            },
            body: JSON.stringify(body)
        });
        if (!res.ok) console.warn('[FRONT-LOG] failed', res.status);
    } catch (err) {
        console.error('[FRONT-LOG]', err.message);
    }
}