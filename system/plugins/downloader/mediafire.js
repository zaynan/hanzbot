let deku = async (m, {
    sock,
    Func,
    Scraper,
    Uploader,
    store,
    text,
    config
}) => {

    if (!text.includes('mediafire')) throw 'masukan link mf nya'

    const hasil = await Scraper.mediafire(text)

    let capt = ` - 々 \`[ Downloader - Mediafire ]\` 々 -\n\n`
    capt += Object.entries(hasil).map(([a, b]) => `> ${a.capitalize()} : ${b}`).join("\n");
    capt += `\n> Otw Di Kirim File nya`

    m.reply(Func.Styles(capt))

    sock.sendMessage(m.cht, {
        document: {
            url: hasil.download
        },
        mimetype: hasil.mimetype,
        fileName: hasil.filename,
        caption: Func.Styles(capt)
    }, {
        quoted: m
    })
}

deku.command = "mediafire"
deku.alias = ["mf", "mfdl"]
deku.category = ["downloader"]
deku.settings = {
    limit: true
}
deku.description = "Mendownload File MediaFire"
deku.loading = true

module.exports = deku