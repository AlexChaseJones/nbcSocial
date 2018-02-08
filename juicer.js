import axios from 'axios';

class Juice {
	constructor() {
		this.url = 'https://www.juicer.io/api/feeds/nbcolympics?per=100';
	}

	fetchPosts(tweets, insta) {
		return axios.get(this.url)
	}
}

module.exports = Juice;