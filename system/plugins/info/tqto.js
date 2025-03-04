const fs = require('node:fs')
  module.exports = {
  command: "tqto",
  alias: ["credit"],
  category: ["info"],
  description: "List Contrubutor bot ini",
  async run(m, { sock, config, Func }) {
    let cap = `*TERIMAKASIH KEPADA :*
allahhh
`;

await m.reply({
  document: fs.readFileSync("./image/doc.txt"),
fileName: Func.Styles(`Thank You To`),
mimetype: 'application/msword',
jpegThumbnail:await sock.resize(fs.readFileSync("./image/Hanako-replydoc.jpg"), 356, 200),
caption: cap,
contextInfo: {
      isForwarded: true,
     forwardingScore: 99999,
    forwardedNewsletterMessageInfo: {
        newsletterJid: config.saluran,
        serverMessageId: -1,
        newsletterName: `${Func.Styles(`Tqto By: ${config.ownername}`)}`,
       }
     }
    });
  },
};