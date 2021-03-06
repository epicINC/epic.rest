'use strict';

const
	debug = require('debug')('epic.rest'),
	epic = require('epic.util'),
	Request = require('epic.request');

const alias = function(context)
{
	if (context.index)
		context.show = context.index;

	if (context.post)
		context.create = context.post;

	if (context.put)
		context.update = context.put;

	return context;
};



const pack = function(context, base, id)
{
	return epic.with(
	{
		// 
		index: path => function () {
			return context.get(base).qs(id).path(path).json();
		},
		get: path => function (query, data) {
			if (arguments.length === 1)
				return context.get(base).qs(id).path(path).qs(query).json();
			else
				return context.get(base).qs(id).path(path).qs(query).form(data).json();
		},
		post: path => function (query, data) {
			if (arguments.length === 1)
				return context.post(base).qs(id).path(path).form(query).json();
			else
				return context.post(base).qs(id).path(path).qs(query).form(data).json();
		},
		put: path => function (query, data) {
			if (arguments.length === 1)
				return context.put(base).qs(id).path(path).form(query).json();
			else
				return context.put(base).qs(id).path(path).qs(query).form(data).json();
		},
		patch: path => function (query, data) {
			if (arguments.length === 1)
				return context.patch(base).qs(id).path(path).form(query).json();
			else
				return context.patch(base).qs(id).path(path).qs(query).form(data).json();
		},
		del: path => function (query, data) {
			if (arguments.length === 1)
				return context.delete(base).qs(id).path(path).qs(query).json();
			else
				return context.delete(base).qs(id).path(path).qs(query).form(data).json();
		},
	}, alias);

};


class Rest {
	constructor(opts) {
		if (epic.typeof(opts) === 'string')
			opts = {url: opts};
		opts.format = opts.format || 'json'
		this.request = new Request(opts);

	}

	auth () {

	}


	resource (path, fn) {
		let self = this;
		return id => {
			let result = {
				index: function (){ return self.request.get(path).json(); },
				get: function () { return self.request.get(`${path}/:id`).qs(id).json(); },
				post: function (data){ return self.request.post(path).formJSON(data).json(); },
				put: function (data){ return self.request.put(`${path}/:id`).qs(id).formJSON(data).json(); },
				patch: function (data){ return self.request.patch(`${path}/:id`).qs(id).formJSON(data).json(); },
				del: function (){ return self.request.delete(`${path}/:id`).qs(id).json(); }
			};

			alias(result);

			if (!fn) return result;
			let custom = fn(pack(self.request, `${path}/:id`, id), pack(self.request, path));
			for(let key in custom)
				result[key] = custom[key];

			return result;
		};




	}
}

Rest.prototype.res = Rest.prototype.resource;

exports.Client = Rest;