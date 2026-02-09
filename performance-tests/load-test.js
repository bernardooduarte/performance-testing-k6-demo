import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '20s', target: 50 },
        { duration: '1m', target: 50 },
        { duration: '20s', target: 0 },
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<250'],
    },
};

export default function () {
    const url = 'http://host.docker.internal:3000/items';

    if (Math.random() > 0.5) {
        const payload = JSON.stringify({ name: `Load Test Item ${Math.random()}` });
        const params = { headers: { 'Content-Type': 'application/json' } };
        const res = http.post(url, payload, params);
        check(res, { 'status is 201': (r) => r.status === 201 });
    } else {
        const res = http.get(url);
        check(res, { 'status is 200': (r) => r.status === 200 });
    }

    sleep(1);
}