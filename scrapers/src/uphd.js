const axios = require('axios');
const cheerio = require('cheerio');

class uphd {
uphds = async function uphd(searchTerm) {
    try {
        const response = await axios.get(`https://www.uhdpaper.com/search?q=${searchTerm}&by-date=true`);
        const html = response.data;
        const $ = cheerio.load(html);
        const results = [];


        $('article.post-outer-container').each((index, element) => {
            const title = $(element).find('.snippet-title h2').text().trim();
            const imageUrl = $(element).find('.snippet-title img').attr('src');
            const resolution = $(element).find('.wp_box b').text().trim();
            const link = $(element).find('a').attr('href');

            results.push({ title, imageUrl, resolution, link });
        });

        return results;
    } catch (error) {
        console.error('Error scraping UHDPaper:', error);
        return [];
    }
}
}

module.exports = new uphd()