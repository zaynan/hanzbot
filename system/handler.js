const config = require("../settings.js");
const Func = require("../lib/function.js");
const serialize = require("../lib/serialize.js");
const Uploader = require("../lib/uploader.js");
const pkg = require("baileys");
const moment = require("moment-timezone");
const cron = require("node-cron");

module.exports = async (m, sock, store) => {
  const client = conn = DekuGanz = sock
  if (m.key.jid === "status@broadcast") {
    await sock.readMessages([m.key]);
    await sock.sendMessage(
      m.key.jid,
      { react: { text: "📸", key: m.key } },
      { statusJidList: Object.keys(store.contact) },
    );
    console.log(
      chalk.green.bold("– 📸 *Membaca Status WhatsApp dari :* " + m.pushName),
    );
    return;
  }

  await db.main(m);
  if (m.isBot) return;
  if (db.list().settings.self && !m.isOwner) return;
  if (m.isGroup && db.list().group[m.cht]?.mute && !m.isOwner) return;
  
  if (Object.keys(store.groupMetadata).length === 0) {
    store.groupMetadata = await sock.groupFetchAllParticipating();
  }

  const isPrems = db.list().user[m.sender].premium.status;
  const isBanned = db.list().user[m.sender].banned.status;
  const isAdmin = m.isAdmin;
  const botAdmin = m.isBotAdmin;
  const Scraper = await scraper.list();
  const usedPrefix = config.prefix.includes(m.prefix);
  const text = m.text;
  const isCmd = m.prefix && usedPrefix;

  if (isCmd) {
    require("./case.js")(m,
      sock,
      client,
      conn,
      DekuGanz,
      config,
      text,
      Func,
      Scraper,
      Uploader,
      store,
      isAdmin,
      botAdmin,
      isPrems,
      isBanned,
    );
  }
  
  cron.schedule("* * * * *", () => {
    let user = Object.keys(db.list().user);
    let time = moment.tz(config.tz).format("HH:mm");
    if (db.list().settings.resetlimit == time) {
      for (let i of user) {
        db.list().user[i].limit = 100;
      }
    }
  });
  for (let name in pg.plugins) {
    let plugin;
    if (typeof pg.plugins[name].run === "function") {
      let anu = pg.plugins[name];
      plugin = anu.run;
      for (let prop in anu) {
        if (prop !== "code") {
          plugin[prop] = anu[prop];
        }
      }
    } else {
      plugin = pg.plugins[name];
    }
    if (!plugin) return;

    try {
      if (typeof plugin.events === "function") {
        if (
          plugin.events.call(sock, m, {
            sock,
            client,
            conn,
            DekuGanz,
            Func,
            config,
            Uploader,
            store,
            isAdmin,
            botAdmin,
            isPrems,
            isBanned,
          })
        )
          continue;
      }

      const cmd = usedPrefix
        ? m.command.toLowerCase() === plugin.command ||
          plugin?.alias?.includes(m.command.toLowerCase())
        : "";
      if (cmd) {
        if (plugin.loading) {
           m.react("🕐");
           m.reply(config.messages.wait)
        }
        if (plugin.settings) {
          if (plugin.settings.owner && !m.isOwner) {
            return m.reply(config.messages.owner);
          }
          if (plugin.settings.group && !m.isGroup) {
            return m.reply(config.messages.group);
          }
          if (plugin.settings.admin && !isAdmin) {
            return m.reply(config.messages.admin);
          }
          if (plugin.settings.botAdmin && !botAdmin) {
            return m.reply(config.messages.botAdmin);
          }
        }

        await plugin(m, {
          sock,
          client,
          conn,
          DekuGanz,
          config,
          text,
          plugins: Object.values(pg.plugins).filter((a) => a.alias),
          Func,
          Scraper,
          Uploader,
          store,
          isAdmin,
          botAdmin,
          isPrems,
          isBanned,
        })
          .then(async (a) => {
            if (plugin?.settings?.limit && !isPrems && !m.isOwner) {
              db.list().user[m.sender].limit -= 1;
              m.reply(
                `${Func.Styles(`*( ${config.name} )* Limit Anda Berkurang 1 \n\n> *( ${config.name} )* Kalau Limit Nya Abis Nunggu 24jam`)}`,
              );
            }
          });
      }
           
    } catch (error) {
      if (error.name) {
        for (let owner of config.owner) {
          let jid = await sock.onWhatsApp(owner + "@s.whatsapp.net");
          if (!jid[0].exists) continue;
          let caption = "*– 乂 *Error Terdeteksi* 📉*\n"
          caption += `> *Nama command:* ${m.command}\n`
          caption += `> *Lokasi File:* ${name}`
          caption += `\n\n${Func.jsonFormat(error)}`

          sock.sendMessage(owner + "@s.whatsapp.net", {
            text: caption
          })
        }
        m.reply("*– 乂 *Error Terdeteksi* 📉*\n !*\n> Command gagal dijalankan karena terjadi error\n> Laporan telah terkirim kepada owner kami dan akan segera di perbaiki !");
      } else {
        m.reply(Func.jsonFormat(error));
      }
    } finally {
      if (db.list().settings.online) {
        await sock.readMessages([m.key]);
      }
    }
  }
};