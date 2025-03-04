module.exports = {
  command: "pushch",
  alias: ["psch"],
  category: ["tools"],
  settings: {
    limit: true,
  },
  description: "PushCh",
  loading: true,
  async run(m, { text, sock, Scraper, Func, config }) {
    let q = m.quoted ? m.quoted : m;
let pp = await sock.profilePictureUrl(m.sender, 'image')

if (!text) throw 'masukan teks nya ya oke'

await sock.sendMessage(config.saluran2, {
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

m.reply(`Cek Di Saluran Nya Gw Yang Ini

https://whatsapp.com/channel/0029VateyJuKWEKhJMRKEL20
`)

  },
};