const jimp_1 = require('jimp');
let URL_REGEX, jidNormalizedUser, S_WHATSAPP_NET;

try {
    ({
        URL_REGEX,
        jidNormalizedUser,
        S_WHATSAPP_NET
    } = require('baileys'));
} catch (error1) {
    try {
        ({
            URL_REGEX,
            jidNormalizedUser,
            S_WHATSAPP_NET
        } = require('baileys'));
    } catch (error2) {
        throw new Error('Gagal mengimpor dependensi dari kedua modul.');
    }
}

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
    let mime = (q.msg || q).mimetype || q.mediaType || '';
    let botNumber = await sock.user.id;

    if (/image/g.test(mime) && !/webp/g.test(mime)) {
        try {
            let media = await q.download();
            let {
                img
            } = await pepe(media);

            await sock.query({
                tag: 'iq',
                attrs: {
                    to: S_WHATSAPP_NET,
                    type: 'set',
                    xmlns: 'w:profile:picture',
                },
                content: [{
                    tag: 'picture',
                    attrs: {
                        type: 'image'
                    },
                    content: img,
                }, ],
            });

            m.reply(`Sukses mengganti PP Bot`);
        } catch (e) {
            console.error(e);
            m.reply(`Terjadi kesalahan, coba lagi nanti.`);
        }
    } else if (m.args[0] && m.args[0].match(URL_REGEX)) {
        try {
            let {
                img
            } = await pepe(m.args[0]);

            await sock.query({
                tag: 'iq',
                attrs: {
                    to: S_WHATSAPP_NET,
                    type: 'set',
                    xmlns: 'w:profile:picture',
                },
                content: [{
                    tag: 'picture',
                    attrs: {
                        type: 'image'
                    },
                    content: img,
                }, ],
            });

            m.reply(`Sukses mengganti PP Bot`);
        } catch (e) {
            console.error(e);
            m.reply(`Terjadi kesalahan, coba lagi nanti.`);
        }
    } else {
        m.reply(`Kirim gambar dengan caption *${m.prefix + m.command}* atau tag gambar yang sudah dikirim`);
    }
}

async function pepe(media) {
    const jimp = await jimp_1.read(media);
    const min = jimp.getWidth();
    const max = jimp.getHeight();
    const cropped = jimp.crop(0, 0, min, max);

    return {
        img: await cropped.scaleToFit(720, 720).getBufferAsync(jimp_1.MIME_JPEG),
        preview: await cropped.normalize().getBufferAsync(jimp_1.MIME_JPEG),
    };
}

deku.command = "setppbot"
deku.alias = ["setpp"]
deku.category = ["owner"]
deku.settings = {
    owner: true
}
deku.description = "Mengsetpp bot wa"
deku.loading = true

module.exports = deku