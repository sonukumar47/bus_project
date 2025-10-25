<?php
// search.php

// Database connection settings
$servername = "localhost";
$username = "root"; // default XAMPP username
$password = "";     // default XAMPP password (empty)
$database = "bus_tracking_db";

// Connect to MySQL
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get form data
$source = isset($_POST['source']) ? trim($_POST['source']) : '';
$destination = isset($_POST['destination']) ? trim($_POST['destination']) : '';

if ($source === '' || $destination === '') {
    echo "<p>Please enter both Source and Destination.</p>";
    exit;
}

// SQL query (case-insensitive, partial match)
$sql = "SELECT * FROM buses 
        WHERE LOWER(source_location) LIKE CONCAT('%', LOWER(?), '%')
          AND LOWER(destination) LIKE CONCAT('%', LOWER(?), '%')";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $source, $destination);
$stmt->execute();
$result = $stmt->get_result();

// Display results
echo "<h2>Bus Search Results</h2>";

if ($result->num_rows > 0) {
    echo "<table border='1' cellpadding='8'>";
    echo "<tr><th>Bus No</th><th>Source</th><th>Destination</th><th>schedule_arrival_time_at_source</th><th>schedule_arrival_time_at_destination</th><th>Fare (₹)</th><th>track</th></tr>";
    while ($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>" . htmlspecialchars($row['bus_no']) . "</td>";
        echo "<td>" . htmlspecialchars($row['source_location']) . "</td>";
        echo "<td>" . htmlspecialchars($row['destination']) . "</td>";
        echo "<td>" . htmlspecialchars($row['schedule_arrival_time_at_source']) . "</td>";
        echo "<td>" . htmlspecialchars($row['schedule_arrival_time_at_destination']) . "</td>";
        echo "<td>" . htmlspecialchars($row['fare']) . "</td>";
        
         $link = htmlspecialchars($row['link']);
         echo "<td><a href='frontend/index.html' target='_blank'>View</a></td>";
        
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "<p>No buses found from <b>" . htmlspecialchars($source) . "</b> to <b>" . htmlspecialchars($destination) . "</b>.</p>";
}

$stmt->close();
$conn->close();
?>
