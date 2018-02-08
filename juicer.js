import axios from 'axios';
import moment from 'moment';

class Juice {
	constructor() {
		this.url = this.getUrl();
	}

	getUrl() {
		const yesterday = moment().add(-1, 'days');
		const yesterdayFormatted = yesterday.format('YYYY-MM-DD-HH:mm');
		return `https://www.juicer.io/api/feeds/nbcolympics?starting_at=${yesterdayFormatted}&per=100`
	}

	fetchPosts(tweets, insta) {
		console.log(this.url)
		return axios.get(this.url)
	}
}

module.exports = Juice;