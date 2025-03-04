// source : https://whatsapp.com/channel/0029VaAMjXT4yltWm1NBJV3J
const axios = require('axios')

/* ndbotz */
function getTokens(nyxz, ndbz) {
    for (var t = 0; t < atob(nyxz[0]).split(nyxz.f[6]).length; t++) 
        ndbz += (0 < nyxz.f[5] ? nyxz[1].split('').reverse().join('') : nyxz[1])[atob(nyxz[0]).split(nyxz.f[6])[t] - nyxz.f[4]];
    return 1 == nyxz.f[2] ? ndbz = ndbz.toLowerCase() : 2 == nyxz.f[2] && (ndbz = ndbz.toUpperCase()),
    0 < nyxz.f[1].length ? nyxz.f[1] : 0 < nyxz.f[3] ? ndbz.substring(0, nyxz.f[3] + 1) : ndbz
}
/* ndbotz */
const headers = {
    'Accept': '*/*',
    'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Origin': 'https://ytmp3.cc',
    'Pragma': 'no-cache',
    'Referer': 'https://ytmp3.cc/', 
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'cross-site',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.3',
    'sec-ch-ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
    'sec-ch-ua-mobile': '?1',
    'sec-ch-ua-platform': '"Windows"'
};

const yt = /^((?:https?:)?\/\/)?((?:www|m|music)\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(?:embed\/)?(?:v\/)?(?:shorts\/)?([a-zA-Z0-9_-]{11})/;
/* ndbotz */

async function ytdl(url, type = 'mp3') {
  if (!yt.test(url)) { 
    throw new Error('Link ga valid, input yang bener dong 😡');
  };
/* ndbotz */
  if (!['mp3', 'mp4'].includes(type)) {
    throw new Error('Type ga valid jir, mo download apaan lu 🙄');
  };

  try {
    const vidId = url.match(yt)[3];
    const webb = await axios.get('https://ytmp3.cc/Vluk/', { headers });
/* ndbotz */
    const tokenJson = JSON.parse(atob(webb.data?.match(/atob\('(.*?)'\)/)?.[1]).match(/var gC = ({[\s\S]*?});/)?.[1]); 
    const token = btoa(tokenJson[2] +'-'+ getTokens(tokenJson, tokenJson.f[7]));

    const init = await axios.get(`https://d.ecoe.cc/api/v1/init?k=${token}&_=${Math.random()}`, { headers }).then(x => x.data);
    const convert = await axios.get(`${init.convertURL}&v=https://www.youtube.com/watch?v=${vidId}&f=${type}&_=${Math.random()}`, { headers }).then(x => x.data);

    if (convert.redirectURL) {
      const res = await axios.get(convert.redirectURL, { headers }).then(x => x.data);

      return {
        type,
        title: res.title,
        link: res.downloadURL
      };
    } else {/* ndbotz */
      let res, retry = 0;
      do {
        if (retry > 50) throw 'Timeout';
        res = await axios.get(convert.progressURL, { headers }).then(x => x.data);
        await new Promise(rv => setTimeout(rv, 1000));
        retry++
      } while (res.progress !== 3);
      return {
        type,
        title: res.title,
        link: convert.downloadURL
      };
    };
  } catch(e) {
    throw new Error(`Eror bang, nanti aja download nya, nih log eror nya: ${e.message} 😌`);
  }
}

/* ndbotz */
module.exports = ytdl
