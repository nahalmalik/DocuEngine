<?php
// api/services/MailService.php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require_once __DIR__ . '/../../vendor/autoload.php';

class MailService {

    public static function send($to, $subject, $body, $isHtml = true) {
        $mail = new PHPMailer(true);

        try {
            // =====================
            // DEBUG (TURN OFF IN PRODUCTION)
            // =====================
            // $mail->SMTPDebug = SMTP::DEBUG_SERVER;
            // $mail->Debugoutput = 'html';

            // =====================
            // SMTP CONFIG
            // =====================
            $mail->isSMTP();
            $mail->Host = SMTP_HOST;
            $mail->SMTPAuth = true;
            $mail->Username = SMTP_USER;
            $mail->Password = SMTP_PASS;
            $mail->SMTPSecure = SMTP_ENCRYPTION;
            $mail->Port = SMTP_PORT;

            // Helps Gmail compatibility
            $mail->SMTPOptions = [
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                ]
            ];

            // =====================
            // EMAIL SETUP
            // =====================
            $mail->setFrom(SMTP_FROM, APP_NAME ?? 'System');
            $mail->addAddress($to);
            $mail->addReplyTo(SMTP_FROM, APP_NAME ?? 'System');

            $mail->isHTML($isHtml);
            $mail->Subject = $subject;
            $mail->Body = $body;

            if (!$isHtml) {
                $mail->AltBody = strip_tags($body);
            }

            // =====================
            // SEND EMAIL
            // =====================
            $mail->send();
            return true;

        } catch (Exception $e) {
            error_log("MailService Error: " . $mail->ErrorInfo);
            return false;
        }
    }
}