import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1,
    duration: '10s',
};

export default function () {
    const url = 'http://host.docker.internal:3000/items';

    const payload = JSON.stringify({ name: 'Item Teste k6' });
    const params = { headers: { 'Content-Type': 'application/json' } };

    const res = http.post(url, payload, params);

    check(res, {
        'status é 201': (r) => r.status === 201,
    });

    sleep(1);
}