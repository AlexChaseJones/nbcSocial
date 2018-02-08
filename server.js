import express from 'express';
import Juice from './juicer.js';
import Cache from './cache.js';
import template from './html/base.js';
import path from 'path';

const app = express()

const cache = new Cache;
const juice = new Juice();

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
	const post = cache.getRandomPost();

	res.send(template(post))
})


app.listen(8080, () => {
	run();
	setInterval(() => {
		run()
	}, 300000);
})

function run () {
	juice.fetchPosts()
	.then(res => {
		cache.updateDataCache(res)
		.catch(e => {
			console.log(e)
		})
	})
}