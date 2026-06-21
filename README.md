# Telegram AI Ridoy Bot

This is a Telegram bot that leverages AI to provide various media generation and editing functionalities.

## Features

- **Text to Image Generation**: Generate images from textual descriptions.
- **Text to Video Generation**: Create videos from textual descriptions.
- **Text to Audio (Song/Gojol) Generation**: Generate songs or gojols from text.
- **Image Editing**: Edit existing images based on textual commands.
- **Video Editing**: Edit existing videos based on textual commands.
- **Audio Editing**: Edit existing audio (songs/gojols) based on textual commands.
- **Gemini 3 & Base44 Integration**: Utilizes Google Gemini 3 Flash and Base44 for advanced AI capabilities.
- **Google Search Grounding**: Real-time information access via Google Search.
- **Music & Video Generation**: Advanced media generation using Lyria and Veo 3 models.

## Setup Instructions

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/ridym7876-crypto/telegram-ai-Ridoy-bot-.git
    cd telegram-ai-Ridoy-bot-
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**: Create a `.env` file in the root directory and add the following:
    ```
    BOT_TOKEN=8804391497:AAHZ6lckG4GqWmQsQxj4DZgZdYnSFVuZEPo
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    BASE44_API_KEY=2015b471f7c44bd9934ed539a82b1030
    USE_BASE44=true
    MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
    ```
    -   `YOUR_TELEGRAM_BOT_TOKEN`: Obtain this from BotFather on Telegram.
    -   `YOUR_GEMINI_API_KEY`: Get your API key from the Google AI Studio.
    -   `YOUR_MONGODB_CONNECTION_STRING`: Your MongoDB connection string (e.g., from MongoDB Atlas).

4.  **Run the bot**:
    ```bash
    npm start
    ```

## Usage

-   Start a chat with your bot on Telegram and send `/start`.
-   Follow the on-screen instructions and use the inline keyboard to access different features.
-   For general queries, simply type your message, and the bot will respond using Gemini Pro.

## Project Structure

```
telegram-ai-bot/
├── bot.js
├── package.json
├── .env
├── .gitignore
├── src/
│   ├── commands/
│   │   ├── start.js
│   │   ├── image.js
│   │   ├── video.js
│   │   └── song.js
│   │
│   ├── services/
│   │   ├── gemini.js
│   │   ├── imageGenerator.js
│   │   ├── videoGenerator.js
│   │   └── audioGenerator.js
│   │
│   ├── database/
│   │   └── mongodb.js
│   │
│   └── utils/
│       └── helpers.js
│
└── README.md
```

## Contributing

Feel free to fork the repository, make improvements, and submit pull requests.
