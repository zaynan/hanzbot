const axios = require('axios');
const yts = require('yt-search')

class ddownr2 {
    constructor(url) {
        this.url = url;
        this.video = ['360', '480', '720', '1080', 'mp3', 'm4a', 'opus', 'ogg'];
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    }
    download = async (type) => {
        if (!type) {
            throw new Error('Format nya gk support wak, coba cek lagi listnya.');
        }
        const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:v\/|e(?:mbed)?\/|watch\?v=|[^\/\n\s]+\/\S+\/)([a-zA-Z0-9_-]{11}))|(?:https?:\/\/(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11}))/;
        const match = this.url.match(regex);
        const metadata = await yts({
            videoId: match[1],
            hl: 'id',
            gl: 'ID'
        })

        try {
            const response = await axios.get(`https://p.oceansaver.in/ajax/download.php?format=${type}&url=${this.url}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`, {
                headers: this.headers
            });
            if (response.data && response.data.success) {
           const { download_url } = await this.cekProgress(response.data.id)
                return {
                    metadata: {
                        title: metadata.title,
                        id: metadata.videoId,
                        author: metadata.author,
                        seconds: metadata.seconds,
                        views: metadata.views,
                        timestamp: metadata.timestamp,
                        image: {
                            thumbnail: metadata.thumbnail,
                            image: metadata.image
                        },
                        url: "https://youtube.com/watch?v=" + metadata.videoId
                    },
                    dl: download_url
                }
            } else {
                console.log(`[ ! ] ${data.text} : ${data.progress}/1000`);
            };
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
    cekProgress = async (id) => {
        try {
            while (true) {
                const response = await axios.get(`https://p.oceansaver.in/ajax/progress.php?id=${id}`, { headers: this.headers });

                if (response.data && response.data.success && response.data.progress === 1000) {
                    return response.data.download_url;
                }
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}

module.exports = ddownr2