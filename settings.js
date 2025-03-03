const fs = require('node:fs');
const config = {
    owner: ["6285879618122"],
    name: "zaynan-botz",
    ownername: 'zawlan', 
    ownername2: 'lanzz',
    prefix: [".", "?", "!", "/", ""], //Tambahin sendiri prefix nya kalo kurang
    wagc: 'https://whatsapp.com/channel/0029VaoNzzlJJhzQTJBL5n0F',
    saluran: '120363359704398503@newsletter', 
    jidgroupnotif: '120363186113099732@g.us', 
    saluran2: '120363359704398503@newsletter', 
    jidgroup: '120363368798656053@g.us', 
    jidch: '120363336559951727@g.us', 
    sessions: "sessions",
    sticker: {
      packname: "žaynan-bot",
      author: "by : lanzz 〆"
    },
   messages: {
      wait: "*( Loading )* Tunggu Sebentar ya...",
      owner: "*( Denied )* gamau kamu siapa !",
      premium: "*( Denied )* Fitur ini khusus user premium bang😁",
      group: "*( Denied )* Fitur ini khusus group bang",
      botAdmin: "*( Denied )* Lu siapa bukan Admin group njirr",
      grootbotbup: "*( Denied )* Jadiin źàýñãñ-Botz admin dulu baru bisa akses",
   },
   database: "hanako-db",
   tz: "Asia/Jakarta"
}

module.exports = config

let file = require.resolve(__filename);
fs.watchFile(file, () => {
   fs.unwatchFile(file);
  delete require.cache[file];
});
