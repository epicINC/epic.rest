'use strict';


const
	co = require('co'),
	Rest = require('../');

let rest = new Rest('http://127.0.0.1:6712/api/1');


let api =
{
	users: rest.res('users', (member, collection) => ({login: collection.get('/login/:id')}))
};

co(function*()
{
	let result = yield api.users().login('1000+001E67070740-jj_xuzhou');
})
.catch(e => console.log(e.stack));

module.exports = config =>
{
	let
		rest = require('json-rest-client')({url: 'http://'+ config.rest.host +':'+ config.rest.port, version: '~1'}, {prefix: '/api/1'});
		rest = new Request('')

	return {
		group: rest.resource('/groups', (member, collection) => ({query: collection.post('/query')}) ),
		member: rest.resource('/members', (member, collection) => ({del: collection.post('/remove') })),
		manager: rest.resource('/managers', (member, collection) => ({del: collection.post('/remove') })),
		message: rest.resource('/messages', (member, collection) => ({unread: collection.post('/unread')})),
		user: rest.resource('/users', (member, collection) => ({login: collection.get('/login'), add: collection.post('/add'), update: collection.post('/update'), del: collection.post('/remove')}))
	};
};