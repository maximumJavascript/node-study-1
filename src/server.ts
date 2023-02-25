import * as http from 'node:http';
import { EventEmitter } from 'node:events';

export const server = http.createServer((req, res) => {
	if (!req.url) return res.end();

	const url = new URL(req.url, 'http://localhost:3050');
	const search = url.searchParams.get('message');

	res.setHeader('Content-Type', 'text/plain; charset=utf-8');

	if (!search) {
		res.statusCode = 400;
		res.end('Передайте строку в параметре message GET-запроса');
		return;
	}

	res.statusCode = 200;
	res.end(search);
});

server.listen(3050);

const emitter = new EventEmitter();
const callback = () => setTimeout(() => console.log('aboba'));

emitter.setMaxListeners(1);

emitter.on('aboba', callback);
emitter.on('aboba', callback);
