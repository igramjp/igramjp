<?php
$token = file_get_contents(dirname(__FILE__)  .'/../../token/slack-api-token.txt');
$channelId = 'C05TW4NGJSF';

$url = "https://slack.com/api/conversations.history?channel=$channelId&limit=10";
$options = [
    "http" => [
        "method" => "GET",
        "header" => "Authorization: Bearer $token"
    ]
];
$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);

if ($response === FALSE) {
    die('Error occurred while fetching conversations history');
}

header('Content-Type: application/json');
echo $response;