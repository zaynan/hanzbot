const { writeExif, videoToWebp } = require(process.cwd()+"/lib/sticker");

module.exports = {
    command: "pushch2",
    alias: ["psch2"],
    category: ["tools"],
    settings: {
        limit: true,
    },
    description: "PushCh",
    loading: true,
    async run(m, {
        text,
        sock,
        Scraper,
        Func,
        config
    }) {
        let q = m.quoted ? m.quoted : m;
        let media = await q.download()
        let pp = await sock.profilePictureUrl(m.sender, 'image')
        if (/audio/.test(q.msg.mimetype)) {
        await sock.sendMessage(config.saluran, {
            audio: media,
            mimetype: 'audio/mpeg',
            ptt: true,
            contextInfo: {
                mentionedJid: [m.sender],
                isForwarded: !0,
                forwardingScore: 127,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.saluran,
                    newsletterName: `ᴘᴜsʜᴄʜ | ` + config.name,
                    serverMessageId: -1
                },
                externalAdReply: {
                    title: `Pushch Oleh: ${m.pushName}`,
                    body: `${config.ownername2} | ` + config.name,
                    mediaType: 1,
                    thumbnailUrl: pp,
                    sourceUrl: "https://www.tiktok.com/@leooxzy_ganz/",
                }
            }
        })
       } else if (/video/.test(q.msg.mimetype)) {
        await sock.sendMessage(config.saluran, {
            video: media,
            caption: text,
            contextInfo: {
                mentionedJid: [m.sender],
                isForwarded: !0,
                forwardingScore: 127,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.saluran,
                    newsletterName: `ᴘᴜsʜᴄʜ | ` + config.name,
                    serverMessageId: -1
              }
           }
        })
       } else if (/image/.test(q.msg.mimetype)) {
        await sock.sendMessage(config.saluran, {
            audio: media,
            caption: text,
            contextInfo: {
                mentionedJid: [m.sender],
                isForwarded: !0,
                forwardingScore: 127,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.saluran,
                    newsletterName: `ᴘᴜsʜᴄʜ | ` + config.name,
                    serverMessageId: -1
                },
                externalAdReply: {
                    title: `Pushch Oleh: ${m.pushName}`,
                    body: `${config.ownername2} | ` + config.name,
                    mediaType: 1,
                    thumbnailUrl: pp,
                    sourceUrl: "https://www.tiktok.com/@leooxzy_ganz/",
                }
            }
        })
       } else if (/sticker/.test(q.msg.mimetype)) {
        let stickerte = await writeExif(
          {
            mimetype: await q.msg.mimetype,
            data: media,
          },
          {
            packName: config.sticker.packname,
            packPublish: config.sticker.author,
          },
        );
        await sock.sendMessage(config.saluran, {
            sticker: stickerte,
            contextInfo: {
                mentionedJid: [m.sender],
                isForwarded: !0,
                forwardingScore: 127,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.saluran,
                    newsletterName: `ᴘᴜsʜᴄʜ | ` + config.name,
                    serverMessageId: -1
                },
                externalAdReply: {
                    title: `Pushch Oleh: ${m.pushName}`,
                    body: `${config.ownername2} | ` + config.name,
                    mediaType: 1,
                    thumbnailUrl: pp,
                    sourceUrl: "https://www.tiktok.com/@leooxzy_ganz/",
                }
            }
        })
       } else {
        await sock.sendMessage(config.saluran, {
            text: text,
            contextInfo: {
                mentionedJid: [m.sender],
                isForwarded: !0,
                forwardingScore: 127,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.saluran,
                    newsletterName: `ᴘᴜsʜᴄʜ | ` + config.name,
                    serverMessageId: -1
                },
                externalAdReply: {
                    title: `Pushch Oleh: ${m.pushName}`,
                    body: `${config.ownername2} | ` + config.name,
                    mediaType: 1,
                    thumbnailUrl: pp,
                    sourceUrl: "https://www.tiktok.com/@leooxzy_ganz/",
                }
            }
        })
      }
    },
};