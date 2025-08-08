# 📐 Telegram Image Resizer Bot

A Telegram bot built with **TypeScript**, **MongoDB**, and hosted on **AWS EC2**, designed to help users resize images directly within chat. Perfect for preparing images for stickers, avatars, or any custom dimensions.

---

## 🚀 Features

- 🖼️ Resize images directly in Telegram chat
- ✂️ Crop and confirm dimensions interactively
- 💾 Stores session context in MongoDB
- ⚙️ Built with TypeScript for type safety and scalability
- ☁️ Hosted on AWS EC2 for reliability and control

---

## 🛠️ Tech Stack
* TypeScript
* Node.js
* MongoDb
* AWS EC2
* Telgram Bot API

## 📦 Installation

1. Clone repository

```bash
git clone https://github.com/your-username/image-resizer-bot.git
cd image-resizer-bot
```

2. Install dependencies
```bash
nom install
```

3. Configure environment variables
Create a .env file:
```bash
TELEGRAM_API_TOKEN=your_bot_token
MONGODB_USER=your_user
MONGODB_SECRET=your_password
MONGODB_CLUSTER=your_cluster_url
MONGODB_COLLECTION=chatcontexts
```

4. Start the bot
```bash
npm run start
```

## 🧪 Usage

1. Use /resizeimage to start the resizing flow.
2. Send the desired image to the bot
3. The bot will respond with the resized image.

## 📬 Contact

For questions or support, reach out via email or open an issue on GitHub.
Let me know if you'd like to add badges, screenshots, or deployment scripts.