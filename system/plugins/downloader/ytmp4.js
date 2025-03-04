const axios = require("axios");
const yts = require('yt-search')
const ytdl = require('ytdl-core')
const fs = require('fs')

let deku = async (m, {
    sock,
    Func,
    Scraper,
    Uploader,
    store,
    text,
    config
}) => {

    if (!text.includes('youtu')) throw "Link Contoh ${m.prefix + m.command} <link>";
    const videoId = await ytdl.getURLVideoID(text)
    if (videoId.length === 0) return m.reply(Func.Styles('Maaf VideoId nya ga valid'))
    let result = await yts({
        videoId: videoId,
        hl: 'id',
        gl: 'ID'
    })

    let hah = result.url;
    let deku = Func.Styles(`⏤͟͟͞͞╳── *[ ytv - download ]* ── .々─ᯤ\n`)
    deku += `│    =〆 ᴛɪᴛʟᴇ: ${result.title}\n`
    deku += `│    =〆 ɪᴅ: ${result.videoId}\n`
    deku += `│    =〆 ᴅᴜʀᴀsɪ: ${result.timestamp}\n`
    deku += `│    =〆 ᴀɢᴏ: ${result.ago}\n`
    deku += `│    =〆 ᴅᴇsᴄʀɪᴘᴛɪᴏɴ: ${result.description}\n`
    deku += `│    =〆 ᴜʀʟ: ${result.url}\n`
    deku += `⏤͟͟͞͞╳────────── .✦`

    await sock.sendMessage(m.cht, {
        text: deku,
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            externalAdReply: {
                title: result.title,
                mediaType: 1,
                previewType: 1,
                body: `Durasi : ${result.timestamp} / View : ${result.views}`,
                thumbnailUrl: result.image,
                renderLargerThumbnail: true,
                mediaUrl: result.url,
                sourceUrl: result.url
            }
        }
    }, {
        quoted: m
    });

    const {
        downloadUrl
    } = await Scraper.ddownr.download(text, '720')
    const filename = `./tmp/${Date.now()}.mp4`
    fs.writeFileSync(filename, downloadUrl)
    const fileSize = calculateFileSize(filename);
    if (fileSize > 5 * 1024 * 1024 * 1024) { // 5 GB
        return m.reply('File terlalu besar untuk dikirim. Maksimum ukuran file adalah 5 GB.');
    }

    if (fileSize > 1.5 * 1024 * 1024 * 1024) { // 1.5 GB
        return m.reply('File melebihi batas 1.5 GB.');
    }


    let capt = ` =〆 ᴛɪᴛʟᴇ: ${result.title}\n`
    capt += ` =〆 ɪᴅ: ${result.videoId}\n`
    capt += ` =〆 ᴅᴜʀᴀsɪ: ${result.timestamp}\n`
    capt += ` =〆 ᴀɢᴏ: ${result.ago}\n`
    capt += ` =〆 ᴜʀʟ: ${result.url}`

    if (fileSize <= 100 * 1024 * 1024) { // 100 MB
        try {
            await Scraper.ytmp3cc(text, 'mp4').then(async (a) => {
                sock.sendMessage(m.cht, {
                    video: {
                        url: a.link
                    },
                    caption: capt
                }, {
                    quoted: m
                })
            })
        } catch (err) {
            try {
                await axios.get('https://ytdl-api.caliphdev.com/download/video?url=' + 'https://youtube.com/watch?v=' + videoId).then(async (a) => {
                    sock.sendMessage(m.cht, {
                        video: {
                            url: a.data.downloadUrl
                        },
                        caption: capt
                    }, {
                        quoted: m
                    })
                })
            } catch (err) {
                try {
                    await sock.sendMessage(m.cht, {
                        video: {
                            url: downloadUrl
                        },
                        caption: capt
                    }, {
                        quoted: m
                    })
                } catch (err) {
                    m.reply('error' + err)
                }
            }
        }

    } else {
        try {

            await Scraper.ytmp3cc(text, 'mp4').then(async (a) => {
                sock.sendMessage(m.cht, {
                    document: {
                        url: a.link
                    },
                    mimetype: 'video/mp4',
                    fileName: result.title + '.mp4',
                    caption: capt
                }, {
                    quoted: m
                })
            })
        } catch (err) {
            try {

                sock.sendMessage(m.cht, {
                    document: {
                        url: downloadUrl
                    },
                    mimetype: 'video/mp4',
                    fileName: result.title + '.mp4'
                }, {
                    quoted: m
                })
            } catch (err) {
                try {

                    await axios.get('https://ytdl-api.caliphdev.com/download/video?url=' + 'https://youtube.com/watch?v=' + videoId).then(async (a) => {
                        sock.sendMessage(m.cht, {
                            document: {
                                url: a.data.downloadUrl
                            },
                            mimetype: 'video/mp4',
                            fileName: result.title + '.mp4',
                            caption: capt
                        }, {
                            quoted: m
                        })
                    })
                } catch (err) {
                    m.reply('error' + err)
                }
            }
        }
    }
    m.react('✅')
}

deku.command = "ytmp4"
deku.alias = ["ytv", "yt-video"]
deku.category = ["downloader"]
deku.settings = {
    limit: true
}
deku.description = "Mendownload YouTube Video"
deku.loading = true

module.exports = deku

function calculateFileSize(filePath) {
    const stats = fs.statSync(filePath);
    return stats.size;
}
