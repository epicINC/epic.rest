
// 	let rest = new Rest({url:'http://127.0.0.1:6712/api/1/', ver:'~1'});
let rest = new Rest('http://127.0.0.1:6712/api/1/');
rest.auth();
rest.headers();

let api =
{
	users: rest.resource('users', (member, collection) = > ({login: collection.get('/login')}))
};

