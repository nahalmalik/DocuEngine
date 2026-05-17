-- Migration: add email verification and password reset columns to users
ALTER TABLE users
  ADD COLUMN email_verified TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN verify_token VARCHAR(128) NULL DEFAULT NULL,
  ADD COLUMN reset_token VARCHAR(128) NULL DEFAULT NULL,
  ADD COLUMN reset_expires DATETIME NULL DEFAULT NULL;

-- Run this SQL against your database (e.g., via phpMyAdmin or mysql CLI)
