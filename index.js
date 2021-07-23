const Discord = require('discord.js')
const client = new Discord.Client() 
const db = require('quick.db')
const code = require("@codedipper/random-code");
const express = require('express')
const app = express()
const port = "8080"
app.listen(port, function(){
    console.log(`Your App Listen To ${port} Port `)
})
const prefix = "+"
function idgen() {
    return  `_${Math.random().toString(36).substr(2, 5)}_${Math.random().toString(36).substr(2, 5)}`
 }
 
client.on('message', async badboy => {
var args = badboy.content.split(' ')
    const cmd = args[0]
    if(!cmd) return 
    let id = code(10);
 if(cmd.toLowerCase() === prefix + "add-word") {
     const f = badboy.content.split(' ').slice(1).join(' ')
     if(!f) return 
     
     const data =  {
word: f.toLowerCase(),
        id: id.toLowerCase(),
        by: badboy.author.username,
     }
     badboy.channel.send(id)
     let database = db.fetch(`hi_${badboy.guild.id}`)
 if(database && database.find(x => x.word === f.toLowerCase())) return badboy.channel.send(`This Word it's already on database.`)
     badboy.channel.send(new Discord.MessageEmbed().setDescription(`New Word Add: ${f.toLowerCase()}
     ID: ${id}
     By: ${badboy.author}
     `)
     .setAuthor(badboy.author.username, badboy.author.avatarURL({dynimc: true}) )
     ).then(() => {
          db.push(`hi_${badboy.guild.id}`, data)

     })
     
     
 } else if(cmd.toLowerCase() === prefix + "list") {
     
     let database = db.get(`hi_${badboy.guild.id}`) 
  if(database === null) return badboy.channel.send(`It's looks ur auto delete bad word it's empty`)
  let list = []
  if(database && database.length) {
      database.forEach(x => {
list.push(`Word: ${x.word}
> By: ${x.by}
> ID: ${x.id}
`)
      })
  if(list.length === 0) return badboy.channel.send(`it's looks ur auto delete bad word it's empty`)
  let embed = new Discord.MessageEmbed()
  .setAuthor(badboy.author.username , badboy.author.displayAvatarURL())
  .setDescription(list.join("\n"))
  .setFooter(badboy.guild.name , badboy.guild.iconURL())
  .setTimestamp()
  return badboy.channel.send(embed)
    } 

 
     
 } else if(cmd.toLowerCase() === prefix + "remove") {
    const f = args[1]
let database = db.get(`hi_${badboy.guild.id}`)
if(database) {
    let data = database.find(x => x.id === f.toLowerCase())
   if(!data) return badboy.channel.send(`That's on invaild  ID`) 
   let value = database.indexOf(data)
   delete database[value]
 
   var filter = database.filter(x => {
     return x != null && x != ''
   })
 
   db.set(`hi_${badboy.guild.id}`, filter)
   
 return badboy.channel.send("\`1\` Word has been removed ✅")
 
 
     
 }
 } else if(cmd.toLowerCase() === prefix + "remove-all") {
     var data = await db.fetch(`hi_${badboy.guild.id}`)
     if(data === null) return badboy.channel.send(`database empty`)
     badboy.channel.send(`Done Delete ${data.length} Words`).then(() => {
         db.delete(`hi_${badboy.guild.id}`)
         
     })
 } 
 
 })
 
 client.on('message', badboy => {
if(badboy.author.bot) return
  let data = db.get(`hi_${badboy.guild.id}`)
  if(data) {
    let word = data.find(x => x.word === badboy.content.toLowerCase())
    if(word){
        badboy.delete()
        badboy.channel.send(`${badboy.author} Dont Say Bad Word`)
    }
  }
})
 
 client.on('ready', () => {
     console.log(`${client.user.tag} Ready To Use`)
 })
 
 
 app.get('/', function(req,res){
     res.send(`All CopyRight Go To BadBoy`)
 })
 
