<?PHP
    $host= gethostname();
    $ip = gethostbyname($host);
    echo "Server IP = " . $ip;
    echo "\nHost    = " . $host;
?>