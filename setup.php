<?php

require_once('./config.php');

$mysqli = new mysqli($host, $username, $passwd, $dbname);
if ($mysqli->connect_errno) {
    echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
    return;
}
if (!$mysqli->query("DROP TABLE IF EXISTS chats") ||
    !$mysqli->query("CREATE TABLE chats(time TIMESTAMP, user VARCHAR(32), text VARCHAR(256))")) {
    echo "Table creation failed: (" . $mysqli->errno . ") " . $mysqli->error;
    return;
}

echo "Ok";

?>
