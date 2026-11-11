// Aqua's prepared replies.
// Later: replace getAquaReply() with a call to your backend, which talks to a real AI.
// Never put an AI API key in this file. Keys must stay on the server.

const wait = ms => new Promise(r => setTimeout(r, ms))

const replies = [
  { match: /what.*(ntu|turbidity)|ntu mean|meaning of ntu/,
    reply: '**NTU** (Nephelometric Turbidity Unit) measures how cloudy water is. Under IS 10500, drinking water should be under **1 NTU** and must not go above **5 NTU**.' },
  { match: /quality|turbid|ntu|safe|clean|drink/,
    reply: 'Water at the main inlet is **0.8 NTU**, well within the safe limit. One exception: **Library washrooms (AB-03)** is at **6.2 NTU**, above the 5 NTU limit. Flush that line and check the tank.' },
  { match: /offline|ab-04|sync|wi-?fi|connect/,
    reply: "**AB-04 (Canteen kitchen line)** lost Wi-Fi 38 minutes ago. It's still recording and has stored **1,284 readings** on the device. They'll upload automatically when it reconnects, so no data is lost." },
  { match: /peak|hour|busy|busiest/,
    reply: "Your busiest hour is **8–9 am**, at about **1,450 L/hour** on the main inlet. There's a smaller evening peak around **8 pm**, and usage is lowest between 1 and 5 am." },
  { match: /usage|use|consum|litre|liter|today|how much/,
    reply: 'So far today your network has used **12,846 L**. That\'s about **8% above** your 7-day average, mostly from the main inlet in the morning.' },
  { match: /alert|warning|problem|issue/,
    reply: 'You have **2 alerts** that need attention: high turbidity at **AB-03**, and above-normal usage at **AB-02**. Open the Alerts page to acknowledge them.' },
  { match: /device|how many/,
    reply: '**5 of 6** devices are online. AB-04 is offline but still recording locally. Open the Devices page to see each one.' },
  { match: /\b(hi|hello|hey|namaste)\b/,
    reply: 'Hello! I can help with water quality, daily usage, peak hours, alerts and device status. What would you like to know?' },
  { match: /thank/,
    reply: "You're welcome! Ask me anytime." },
]

export const suggestions = [
  'How is my water quality?',
  'Why is AB-04 offline?',
  'How much water did we use today?',
  'When is our peak hour?',
  'What does NTU mean?',
]

export async function getAquaReply(text) {
  await wait(700 + Math.random() * 500) // pretend Aqua is thinking
  const q = text.toLowerCase()
  const hit = replies.find(r => r.match.test(q))
  return hit
    ? hit.reply
    : "I'm not sure about that yet. I can help with **water quality**, **usage**, **peak hours**, **alerts** and **devices**."
}