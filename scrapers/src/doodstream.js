const axios = require('axios');
const cheerio = require('cheerio');

async function fetchData(url) {
    const id = url.match(/\/[de]\/(\w+)/)?.[1];
    if (!id) {
        return { success: false, message: "Link nya gak bisa diproses bree, ganti link yang baru aja " };
    }
    const proxy = "https://rv.lil-hacker.workers.dev/proxy?mirror=dood&url=";
    const headers = {
        Accept: "*/*",
        Referer: "https://d000d.com/",
        "User-Agent": "Postify/1.0.0",
    };
    await new Promise((resolve) => setTimeout(resolve, 14000));
    const { data } = await axios.get(`https://dood.li/d/${id}`);
    const $ = cheerio.load(data);
    if (!$("#os_player iframe").length) return {};

    const result = {
        title: $(".title-wrap h4").text().trim(),
        duration: $(".length").text().trim(),
        size: $(".size").text().trim(),
        uploadDate: $(".uploadate").text().trim(),
    };

    const { data: dp } = await axios.get(
        `${proxy}https://d000d.com/e/${id}`,
        { headers },
    );
    const cdn = dp.match(/\$.get\('([^']+)',/)?.[1];
    if (!cdn) {
        return { success: false, message: "Link Pass MD5 gak ada! coba lagi aja nanti ..." };
    }
   const chars = Array.from(crypto.getRandomValues(new Uint8Array(10)))
        .map((x) =>
          String.fromCharCode(
            (x % 62) + (x % 62 < 26 ? 65 : x % 62 < 52 ? 97 : 48),
          ),
        )
        .join("");
    const ds = await axios.get(`${proxy}https://d000d.com${cdn}`, {
        headers,
    });
    const cm = cdn.match(/\/([^/]+)$/)?.[1];
    result.download = `${proxy}${ds.data}${chars}?token=${cm}&expiry=${Date.now()}`;

    const dlink = $(".download-content a").attr("href");
    if (dlink) {
        const dp = cheerio.load(
            (await axios.get(`https://dood.li/d/${dlink}`)).data,
        );
        result.download =
       await shortlink(dp("a.btn.btn-primary.d-flex").attr("href") || dp("div.col-md-12 a.btn.btn-primary").attr("href") || result.download);
    }
    return result
}
async function shortlink(url) {
return axios.post('https://cleanuri.com/api/v1/shorten', {
       url
   }).then(a => a.data.result_url);
}
module.exports = fetchData