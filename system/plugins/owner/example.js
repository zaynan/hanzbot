module.exports = {
    command: "example",
    alias: ["exp"],
    settings: {
        owner: true,
    },
    description: "Example Features Bot",
    async run(m, {
        sock,
        Func,
        Scraper,
        Uploader,
        store,
        text,
        config
    }) {
        let cap = `*– 乂 Example - Code*
> Pilih type 1 atau 3 Sesuai Dengan kebutuhan anda`;
        if (!text)
            return sock.sendButtonMessage(m.cht, [{
                type: 'list',
                title: "Click Here",
                value: [{
                    headers: "Pilih Example Nya",
                    rows: [{
                            title: `example 1`,
                            command: `${m.prefix + m.command} 1`,
                            body: `Menampilkan Example 1`
                        },
                        {
                            title: `example 2`,
                            command: `${m.prefix + m.command} 2`,
                            body: `Menampilkan Example 2`
                        },
                        {
                            title: `example 3`,
                            command: `${m.prefix + m.command} 3`,
                            body: `Menampilkan Example 3`
                        }
                    ]
                }]
            }], m, {
                body: cap,
                footer: 'pencet button di bawah ini'
            })
        if (Number(text) === 1) {
            let code = `
module.exports = {
  command: "",
  alias: [],
  settings: { },
  description: "",
  async run(m, { text }) {
      //do Something...
  }
}

module.exports = new Command();`;
            m.reply(code);
        } else if (Number(text) === 2) {
            let code = `
class Command {
       constructor() {
       this.command = ""
       this.alias = [] 
       this.category = []
       this.settings = {}
       this.description = ""
       this.loading = true
   }
   run = async(m, { sock, Func, text, Scraper, config, store }) => {
      //do Something...
  }
}

module.exports = new Command();`;
            m.reply(code);
        } else if (Number(text) === 3) {
            let code = `let deku = async (m, { sock, Func, Scraper, Uploader, store, text, config }) => {
   //Do something
}

deku.command = ""
deku.alias = []
deku.category = []
deku.settings = { }
deku.description = ""
deku.loading = true

module.exports = deku`
            m.reply(code);
        } else
            sock.sendButtonMessage(m.cht, [{
                type: 'list',
                title: "Click Here",
                value: [{
                    headers: "Pilih Example Nya",
                    rows: [{
                            title: `example 1`,
                            command: `${m.prefix + m.command} 1`,
                            body: `Menampilkan Example 1`
                        },
                        {
                            title: `example 2`,
                            command: `${m.prefix + m.command} 2`,
                            body: `Menampilkan Example 2`
                        },
                        {
                            title: `example 3`,
                            command: `${m.prefix + m.command} 3`,
                            body: `Menampilkan Example 3`
                        }
                    ]
                }]
            }], m, {
                body: cap,
                footer: 'pencet button di bawah ini'
            })
    },
};