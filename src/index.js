require("dotenv").config();
const {
  Client,
  Events,
  GatewayIntentBits,
  EmbedBuilder,
  WebhookClient,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (!message.content.includes("https://x.com")) {
    return;
  }

  const newContent = message.content.replace(
    "https://x.com",
    "https://fixupx.com"
  );

  if (message.deletable) {
    await message.delete();
  } else {
    await message.channel.send(newContent);
    return;
  }

  let webhook;
  const hooks = await message.channel.fetchWebhooks();
  if (hooks.size === 0) {
    webhook = await message.channel.createWebhook({
      name: "Bot",
    });
  } else {
    webhook = hooks.find((wh) => wh.token);
  }

  webhook.send({
    content: newContent,
    username: message.author.username,
    avatarURL: message.author.avatarURL(),
  });
});

client.login(process.env.DISCORD_TOKEN);
