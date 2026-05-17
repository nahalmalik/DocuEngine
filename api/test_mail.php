<?php
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/services/MailService.php';

$to = $_GET['to'] ?? null;
if (!$to) {
    echo "Usage: test_mail.php?to=you@example.com\n";
    exit;
}

$subject = APP_NAME . ' SMTP Test';
$message = "This is a test email sent from the InvoQuote SMTP mailer.\n\nIf you receive this, SMTP is configured correctly.\n";

$sent = MailService::send($to, $subject, $message, false);
if ($sent) {
    echo "Email sent successfully to {$to}.\n";
} else {
    echo "Failed to send email. Check SMTP settings in api/config/config.php and server logs.\n";
}
