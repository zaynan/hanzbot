const fs = require('node:fs')
const pkg = require(process.cwd() + "/package.json")

module.exports = {
    command: "script",
    alias: ["sc", "scbot"],
    category: ["info"],
    description: "Dapatkan Script bot chat ownerr",
    async run(m, {
        sock,
        Func,
        config
    }) {

        let tekssc = Func.Styles(`⏤͟͟͞͞╳── *[ sᴄ ${config.name} ${pkg.version} ]* ── .々─ᯤ
│    =〆 ᴄᴀsᴇ x ᴘʟᴜɢɪɴ
│    =〆 ʙᴀsᴇ ᴀxᴇʟ-ɴᴇᴛᴡᴏʀᴋ
│    =〆 ғɪᴛᴜʀ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ ᴀᴅᴀ
│    =〆 ғɪᴛᴜʀ sᴇᴀʀᴄʜ ᴀᴅᴀ
│    =〆 ғɪᴛᴜʀ ᴀɴɪᴍᴇ ᴀᴅᴀ
│    =〆 ᴅʟʟ ᴀᴅᴀ
│    =〆 ʀᴇᴍᴀᴋᴇ: ᴅᴇᴋᴜɢᴀɴᴢ
│    =〆 Script:\n`)
        tekssc += `│    =〆 gada ahh
│    =〆 ᴄʜ:
│    =〆 https://chat.whatsapp.com/FeOlFfCi24rIEGJQAS2yBd
⏤͟͟͞͞╳────────── .✦`

        await m.reply({
            document: fs.readFileSync("./image/doc.txt"),
            fileName: Func.Styles(`Sc ${config.name}`),
            mimetype: 'application/msword',
            jpegThumbnail: await sock.resize(fs.readFileSync("./image/Hanako-replydoc.jpg"), 356, 200),
            caption: tekssc,
            buttons: [{
                buttonId: ".tqto",
                buttonText: {
                    displayText: 'Thanks you to'
                }
            }],
            viewOnce: true,
            headerType: 6,
            contextInfo: {
                isForwarded: true,
                forwardingScore: 99999,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.saluran,
                    serverMessageId: -1,
                    newsletterName: `${Func.Styles(`Script By: ${config.ownername}`)}`,
                }
            }
        });
    },
};
