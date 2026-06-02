# Telegram AI Ridoy Bot

This is a Telegram bot that leverages AI to provide various media generation and editing functionalities.

## Features

- **Text to Image Generation**: Generate images from textual descriptions.
- **Text to Video Generation**: Create videos from textual descriptions.
- **Text to Audio (Song/Gojol) Generation**: Generate songs or gojols from text.
- **Image Editing**: Edit existing images based on textual commands.
- **Video Editing**: Edit existing videos based on textual commands.
- **Audio Editing**: Edit existing audio (songs/gojols) based on textual commands.
- **Gemini Pro Integration**: Utilizes Google Gemini Pro for general conversational AI.

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
    BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
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
