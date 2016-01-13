<?php
require_once('./config.php');

$user=$_GET["user"];
$text=$_GET["text"];

$mysqli = new mysqli($host, $username, $passwd, $dbname);

if (!($stmt = $mysqli->prepare("INSERT INTO chats (time, user, text) VALUES(CURRENT_TIMESTAMP, ?, ?)"))) {
    echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
    return;
}
if (!$stmt->bind_param("ss", $user, $text)) {
    echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
    return;
}
if (!$stmt->execute()) {
    echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
    return;
}

$stmt->close();

$mysqli->close();

echo "Done";

?>