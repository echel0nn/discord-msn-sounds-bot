var Discord = require('discord.js');
var bot = new Discord.Client();
var isReady = true;
var token = "<YOUR_TOKEN_HERE>"
var last_channel;


function majority(){
        channels = bot.channels.cache.filter(x=> x.type === "voice");
        max_player = 0;
        var temp_channel;
        for(const channel of channels){
                console.log(channel[1].members.size);
                if(max_player < channel[1].members.size){
                        max_player = channel[1].members.size;
                        temp_channel = channel;
                }
        }
        if(temp_channel != null)
        last_channel = temp_channel[1];
        console.log(last_channel);
}

bot.on('voiceStateUpdate', (oldPresence, newPresence) => {
   majority();
   if(last_channel != null){
   last_channel.join().then(connection =>
        {
         const dispatcher = connection.play('./alerts/titret.mp3');
         dispatcher.on("end", end => {
         voiceChannel.leave();
         });
        }).catch(err => console.log(err));
   } // anyone here end
});

bot.on('presenceUpdate', (oldPresence, newPresence) => {
    let member = newPresence.member;
    majority();
    if(last_channel != null && last_channel.join != undefined){
    if(oldPresence != undefined){
        if (oldPresence.status !== newPresence.status) {
            if (newPresence.status === "online") {
                last_channel.join().then(connection =>
                        {
                                const dispatcher = connection.play('./alerts/online.mp3');
                                dispatcher.on("end", end => {
                                voiceChannel.leave();
                                });
                        }).catch(err => console.log(err));

                channel = bot.channels.cache.get("832574432153042965");
                channel.send("welcome " + newPresence.member.nickname);

            } else if (newPresence.status === "offline") {
                last_channel.join().then(connection =>
                        {
                                const dispatcher = connection.play('./alerts/shut.mp3');
                                dispatcher.on("end", end => {
                                voiceChannel.leave();
                                });
                        }).catch(err => console.log(err));
                channel = bot.channels.cache.get("832574432153042965");
                channel.send("bye " + newPresence.member.nickname);
            }
            // etc...
        }
    } // presence update status icerio mu kardesm if end
    } // last chanel nil if end
});


bot.on('message', message => {
  if (isReady && !message.author.bot && message.channel.name == "GENERAL")
  {
  isReady = false;
  majority();
  if(last_channel != null){
  voiceChannel = last_channel;
  voiceChannel.join().then(connection => {
     const dispatcher = connection.play('./alerts/msn_alert.mp3');
     dispatcher.on("end", end => {
       });
   }).catch(err => console.log(err));
  isReady = true;
  }
  }
});


bot.login(token);
