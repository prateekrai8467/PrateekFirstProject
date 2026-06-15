-- ============================================================
-- ROOM ALLOCATION SYSTEM — COMPLETE DATABASE
-- Cleaned, Fixed & Upgraded
-- ============================================================

CREATE DATABASE IF NOT EXISTS room_allocation_system;
USE room_allocation_system;

-- ============================================================
-- TABLE 1: users
-- Stores students, faculty, and admin
-- ============================================================
CREATE TABLE IF NOT EXISTS `users` (
  `user_id`    INT NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(100) NOT NULL,
  `email`      VARCHAR(100) NOT NULL,
  `password`   VARCHAR(255) NOT NULL,        -- store bcrypt hash here
  `role`       ENUM('student','faculty','admin') NOT NULL DEFAULT 'student',
  `phone`      VARCHAR(15) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- TABLE 2: rooms
-- Stores all rooms with status tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS `rooms` (
  `room_id`     INT NOT NULL AUTO_INCREMENT,
  `room_number` VARCHAR(20) NOT NULL,
  `type`        ENUM('classroom','lab','seminar_hall','conference_room','library_room') NOT NULL,
  `capacity`    INT NOT NULL DEFAULT 0,
  `location`    VARCHAR(100) DEFAULT NULL,   -- e.g. "Block A, Floor 2"
  `description` TEXT DEFAULT NULL,
  `status`      ENUM('vacant','occupied','maintenance') NOT NULL DEFAULT 'vacant',
  `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`room_id`),
  UNIQUE KEY `room_number` (`room_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- TABLE 3: resources
-- Stores equipment/items with quantity tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS `resources` (
  `resource_id`         INT NOT NULL AUTO_INCREMENT,
  `resource_name`       VARCHAR(100) NOT NULL,
  `total_quantity`      INT NOT NULL DEFAULT 0,
  `available_quantity`  INT NOT NULL DEFAULT 0,   -- decreases on booking
  `description`         TEXT DEFAULT NULL,
  `created_at`          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`resource_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- TABLE 4: bookings
-- Core table — room booking requests by users
-- ============================================================
CREATE TABLE IF NOT EXISTS `bookings` (
  `booking_id`   INT NOT NULL AUTO_INCREMENT,
  `user_id`      INT NOT NULL,
  `room_id`      INT NOT NULL,
  `booking_date` DATE NOT NULL,
  `start_time`   TIME NOT NULL,
  `end_time`     TIME NOT NULL,
  `purpose`      TEXT DEFAULT NULL,
  `status`       ENUM('pending','approved','rejected','cancelled') NOT NULL DEFAULT 'pending',
  `created_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`booking_id`),
  KEY `user_id` (`user_id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- TABLE 5: booking_resources
-- Links resources (equipment) to a booking
-- ============================================================
CREATE TABLE IF NOT EXISTS `booking_resources` (
  `id`            INT NOT NULL AUTO_INCREMENT,
  `booking_id`    INT NOT NULL,
  `resource_id`   INT NOT NULL,
  `quantity_used` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `booking_id` (`booking_id`),
  KEY `resource_id` (`resource_id`),
  CONSTRAINT `br_ibfk_1` FOREIGN KEY (`booking_id`)  REFERENCES `bookings`  (`booking_id`) ON DELETE CASCADE,
  CONSTRAINT `br_ibfk_2` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`resource_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- TABLE 6: approvals
-- Tracks who approved or rejected which booking
-- ============================================================
CREATE TABLE IF NOT EXISTS `approvals` (
  `approval_id`     INT NOT NULL AUTO_INCREMENT,
  `booking_id`      INT NOT NULL,
  `approved_by`     INT NOT NULL,             -- must be admin or faculty role
  `approval_status` ENUM('approved','rejected') NOT NULL,
  `remarks`         TEXT DEFAULT NULL,        -- optional reason for rejection
  `actioned_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`approval_id`),
  KEY `booking_id`  (`booking_id`),
  KEY `approved_by` (`approved_by`),
  CONSTRAINT `approvals_ibfk_1` FOREIGN KEY (`booking_id`)  REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE,
  CONSTRAINT `approvals_ibfk_2` FOREIGN KEY (`approved_by`) REFERENCES `users`    (`user_id`)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- TABLE 7: audit_logs
-- Enterprise Audit Trail for tracking changes
-- ============================================================
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `log_id`      INT NOT NULL AUTO_INCREMENT,
  `user_id`     INT DEFAULT NULL,            -- Can be null if system action
  `action`      VARCHAR(255) NOT NULL,
  `old_value`   TEXT DEFAULT NULL,
  `new_value`   TEXT DEFAULT NULL,
  `timestamp`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- SAMPLE DATA (Seed)
-- ============================================================

-- Users (passwords should be bcrypt hashed in production)
INSERT INTO `users` (`name`, `email`, `password`, `role`, `phone`) VALUES
('Sanjana Prasad', 'sanjana1419@gmail.com',  '$2b$10$placeholder_hash_1', 'student', '9876543210'),
('Aman Sharma',    'amansharma9988@gmail.com','$2b$10$placeholder_hash_2', 'faculty', '9876543211'),
('Riya Verma',     'riya1261@gmail.com',      '$2b$10$placeholder_hash_3', 'admin',   '9876543212'),
('Kunal Singh',    'kunal@gmail.com',         '$2b$10$placeholder_hash_4', 'student', '9876543213');

-- Rooms
INSERT INTO `rooms` (`room_number`, `type`, `capacity`, `location`, `status`) VALUES
('A101', 'classroom',    60,  'Block A, Floor 1', 'vacant'),
('B202', 'lab',          40,  'Block B, Floor 2', 'vacant'),
('C303', 'seminar_hall', 120, 'Block C, Floor 3', 'vacant');

-- Resources
INSERT INTO `resources` (`resource_name`, `total_quantity`, `available_quantity`) VALUES
('Projector',   5,  5),
('Computer',    50, 50),
('Whiteboard',  10, 10);

-- Bookings
INSERT INTO `bookings` (`user_id`, `room_id`, `booking_date`, `start_time`, `end_time`, `purpose`, `status`) VALUES
(1, 1, '2026-03-25', '10:00:00', '12:00:00', 'Study Session', 'approved'),
(2, 2, '2026-03-26', '14:00:00', '16:00:00', 'Lab Work',      'pending'),
(4, 3, '2026-03-27', '09:00:00', '11:00:00', 'Seminar',       'approved');

-- Booking Resources
INSERT INTO `booking_resources` (`booking_id`, `resource_id`, `quantity_used`) VALUES
(1, 1, 1),
(2, 2, 20),
(3, 1, 2);

-- Approvals
INSERT INTO `approvals` (`booking_id`, `approved_by`, `approval_status`, `remarks`) VALUES
(1, 3, 'approved', 'Approved for study session'),
(3, 3, 'approved', 'Seminar approved');