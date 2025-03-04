const {
    BufferJSON,
    WA_DEFAULT_EPHEMERAL,
    generateWAMessageFromContent,
    proto,
    getBinaryNodeChildren,
    generateWAMessageContent,
    generateWAMessage,
    prepareWAMessageMedia,
    areJidsSameUser,
    getContentType,
    downloadContentFromMessage
} = require('baileys');

module.exports = {
    command: "pixiv", //- Nama fitur nya
    alias: ["px"], //- Short cut command
    category: ["anime"], //- Kategori Fitur 
    settings: {
        owner: true, //-  Apakah Fitur ini khusus owner ?
        group: false, // - Apakah Fitur ini khusus group ?
    },
    description: "anime nsfw 18+", //- Penjelasan tentang fitur nya
    loading: true, //- Ingin menambahkan loading messages ?
    async run(m, {
        sock,
        Func,
        Scraper,
        text,
        config
    }) {
        if (!text) throw `\`<!>\` Anda Mau Apa Link Or Search\n\n contoh:\nsearch: .pixiv todoroki\\tags\nlink: .pixiv www.pixiv.net/xxxx`
        if (/www.pixiv.net/.test(text)) {
            const hasil = await Scraper.pixivdl(text)

            for (let i of hasil.media) {
                await sock.sendFile(m.cht, i, 'image/png', 'done')
            }
        } else {
            async function createImage(url) {
                const {
                    imageMessage
                } = await generateWAMessageContent({
                    image: url
                }, {
                    upload: sock.waUploadToServer
                });
                return imageMessage;
            }

            function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
            }

            let push = [];

            const hasil = await Scraper.pixivdl(text)

            shuffleArray(hasil.media); // Randomize arrays
            let ult = hasil.media.splice(0, 5); // Takes the first 10 images from a randomized array
            let i = 1;
            for (let lucuy of ult) {
                push.push({
                    body: proto.Message.InteractiveMessage.Body.fromObject({
                        text: `done search ${text}`
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.fromObject({
                        text: config.name
                    }),
                    header: proto.Message.InteractiveMessage.Header.fromObject({
                        title: `Image - ${i++}`,
                        hasMediaAttachment: true,
                        imageMessage: await createImage(lucuy)
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                        buttons: [{}]
                    })
                });
            }
            const bot = generateWAMessageFromContent(m.cht, {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2
                        },
                        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                            body: proto.Message.InteractiveMessage.Body.create({
                                text: `< ! > Halo ${m.pushName}`
                            }),
                            footer: proto.Message.InteractiveMessage.Footer.create({
                                text: config.name
                            }),
                            header: proto.Message.InteractiveMessage.Header.create({
                                hasMediaAttachment: false
                            }),
                            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                                cards: [
                                    ...push
                                ]
                            })
                        })
                    }
                }
            }, {
                quoted: m
            });
            await sock.relayMessage(m.cht, bot.message, {
                messageId: bot.key.id
            });
        }
    }
}