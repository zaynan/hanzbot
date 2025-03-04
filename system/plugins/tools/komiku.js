/*
> *[ Plugin Komiku ]*
> Source Scrape: https://whatsapp.com/channel/0029Vb2mOzL1Hsq0lIEHoR0N/120
> Cjs
> *[ Script ]*
> https://github.com/AxellNetwork/NekoBot
> https://devuploads.com/bqr62zcbq2oc
> Source
> Ch1
> https://whatsapp.com/channel/0029VadFS3r89inc7Jjus03W
> Ch2
> https://whatsapp.com/channel/0029VateyJuKWEKhJMRKEL20
*/

const axios = require('axios');
const cheerio = require('cheerio');

class Command {
       constructor() {
       this.command = "komiku"
       this.alias = ["kmi", "manga"] 
       this.category = ["tools"]
       this.settings = {
           limit: true
       }
       this.description = "Mendownload Lagu Spotify"
       this.loading = true
   }
   run = async(m, {
           sock,
           Func,
           Scraper,
           text,
           config,
           store
        }) => {

if(!text) throw ' - *[ Contoh ]*\n\n> Search\n.komiku <query>\n\nDetail\n.komiku <link>'

if (/komiku.id/.test(text)) {
const komide = await Scraper.komiku.detail(text)

  let ya = ` ⏤͟͟͞͞╳─ *[ Komiku Search ]*\n`
     ya += `> =〆 title: ${komide.title}\n`
     ya += `> =〆 desc: ${komide.description}\n`
     ya += `> =〆 genre: ${komide.genres}\n`
     ya += `⏤͟͟͞͞╳────────── .✦`

sock.sendMessage(m.cht, {
         image: {
                 url: komide.coverImage
         },
          caption: ya
         }, {
            quoted: m
         })
    } else {
       const komi = await Scraper.komiku.komiku("manga", text)

       let ya = ` ⏤͟͟͞͞╳─ *[ Komiku Search ]*\n\n`
       for (let i of komi) {
            ya += `⏤͟͟͞͞╳────────── .✦\n`
            ya += `> =〆 title: ${i.title}\n`
            ya += `> =〆 genre: ${i.genre}\n`
            ya += `> =〆 desc: ${i.description}\n`
            ya += `> =〆 url: ${i.url}\n`
            ya += `⏤͟͟͞͞╳────────── .✦\n\n`
   }
            ya += `⏤͟͟͞͞╳────────── .✦`
       m.reply(ya)
    }
  }
}

module.exports = new Command();