<?php
/**
 * Rizky Pratama — Contact Form Handler
 * Handles POST requests from the contact form
 */

// ── Security Headers ──
header('Content-Type: text/plain; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// ── Only allow POST ──
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo 'error';
    exit;
}

// ── Sanitize & Validate Input ──
$nama  = isset($_POST['nama'])  ? trim(strip_tags($_POST['nama']))  : '';
$email = isset($_POST['email']) ? trim(strip_tags($_POST['email'])) : '';
$pesan = isset($_POST['pesan']) ? trim(strip_tags($_POST['pesan'])) : '';

// Required field check
if (empty($nama) || empty($email) || empty($pesan)) {
    http_response_code(400);
    echo 'error';
    exit;
}

// Email validation
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo 'error';
    exit;
}

// Length limits
if (strlen($nama) > 100 || strlen($email) > 100 || strlen($pesan) > 2000) {
    http_response_code(400);
    echo 'error';
    exit;
}

// ── Configure Email ──
$to      = 'rizky@example.com';   // ← Ganti dengan email Anda
$subject = "Pesan Baru dari Portfolio — {$nama}";

$body    = "Anda menerima pesan baru dari portofolio Anda.\n\n";
$body   .= "Nama   : {$nama}\n";
$body   .= "Email  : {$email}\n";
$body   .= "Pesan  :\n{$pesan}\n\n";
$body   .= "---\nDikirim dari portofolio rizky.dev";

$headers  = "From: noreply@rizky.dev\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// ── Send Email ──
$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    // Optional: log to file
    // $log  = date('Y-m-d H:i:s') . " | {$nama} | {$email}\n";
    // file_put_contents(__DIR__ . '/contact_log.txt', $log, FILE_APPEND | LOCK_EX);

    echo 'success';
} else {
    http_response_code(500);
    echo 'error';
}
?>