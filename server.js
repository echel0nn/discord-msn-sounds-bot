var Discord = require('discord.js');
var fs = require('fs');
var discord_voice = require('@discordjs/voice');
var joinVoiceChannel = discord_voice.joinVoiceChannel;
var NoSubscriberBehavior = discord_voice.NoSubscriberBehavior;
var createAudioPlayer = discord_voice.createAudioPlayer;
var createAudioResource = discord_voice.createAudioResource;
var createReadStream = fs.createReadStream;
var entersState = discord_voice.entersState;
var StreamType =  discord_voice.StreamType;
var AudioPlayerStatus  = discord_voice.AudioPlayerStatus;
var VoiceConnectionStatus = discord_voice.VoiceConnectionStatus;

var bot = new Discord.Client({  intents: [
                Discord.GatewayIntentBits.Guilds,
                Discord.GatewayIntentBits.GuildMessages,
                Discord.GatewayIntentBits.MessageContent,
                Discord.GatewayIntentBits.GuildMembers,
                Discord.GatewayIntentBits.MessageContent,
                Discord.GatewayIntentBits.GuildVoiceStates,
                Discord.GatewayIntentBits.GuildPresences,
        ],
});
const player = createAudioPlayer({
          behaviors: {
            noSubscriber: NoSubscriberBehavior.Stop,
          },
});
var isReady = true;
var token = "<YOUR_TOKEN_HERE>"
var last_channel;

function majority(){
        channels = bot.channels.cache.filter(ch=>ch.type === 2);
        max_player = 0;
        var temp_channel = null;
        for(const channel of channels){
                if(max_player < channel[1].members.size){
                        max_player = channel[1].members.size;
                        temp_channel = channel;
                }
        }

        if(temp_channel != null){
        last_channel = temp_channel[1];
        }
}

bot.on("ready", () => {
          console.log(`Logged in as ${bot.user.tag}!`)
});

bot.on('voiceStateUpdate', (oldPresence, newPresence) => {
   majority();
   let member = newPresence.member;
   if(last_channel != null && isReady && ((oldPresence.member.nickname !== null && newPresence.member.nickname !== null) )){
     console.log("member:", member.nickname, "old: ", oldPresence, "new: ", newPresence);
     isReady = false;
     console.log("Last Channel: ", last_channel.name);
     const voice_connection = joinVoiceChannel({
             channelId: last_channel.id,
             guildId: last_channel.guild.id,
             adapterCreator: last_channel.guild.voiceAdapterCreator
     });
     const resource = createAudioResource(createReadStream('./alerts/titret.mp3'),{
       inlineVolume: true,
     });
     player.play(resource);
     var sub = voice_connection.subscribe(player);
     isReady = true;
     // entersState(player, AudioPlayerStatus.Playing, 500);
   } // anyone here end
});

bot.on('presenceUpdate', (oldPresence, newPresence) => {
    let member = newPresence.member;
    console.log(`presenceUpdate: ${oldPresence} | ${newPresence}`);
    majority();
    console.log("member:", member.nickname, "old: ", oldPresence, "new: ", newPresence);
    if(last_channel != null){
    if(oldPresence != undefined){
        if (oldPresence.status != newPresence.status) {
            isReady = false;
            if (newPresence.status == "online" || newPresence.status == "dnd" ) {
                const resource =  createAudioResource(createReadStream('./alerts/online.mp3'), {inlineVolume: true});
                channel = bot.channels.cache.get("ID");
                channel.send("hosgeldın " + newPresence.member.nickname);

                const voice_connection = joinVoiceChannel({
                             channelId: last_channel.id,
                             guildId: last_channel.guild.id,
                             adapterCreator: last_channel.guild.voiceAdapterCreator
                });
                player.play(resource);
                var sub = voice_connection.subscribe(player);
                isReady = true;
            } else if (newPresence.status == "offline") {
                const resource = createAudioResource(createReadStream('./alerts/shut.mp3'), {inlineVolume: true,});
                channel = bot.channels.cache.get("832574432153042965");
                channel.send("bye " + newPresence.member.nickname);

                const voice_connection = joinVoiceChannel({
                             channelId: last_channel.id,
                             guildId: last_channel.guild.id,
                             adapterCreator: last_channel.guild.voiceAdapterCreator
                });
                player.play(resource);
                var sub = voice_connection.subscribe(player);
                isReady = true;
            }
        } // old&new
    } // presence update status icerio mu kardesm if end
    } // last chanel nil if end
});


bot.on('messageCreate', message => {
  if (isReady && !message.author.bot && message.channel.id == "ID")
  {
  isReady = false;
  majority();
  if(last_channel != null){
  voiceChannel = last_channel;
  const resource = createAudioResource(createReadStream('./alerts/msn_alert.mp3'), {inlineVolume: true,});

  const voice_connection = joinVoiceChannel({
             channelId: last_channel.id,
             guildId: last_channel.guild.id,
             adapterCreator: last_channel.guild.voiceAdapterCreator
  });
  player.play(resource);
  var sub = voice_connection.subscribe(player);
  isReady = true;
  }
  }
});


bot.login(token);
