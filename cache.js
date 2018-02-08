var url = require('url');
var http = require('http');
 
var sizeOf = require('image-size');

import striptags from 'striptags';

export default class Cache {
	constructor() {
		this.data;
	}

	normalize(node) {
		const source = node.source.source;
		const imageOrientation = node.height < node.width ? 'landscape' : 'portrait';

		let obj = {};

		obj.imagesrc = node.image;
			
		const messageWithTagsRemoved = striptags(node.unformatted_message, [], ' ');
		let message;

		if (messageWithTagsRemoved.length > 120) {
			obj.message = messageWithTagsRemoved.substring(0, 120) + '...';

		} else {
			obj.message =	node.unformatted_message;
		}

		obj.username = node.source.term;
		obj.imageOrientation = imageOrientation;
		obj.imageHeight = node.height;
		if (source === "Twitter") {
			obj.source = 'twitter';
		} else if (source === "Instagram") {
			obj.source = 'insta';
		}

		return obj || null;
	}

	getImageDimensions(node) {
		var options = url.parse(node.imagesrc.replace('https', 'http'));

		return new Promise((resolve, reject) => {
			http.get(options, function (response) {
			  var chunks = [];
			  response.on('data', function (chunk) {
			    chunks.push(chunk);
			  }).on('end', function() {
			    var buffer = Buffer.concat(chunks);
			    var dimensions = sizeOf(buffer);

			    resolve({width: dimensions.width, height: dimensions.height})
			  });
			});
		})

	}

	updateDataCache(data) {
		const _data = data.data.posts.items.map(i => this.normalize(i));

		let promises = _data.map((i, index) => this.getImageDimensions(i));

		return Promise.all(promises)
		.then(res => {
			for (var i = 0; i < res.length; i++) {
				const imageOrientation = res[i].height < res[i].width ? 'landscape' : 'portrait';
				
				if (imageOrientation === 'landscape') {
					if (res[i].width >= 930) {
						_data[i].styleObj = `height: ${res[i].height}px`;
					} else {
						const scale = 930 / res[i].width;
						_data[i].styleObj = `height: ${res[i].height * scale}px`
					}
				} else if (imageOrientation === 'portrait') {
					_data[i].styleObj = "height: 930px"
				}
			}
			this.data = _data;
		})
	}

	getRandomInt() {
	  return Math.floor(Math.random() * (this.data.length));
	}

	getRandomPost() {
		return this.data[this.getRandomInt()]
	}
}