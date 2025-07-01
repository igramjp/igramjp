<?php
$apiKey = file_get_contents(dirname(__FILE__)  .'/../../token/chatgpt-api-token.txt');
$apiUrl = 'https://api.openai.com/v1/chat/completions';
$headers = [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey,
];
$data = [
    'model' => 'gpt-3.5-turbo',
    'messages' => [
        [
            "role" => "system",
            "content" => "日本語で応答してください"
        ],
        [
            "role" => "user",
            "content" => "過去のプログラマーの名言を70文字以内で教えて",
        ]
    ],
    'temperature' => 0.8,
    'max_tokens' => 140,
];
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
$response = curl_exec($ch);
if (curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
}
curl_close($ch);

header('Content-Type: application/json');
echo $response;
