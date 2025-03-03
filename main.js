/**
 - < ! > Script: Yuta-Okkotsu
 - Base: Axel
 - Remake: Dekuganz
**/


(async () => {
  const {
    default: makeWASocket,
    useMultiFileAuthState,
    jidNormalizedUser,
    fetchLatestBaileysVersion,
    Browsers,
    proto,
    makeInMemoryStore,
    DisconnectReason,
    delay,
    generateWAMessage,
    getAggregateVotesInPollMessage,
    areJidsSameUser,
  } = require("baileys");
  const pino = require("pino");
  const { Boom } = require("@hapi/boom");
  const chalk = require("chalk");
  const readline = require("node:readline");
  const simple = require("./lib/simple.js");
  const fs = require("node:fs");
  const pkg = require("./package.json");
  const moment = require("moment-timezone");
  const Queque = require("./lib/queque.js");
  const messageQueue = new Queque();
  const Database = require("./lib/database.js");
  const append = require("./lib/append");
  const serialize = require("./lib/serialize.js");
  const config = require("./settings.js");

  const appenTextMessage = async (m, sock, text, chatUpdate) => {
    let messages = await generateWAMessage(
      m.key.remoteJid,
      {
        text: text,
      },
      {
        quoted: m.quoted,
      },
    );
    messages.key.fromMe = areJidsSameUser(m.sender, sock.user.id);
    messages.key.id = m.key.id;
    messages.pushName = m.pushName;
    if (m.isGroup) messages.participant = m.sender;
    let msg = {
      ...chatUpdate,
      messages: [proto.WebMessageInfo.fromObject(messages)],
      type: "append",
    };
    return sock.ev.emit("messages.upsert", msg);
  };

  const question = (text) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    return new Promise((resolve) => {
      rl.question(text, resolve);
    });
  };
  global.db = new Database(config.database + ".json");
  await db.init();

  global.pg = new (await require(process.cwd() + "/lib/plugins"))(
    process.cwd() + "/system/plugins",
  );
  await pg.watch();

  global.scraper = new (await require(process.cwd() + "/scrapers"))(
    process.cwd() + "/scrapers/src",
  );
  await scraper.watch();

  setInterval(async () => {
    await db.save();
    await pg.load();
    await scraper.load();
  }, 2000);

  const store = makeInMemoryStore({
    logger: pino().child({
      level: "silent",
      stream: "store",
    }),
  });
  
    console.log(chalk.blue.bold(`
  %%%%%%%%%%%%%%%%%%%%S%%%%%%%%%%%%%%%%%%%%%%SSSSSSSSSSSSSS%%SSSS%%%%%?%SSSSSSSSSSSSSSSSSS%%
%SSSS%%%%%%%%%%%SS%%SS%%%%%%%%%%%%%%%%%%%%%SSSSSSSSSSSSSSSSSSSSS%%%%%%SSSSSSSSSSSSSSSSSSSS
SSSSSSSSSS%%%%SSSSSSSS%SS%%S%S%%%%%%%%**%%%SSSSSSSSSSSSSSSSSSS%??%%SS%%SSSSSSSSSSSSSSSSSSS
SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS%%S%%%*:;?%%%?SS%S%%SSSSSSSS%?*;;??%SSSSSSSSSS####SSSSSSSSS
%%%%SSSS%%%%%SSSSSSSSSSSSSS%%**%%%%%+,:;+*++**;;++%?**?%%?+;:::;*?SSSSSSSSSSS####SSSSSSSSS
SSSSSSS%%%%%%%%%%%%%%%%%%%%%?;:*?*?+,,:;::::::::;;;++;;;:,,:;;+*?SSSSSSSSSSSSS####SSSSSSSS
SSSSSSSSS%%SSSSSSSSSSSSSS%%%?:,:++;,,,:;:,,:;;::;;;;:,,,,:::;+*?%%??%%%SSSSSSSS#####SSSSS#
SSSSSSSSSSSSSSSSSSSSSSSSSS%%*,,,::,,,,:;:,:::,,,::::,,,,,,:;;+;;;::;*?SSSSSSS#SS#######SSS
SSSSSSSSSSSSSSSSSS%SSSSSSS%%+,,,,,,,,,::,,,,,,,,,:::,,,,,,:::::::+*%SSSSS%%SSSSSS#@@###SSS
SSSSSSSSSSSSS%????*+*??%%%?*;,,,,,,,,,,,,,,,,,::;+;;:::::,,,,:::::;;;;;;;;;;+?%SS#@@@####S
SSSSSSSSSSSSS??????+:::;+**+:,,,,,,,,,,,,,,,,:::;;;;:::::::::,,,::,,::::;;+*??%%%%SS%S####
SSSSSSSSSSSSS??????%+::,,,:::,,,,,,,,,,,,,,,,,,,,:::::::,,,,,,,:::;;;;+++*?%??%%%%%%?%#@##
SSSSSSSSSSSSS%?????%?*::,,,,,,,,,,,,,,,,,,,,:,:::,,,,,,:,,,,:::::::::::::;+**???%%%%%%#@@#
SSSSSSSSSSSSS%?%?***++:::,:,::,,,,,,,,,,,,,,:::;;:,,,,,,,,,,,::;;;::::::,,,,::;;+*?%%%#@@@
SSSSSSSSSSSSS%??**++::,:::::::,,,,,,,,,,,,,,,:::;;,,,,,,,,::,,,,,,:,,,::;;;;+++*?%%%%%#@@@
###S#SSSSSSSS?+;;::::::::::::,,,,,,,,,,,,:,,,,,,,::,,,,,,,::::,,,,:;;;:;;+++++*%%%%%%%#@@@
##SS##SSSSSSS%%??**+++++;;:,:::,,,,,::::;:,,,,,,,,,,,,,,,,,::;::,,:;++++++;;::;+*%%%%%###@
SSSSSSSS#SSS#S%S%%??*++;:;;;+:,,,,,::::::,,,,,,,,,,,,,,::,,,::::::,:;;:::;:::::::;*?%%##S#
##S###S####S#SSS%%%?**+***++:::::,,:,:::,,:;:,,,::,,,,::::::::::::,,,::::::::;+*???%%S####
#############SS%????***?*+::;+++:,:::::::;+++:,:::,::,:;:::;+:::;+;;;::::;++++*?SS%SSS#@@@
#############SSSS%%?*??**++***+;:::::;;;++;:;;:::,:;:::;:,:;+;:::;;:::::;:;*****%SSSSS#@@@
#############SSSS%???????*****;:;;::+;;;:::::;::::++;:::+::::;;:++;:;:::++++***??%%SSS#@@@
#############S######S??????***+**;:;;:::::::::;::+**;:::;+::+;;:;**+++;:;*****??SSSSSS#@@@
#############@@@@@@#???**?????*?*:+*;;+;;::::;+;*;+?+;;;;++:+*+;:+*?**?*;+*????%%SSSSS#@@@
#############@@@@@@S%SS%???*%?***+??***+++::;***;:;****++;*++***+;*????%?*%%%S%%SSSSSS##@@
##############@@@@@@@@##????SS%??*%%%???***;*??*;;;+**;;;;;***???**%S????SSS%SSSSSSSSS#@@@
#@###########SS@@@@@@@@@%?%%S#S?%?%????S%??*?%%?*+**?;:;;;;+*%?*%S?%##SSSS#S%SSSSSSSSS##@@
@@@####@#@#@##S#@@@@@@@@#SS%SSSS%?%%???SSS%?S#%%??%??+;:::;++?%%%S%%#######S%SSSSSSSSS@@#@
@@@@#@@@@@@@@####@@@@@@@@@@@####%SSSS??S%S%%SS%%%%%?+;:::::+***??%%S@#######%SSSSSSSSS@@@@
@@@@@@@@@@@@@####@@@@@@@@@@@@@@@###SSS%S%%S%%%?*?++;::::::;;;+;;+%%S@@@@@@@##SSS######@@@@
@@@@@@@@@@@@@###@@@@@@@@@@@@@@@@#####SSS%%%%%%%+;;;;;;:::;+;:;;;?SS@@@@@@@@@@##########@@@
@@@@@@@@@@@@@#@@@@@@@@@@@@@@@@@@@######S%SSS%%S?+;;;;;;;;;;;;;;*%#@@@@@@@@@@S#########@@@@
@@@@###@###@@@@@@@@@@@@@@@@@@@@@@##@#####SSS%%S%%%*+;;;;;;;;;;?S#@@@@@@@@@@#S#########@@@@
@@@@@@@@####SSS##@@@@@@@@@@@@@@@@@#@@@#@@#SSSSSSS%%%*****???%%S#@@@@@@@@@@@###########@@@@
#####@@@@@@@@@@@#####@@@@@@@@@@@@@@@#@@@@@@##SSSSSSSS%%SSS%?SS#@@@@@@@@@@@@###########@@@@
?????%SS#@@@@@@@###@@@@#@@@@@@@@@@@@@@@@@@@@@######SSSSSS%*?%#@@@@@@@@@@@@@@@#SS######@@@@
%%%%%%%%%%#@@@@@@@@@@####@@@@@@@@@@@@@@@@@@@@@@@@##SSSSSS%%S@@@@@@@@@@@@@@@@@@#S##@###@@@@
%%%%%%%%%SS@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@##@@@#@@@@@
S%%%%%%%%%%SS#@@@@@@@@@##@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@##@@@@@@@@@
#SSSSSSS%%%%SS#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#@@@@@@@@@
SSS###SSSSS######@@@@@@@@#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@##@@@@@@@@
SSSSSSS####@@@@###@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#@@@@@@@@
SSSSSSS##@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
#######@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@######@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  Welcome to Script Yuta-Okkotsu-Botz / DekuGanz`))
  console.log(chalk.blue.bold(`By: DekuGanz`))
  
  console.log(chalk.yellow.bold("📁     Inisialisasi modul..."));
  console.log(chalk.cyan.bold("- API Baileys Telah Dimuat"));
  console.log(chalk.cyan.bold("- Sistem File Siap Digunakan"));
  console.log(chalk.cyan.bold("- Database Telah Diinisialisasi"));

  console.log(chalk.blue.bold("\n🤖 Info Bot:"));
  console.log(chalk.white.bold("  | GitHub: ") + chalk.cyan.bold("https://github.com/LeooxzyDekuu"));
  console.log(chalk.white.bold("  | Developer: ") + chalk.green.bold("Leooxzy/Deku"));
  console.log(chalk.white.bold("  | Base Script: ") + chalk.green.bold("AxellNetwork"));
  console.log(chalk.white.bold("  | Status Server: ") + chalk.green.bold("Online"));
  console.log(chalk.white.bold("  | Versi: ") + chalk.magenta.bold(pkg.version));
  console.log(chalk.white.bold("  | Versi Node.js: ") + chalk.magenta.bold(process.version));
  
  console.log(chalk.blue.bold("\n🔁 Memuat plugin dan scraper...")) 

  async function system() {
    const { state, saveCreds } = await useMultiFileAuthState(config.sessions);
    const sock = simple(
      {
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        auth: state,
        version: [2, 3000, 1019441105],
        browser: Browsers.ubuntu("Edge"),
      },
      store,    
    );
    store.bind(sock.ev);
    if (!sock.authState.creds.registered) {
      console.log(
        chalk.white.bold(
          "- Silakan masukkan nomor WhatsApp Anda, misalnya +628xxxx",
        ),
      );
      const phoneNumber = await question(chalk.green.bold(`– Nomor Anda: `));
      const code = await sock.requestPairingCode(phoneNumber);
      setTimeout(() => {
        console.log(chalk.white.bold("- Kode Pairing Anda: " + code));
      }, 3000);
    }

    //=====[ Pembaruan Koneksi ]======
    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === "close") {
        const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
        if (lastDisconnect.error == "Error: Stream Errored (unknown)") {
          
        } else if (reason === DisconnectReason.badSession) {
          console.log(
            chalk.red.bold("File sesi buruk, Harap hapus sesi dan scan ulang"),
          );
          
        } else if (reason === DisconnectReason.connectionClosed) {
          console.log(
            chalk.yellow.bold("Koneksi ditutup, sedang mencoba untuk terhubung kembali..."),
          );

        } else if (reason === DisconnectReason.connectionLost) {
          console.log(
            chalk.yellow.bold("Koneksi hilang, mencoba untuk terhubung kembali..."),
          );
          
        } else if (reason === DisconnectReason.connectionReplaced) {
          console.log(
            chalk.green.bold("Koneksi diganti, sesi lain telah dibuka. Harap tutup sesi yang sedang berjalan."),
          );
          sock.logout();
        } else if (reason === DisconnectReason.loggedOut) {
          console.log(
            chalk.green.bold("Perangkat logout, harap scan ulang."),
          );
          sock.logout();
        } else if (reason === DisconnectReason.restartRequired) {
          console.log(chalk.green.bold("Restart diperlukan, sedang memulai ulang..."));
          system();
        } else if (reason === DisconnectReason.timedOut) {
          console.log(
            chalk.green.bold("Koneksi waktu habis, sedang mencoba untuk terhubung kembali..."),
          );
          system();
        }
      } else if (connection === "connecting") {
        console.log(chalk.blue.bold("Menghubungkan ke WhatsApp..."));
      } else if (connection === "open") {
        console.log(chalk.green.bold("Bot berhasil terhubung."));
      }
    });

    //=====[ Setelah Pembaruan Koneksi ]========//
    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("contacts.update", (update) => {
      for (let contact of update) {
        let id = jidNormalizedUser(contact.id);
        if (store && store.contacts)
          store.contacts[id] = {
            ...(store.contacts?.[id] || {}),
            ...(contact || {}),
          };
      }
    });

    sock.ev.on("contacts.upsert", (update) => {
      for (let contact of update) {
        let id = jidNormalizedUser(contact.id);
        if (store && store.contacts)
          store.contacts[id] = { ...(contact || {}), isContact: true };
      }
    });

    sock.ev.on("groups.update", (updates) => {
      for (const update of updates) {
        const id = update.id;
        if (store.groupMetadata[id]) {
          store.groupMetadata[id] = {
            ...(store.groupMetadata[id] || {}),
            ...(update || {}),
          };
        }
      }
    });

    sock.ev.on("group-participants.update", ({ id, participants, action }) => {
      const metadata = store.groupMetadata[id];
      if (metadata) {
        switch (action) {
          case "add":
          case "revoked_membership_requests":
            metadata.participants.push(
              ...participants.map((id) => ({
                id: jidNormalizedUser(id),
                admin: null,
              })),
            );
            break;
          case "demote":
          case "promote":
            for (const participant of metadata.participants) {
              let id = jidNormalizedUser(participant.id);
              if (participants.includes(id)) {
                participant.admin = action === "promote" ? "admin" : null;
              }
            }
            break;
          case "remove":
            metadata.participants = metadata.participants.filter(
              (p) => !participants.includes(jidNormalizedUser(p.id)),
            );
            break;
        }
      }
    });
    
    async function getMessage(key) {
      if (store) {
        const msg = await store.loadMessage(key.remoteJid, key.id);
        return msg;
      }
      return {
        conversation: "HanakoBotz",
      };
    }

    sock.ev.on("messages.upsert", async (cht) => {
      if (cht.messages.length === 0) return;
      const chatUpdate = cht.messages[0];
      if (!chatUpdate.message) return;
      const userId = chatUpdate.key.id;
      global.m = await serialize(chatUpdate, sock, store);     
      if (m.isBot) return;
      require("./lib/logger.js")(m);      
      if (!m.isOwner && db.list().settings.self) return;
      await require("./system/handler.js")(m, sock, store);
    });

    sock.ev.on("messages.update", async (chatUpdate) => {
      for (const { key, update } of chatUpdate) {
        if (update.pollUpdates && key.fromMe) {
          const pollCreation = await getMessage(key);
          if (pollCreation) {
            let pollUpdate = await getAggregateVotesInPollMessage({
              message: pollCreation?.message,
              pollUpdates: update.pollUpdates,
            });
            let toCmd = pollUpdate.filter((v) => v.voters.length !== 0)[0]
              ?.name;
            console.log(toCmd);
            await appenTextMessage(m, sock, toCmd, pollCreation);
            await sock.sendMessage(m.cht, { delete: key });
          } else return false;
          return;
        }
      }
    });

    return sock;
  }
  system();
})();