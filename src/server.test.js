const request = require('supertest');
const { v4: uuid } = require('uuid');
const { server } = require('./server');

afterAll(() => {
	server.close();
})

describe('HTTP-server', () => {
	it('должен возвращать в ответ параметр \'message\' из GET-запроса', done => {
		const message = uuid()
		request(server)
			.get(`/?message=${message}`)
			.expect('Content-Type', /text\/plain/)
			.expect(200)
			.then(res => {
				expect(res.text).toEqual(message)
				done()
			})
			.catch(done)
	})

	it('должен возвращать подсказку, если параметр \'message\' не указан', done => {
		request(server)
			.get('/')
			.expect('Content-Type', /text\/plain/)
			.expect(400)
			.then(res => {
				expect(res.text).toEqual('Передайте строку в параметре message GET-запроса')
				done()
			})
			.catch(done)
	})
})
