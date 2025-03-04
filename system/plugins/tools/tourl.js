const fetch = require("node-fetch");
const crypto = require("crypto");
const FormData = require("form-data");
const {
    fromBuffer
} = require("file-type");
const axios = require("axios");
const fakeUserAgent = require("fake-useragent");
const cheerio = require("cheerio");
const uloadUrlRegexStr = /url: "([^"]+)"/;
const randomBytes = crypto.randomBytes(5).toString("hex");
const fs = require('node:fs')

let deku = async (m, {
    sock,
    Func,
    Scraper,
    Uploader,
    store,
    text,
    config
}) => {

    let q = m.quoted ? m.quoted : m;
    if (!q) throw `kirim foto trus ketik .tourl \\ reply foto trus .tourl`;

    if (/audio|video|webp|sticker|image/.test(q.msg.mimetype)) {

        let media = await (m.quoted ? m.quoted.download() : m.download())
        const catbox = await Uploader.catbox(media)
        const res = await api(media).catch(e => catbox)
        m.reply(res)
    } else {
        m.reply(`kirim foto trus ketik .tourl \\ reply foto trus .tourl`);
    }
}

deku.command = "tourl"
deku.alias = ["touploader"]
deku.category = ["tools"]
deku.settings = {
    limit: true
}
deku.description = "Mengconvert tourl media"
deku.loading = true

module.exports = deku

const api = async (buffer) => {
    let {
        ext
    } = await fromBuffer(buffer);
    let bodyForm = new FormData();
    bodyForm.append("file", buffer, "file." + ext);
    let res = await fetch("https://file.btch.rf.gd/api/upload.php", {
        method: "post",
        body: bodyForm,
    });
    let data = await res.json();
    let resultUrl = data.result ? data.result.url : '';
    return resultUrl;
}
