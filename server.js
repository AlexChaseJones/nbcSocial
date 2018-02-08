import express from 'express';
import Juice from './juicer.js';
import Cache from './cache.js';
import template from './html/base.js';
import path from 'path';

const app = express()

const cache = new Cache;

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
	const post = cache.getRandomPost();

	res.send(template(post))
})


app.listen(8080, () => {
	setInterval(() => {
		const juice = new Juice();

		juice.fetchPosts()
		.then(res => {
			cache.updateDataCache(res).then(() => console.log('YAS'))
		}).catch(e => {
			console.log(e)
		})
	}, 1000);
})