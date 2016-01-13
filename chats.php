<?php

require_once('./config.php');

$mysqli = new mysqli($host, $username, $passwd, $dbname);

if (!($stmt = $mysqli->prepare("SELECT time, user, text FROM chats ORDER BY time DESC"))) {
    echo "Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error;
    return;
}
if (!$stmt->execute()) {
    echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
    return;
}
if (!$stmt->bind_result($out_time, $out_user, $out_text)) {
    echo "Binding output parameters failed: (" . $stmt->errno . ") " . $stmt->error;	
    return;
}

$chats = array();
while ($stmt->fetch()) {
	$chats[] = array('time' => $out_time, 'user' => $out_user, 'text' => $out_text);
}
$stmt->close();

$mysqli->close();

echo json_encode($chats);

?>
