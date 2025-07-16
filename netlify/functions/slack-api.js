// netlify/functions/slack-api.js

exports.handler = async function () {
  const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
  const CHANNEL_ID = "C096NHNUG7J"; // ← #news のチャンネルID

  try {
    const response = await fetch(`https://slack.com/api/conversations.history?channel=${CHANNEL_ID}&limit=10`, {
      headers: {
        Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
      },
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
