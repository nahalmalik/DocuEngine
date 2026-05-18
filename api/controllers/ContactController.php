<?php

require_once __DIR__ . '/../services/MailService.php';

class ContactController {

    public function send() {
        $data = json_decode(file_get_contents('php://input'), true);

        if (
            empty($data['name']) ||
            empty($data['email']) ||
            empty($data['message'])
        ) {
            Response::error('All fields are required', 400);
        }

        $name = $data['name'];
        $email = $data['email'];
        $message = $data['message'];

        $subject = "New Contact Form Message - " . APP_NAME;

        $body = "
            <h2>New Contact Request</h2>
            <p><b>Name:</b> {$name}</p>
            <p><b>Email:</b> {$email}</p>
            <p><b>Message:</b><br>{$message}</p>
        ";

        // send to YOUR email
        $adminEmail = "nahalimran2001@gmail.com";

        $sent = MailService::send($adminEmail, $subject, $body, true);

        if ($sent) {
            Response::success(['message' => 'Message sent successfully']);
        } else {
            Response::error('Failed to send message', 500);
        }
    }
}