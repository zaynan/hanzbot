const axios = require("axios");

let deku = async (m, {
    sock,
    Func,
    Scraper,
    Uploader,
    store,
    text,
    config
}) => {
    if (!text)
        throw `> *乂 Cara Penggunaan :*
> *-* Masukan Query untuk mencari video
> *-* Masukan Url untuk mendownload musik

> *乂 Contoh Penggunaan :*
> *- ${m.prefix + m.command} Menggapai mentari - Aretha Kirana
> *- ${m.prefix + m.command} https://open.spotify.com/track/52SSvrnwEf8VUW1Y5IwPEw*`;

    if (/open.spotify.com/.test(text)) {

        const downloadersp = await axios.get('https://spotifyapi.caliphdev.com/api/info/track?url=' + text).then(a => a.data)

        let cap = `*– 乂 Spotify - download*
`;
        cap += `> ${Func.Styles(`title: ${downloadersp.title}`)}\n`;
        cap += `> ${Func.Styles(`duration: ${downloadersp.duration}`)}\n`;
        cap += `> ${Func.Styles(`cover:`)} ${downloadersp.durationMs}\n`;
        m.reply(cap)
        try {
            const spdl = await Scraper.SpotifydlV2(text)

            sock.sendMessage(m.cht, {
                audio: {
                    url: spdl.dl
                },
                mimetype: 'audio/mpeg'
            }, {
                quoted: m
            })
        } catch (err) {
            try {
                sock.sendMessage(m.cht, {
                    audio: {
                        url: `https://spotifyapi.caliphdev.com/api/download/track?url=${downloadersp.url}`,
                    },
                    mimetype: "audio/mpeg",
                }, {
                    quoted: m
                });
            } catch (err) {
                try {
                    const downloadersp = await Scraper.fabdlsp(text)
                    let capt = `*– 乂 Spotify - download*
`;
                    capt += `> ${Func.Styles(`title: ${downloadersp.title}`)}\n`;
                    capt += `> ${Func.Styles(`duration: ${downloadersp.duration}`)}\n`;
                    capt += `> ${Func.Styles(`cover:`)} ${downloadersp.cover}\n`;
                    capt += `> ${Func.Styles(`url:`)} ${downloadersp.download}\n`;
                    m.reply(capt)
                    sock.sendMessage(m.cht, {
                        audio: {
                            url: downloadersp.download,
                        },
                        mimetype: "audio/mpeg",
                    }, {
                        quoted: m
                    });
                } catch (err) {
                    m.reply('maaf error......')
                }
            }
        }

    } else {
        let data = await Scraper.spotify.search(text);
        let caps = `*– 乂 Spotify - search*
`;
        caps += `> ${Func.Styles(`title: ${data[0].title}`)}\n`;
        caps += `> ${Func.Styles(`duration: ${data[0].duration}`)}\n`;
        caps += `> ${Func.Styles(`artist: ${data[0].artist}`)}\n`;
        caps += `> ${Func.Styles(`url:`)} ${data[0].url}\n`;
        m.reply(caps)

        try {
            const spdl = await Scraper.SpotifydlV2(data[0].url)

            sock.sendMessage(m.cht, {
                audio: {
                    url: spdl.dl
                },
                mimetype: 'audio/mpeg'
            }, {
                quoted: m
            })
        } catch (err) {
            try {
                sock.sendMessage(m.cht, {
                    audio: {
                        url: `https://spotifyapi.caliphdev.com/api/download/track?url=${data[0].url}`,
                    },
                    mimetype: "audio/mpeg",
                }, {
                    quoted: m
                });
            } catch (err) {
                try {
                    const downloadersp = await Scraper.fabdlsp(data[0].url)
                    sock.sendMessage(m.cht, {
                        audio: {
                            url: downloadersp.download,
                        },
                        mimetype: "audio/mpeg",
                    }, {
                        quoted: m
                    });
                } catch (err) {
                    m.reply('maaf error......')
                }
            }
        }
    }
}

deku.command = "spotify"
deku.alias = []
deku.category = ["downloader"]
deku.settings = {
    limit: true
}
deku.description = "Mendownload/Search Music Spotify"
deku.loading = true

module.exports = deku