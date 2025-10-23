import axios from "axios";

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL_CD as string;
if (!DISCORD_WEBHOOK_URL) {
  throw new Error("Missing DISCORD_WEBHOOK_URL_CD");
}

const mentionEnv = process.env.DISCORD_MENTIONS_CD || "";
const mentions = mentionEnv
  .split(",")
  .map((id) => id.trim())
  .filter((id) => id.length > 0);

const mentionStrings =
  mentions.length > 0 ? mentions.map((id) => `<@${id}>`) : ["@everyone"];

function getCountdownMessage(): string | false {
  const targetDate = new Date("2025-10-24T00:00:00+08:00");
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days <= 0) {
    // 🎉 Trip day message
    return (
      `🇯🇵🎉 **The Day Has Arrived! JAPAN TRIP STARTS TODAY!** 🎉🇯🇵\n\n` +
      `🛫 Get ready for takeoff and the best memories ever! 🌸✨\n` +
      `Safe travels and have fun, everyone! 🎒📸🍜\n\n` +
      `Bring back kanojo for yourself or commit seppuku! \n\n` +
      `${mentionStrings.join(" ")}`
    );
  } else if (days < 0) {
    return false;
  }

  // Normal countdown message
  return (
    `🇯🇵✨ **Japan Trip Countdown!** ✨🇯🇵\n\n` +
    `⏳ Only **${days} days** left until our adventure begins! 🛫🌏\n\n` +
    `🎒 Pack your bags, get your cameras ready 📸, and let’s make memories!\n\n` +
    `${mentionStrings.join(" ")}`
  );
}

async function sendMessage(): Promise<void> {
  const message = getCountdownMessage();
  if (!message) return;

  await axios.post(DISCORD_WEBHOOK_URL, { content: message });
  console.log("Message sent:", message);
}

sendMessage().catch(console.error);
