'use strict';

const
	debug = require('debug')('epic.rest'),
	epic = require('epic.util'),
	Request = require('epic.request'),
	format = Request.format;


const pack = function(context, base, id)
{
	return {
		index: path => function*(){return yield context.get(format.combine(base, path)).json() },
		get: path => function*(data) {return yield context.get(format.combine(base, path)).qs(id === undefined ? data : [id, data]).json()},
		post: path => function*(data){ return yield context.post(format.combine(base, path)).qs().formJSON(data).json(); },
		put: path => function*(data){ return yield context.put(format.combine(base, path)).qs(id).formJSON(data).json(); },
		patch: path => function*(data){ return yield context.patch(format.combine(base, path)).qs(id).formJSON(data).json(); },
		delete: path => function*(){return yield context.delete(format.combine(base, path)).qs(id).json()}
	};
};


class Rest
{
	constructor(opts)
	{
		if (epic.typeof(opts) === 'string')
			opts = {url: opts};

		this.request = new Request(opts.url);
	}

	auth()
	{

	}

	headers()
	{

	}

	resource(path, fn)
	{
		return id =>
		{
			let result =
			{
				index: function*(){return yield this.request.get(path).json() },
				get: function*() {return yield this.request.get(`${path}/:id`).qs(id).json()},
				post: function*(data){ return yield this.request.post(path).formJSON(data).json(); },
				put: function*(data){ return yield this.request.put(`${path}/:id`).qs(id).formJSON(data).json(); },
				patch: function*(data){ return yield this.request.patch(`${path}/:id`).qs(id).formJSON(data).json(); },
				delete: function*(){return yield this.request.delete(`${path}/:id`).qs(id).json()}
			};

			if (!fn) return result;
			let custom = fn(pack(this.request, `${path}/:id`, id), pack(this.request, path));
			for(let key in custom)
				result[key] = custom[key];
			return result;
		};




	}
}



Rest.prototype.res = Rest.prototype.resource;

exports.Client = Rest;