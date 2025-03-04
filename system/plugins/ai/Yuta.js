const Groq = require('groq-sdk')

module.exports = {
  command: "yuta",
  alias: ["yutaokkotsu"],
  category: ["ai"],
  description: "Jawab semua pertanyaan mu dengan Yuta",
  loading: true,
  async run(m, { text }) {

const client = new Groq({ apiKey: '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' });

async function yutachat(prompt) {
 chatCompletion = await client.chat.completions.create({
messages: [
        { role: "system", content: `"Kamu Adalah Yuta Okkotsu Jujutsu kaisen Dengan Memakai Bahasa Indonesia Dan Bergaulan` },
{ role: "user", content: prompt }
],
model: 'llama3-8b-8192'
});
let hasil = chatCompletion.choices[0].message.content
return hasil
}

let h = await yutachat(text)
m.reply(h)

}
}