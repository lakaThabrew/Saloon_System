-- Clear existing data (optional, in correct order of FKs)
TRUNCATE appointment_service, review, appointment, time_slot, staff_schedule, staff_service, customer, staff, service, users RESTART IDENTITY CASCADE;

-- Insert Services
INSERT INTO service (service_name, category, target_gender, duration_minutes, description, is_active) VALUES
('Signature Haircut', NULL, 'UNISEX', 45, 'Precision cut, wash, and signature finish tailored to your look.', true),
('Classic Beard Trim', NULL, 'MALE', 30, 'Sculpting, hot towel treatment, and beard oil conditioning.', true),
('Full Colour', NULL, 'UNISEX', 90, 'Rich full-head colour transformation using premium organic dyes.', true),
('Balayage', NULL, 'FEMALE', 120, 'Hand-painted natural highlights for a sun-kissed dimension.', true),
('Scalp & Hair Spa', NULL, 'UNISEX', 60, 'Deep conditioning treatment, scalp massage, and steam therapy.', true),
('Gel Manicure', NULL, 'FEMALE', 45, 'Nail shaping, cuticle care, and long-lasting gel polish.', true),
('Bridal Makeup', NULL, 'FEMALE', 75, 'Flawless camera-ready makeup design for your special day.', true),
('Kids Cut', NULL, 'UNISEX', 30, 'Gentle and stylish haircut tailored for young ones.', true),
('Blow-Dry & Style', NULL, 'FEMALE', 45, 'Wash, blow-dry, and professional styling for any event.', true);

-- Insert Staff Users
INSERT INTO users (full_name, email, password, phone, role) VALUES
('Elena Rostova', 'elena@salon.com', '$2a$10$Dk4AXFNqcp..fdlhywFQuuZPkK0/mjnuwJYOi.jcNYEw.UZoryDLO', '+1 555-0101', 'STAFF'),
('Marcus Vance', 'marcus@salon.com', '$2a$10$Dk4AXFNqcp..fdlhywFQuuZPkK0/mjnuwJYOi.jcNYEw.UZoryDLO', '+1 555-0102', 'STAFF'),
('Sophia Chen', 'sophia@salon.com', '$2a$10$Dk4AXFNqcp..fdlhywFQuuZPkK0/mjnuwJYOi.jcNYEw.UZoryDLO', '+1 555-0103', 'STAFF'),
('Liam Thorne', 'liam@salon.com', '$2a$10$Dk4AXFNqcp..fdlhywFQuuZPkK0/mjnuwJYOi.jcNYEw.UZoryDLO', '+1 555-0104', 'STAFF');

-- Insert Staff Details
INSERT INTO staff (user_id, gender, specialization, experience_years) VALUES
(1, 'FEMALE', 'Master Stylist & Colour Specialist', 8),
(2, 'MALE', 'Senior Barber & Grooming Expert', 6),
(3, 'FEMALE', 'Nail Artist & Spa Specialist', 5),
(4, 'MALE', 'Creative Director & Hair Artist', 10);

-- Link Staff to Services
INSERT INTO staff_service (staff_id, service_id) VALUES
(1, 1), (1, 3), (1, 4), (1, 9),
(2, 1), (2, 2), (2, 8),
(3, 5), (3, 6), (3, 7),
(4, 1), (4, 3), (4, 4), (4, 5);

-- Insert Customer User
INSERT INTO users (full_name, email, password, phone, role) VALUES
('Alice Smith', 'alice@example.com', '$2a$10$Dk4AXFNqcp..fdlhywFQuuZPkK0/mjnuwJYOi.jcNYEw.UZoryDLO', '+1 555-0201', 'CUSTOMER');

-- Insert Customer Details
INSERT INTO customer (user_id, gender, preferences) VALUES
(5, 'FEMALE', 'Prefers organic products and tea.');

-- Insert Admin User
INSERT INTO users (full_name, email, password, phone, role) VALUES
('System Administrator', 'admin@salon.com', '$2a$10$Dk4AXFNqcp..fdlhywFQuuZPkK0/mjnuwJYOi.jcNYEw.UZoryDLO', '+1 555-0000', 'ADMIN');

-- Insert Time Slots
INSERT INTO time_slot (staff_id, slot_date, start_time, end_time, status) VALUES
-- Staff 1 (Elena)
(1, CURRENT_DATE, '09:00:00', '10:00:00', 'AVAILABLE'),
(1, CURRENT_DATE, '10:00:00', '11:00:00', 'AVAILABLE'),
(1, CURRENT_DATE, '11:30:00', '12:30:00', 'AVAILABLE'),
(1, CURRENT_DATE, '14:00:00', '15:00:00', 'AVAILABLE'),
(1, CURRENT_DATE + INTERVAL '1 day', '09:00:00', '10:00:00', 'AVAILABLE'),
(1, CURRENT_DATE + INTERVAL '1 day', '10:30:00', '11:30:00', 'AVAILABLE'),
(1, CURRENT_DATE + INTERVAL '1 day', '13:00:00', '14:00:00', 'AVAILABLE'),

-- Staff 2 (Marcus)
(2, CURRENT_DATE, '09:00:00', '09:45:00', 'AVAILABLE'),
(2, CURRENT_DATE, '10:00:00', '10:45:00', 'AVAILABLE'),
(2, CURRENT_DATE, '11:00:00', '11:45:00', 'AVAILABLE'),
(2, CURRENT_DATE, '13:30:00', '14:15:00', 'AVAILABLE'),
(2, CURRENT_DATE + INTERVAL '1 day', '09:30:00', '10:15:00', 'AVAILABLE'),
(2, CURRENT_DATE + INTERVAL '1 day', '11:00:00', '11:45:00', 'AVAILABLE'),

-- Staff 3 (Sophia)
(3, CURRENT_DATE, '10:00:00', '11:00:00', 'AVAILABLE'),
(3, CURRENT_DATE, '11:30:00', '12:30:00', 'AVAILABLE'),
(3, CURRENT_DATE, '14:00:00', '15:00:00', 'AVAILABLE'),

-- Staff 4 (Liam)
(4, CURRENT_DATE, '09:00:00', '10:00:00', 'AVAILABLE'),
(4, CURRENT_DATE, '10:30:00', '11:30:00', 'AVAILABLE'),
(4, CURRENT_DATE, '13:00:00', '14:00:00', 'AVAILABLE'),
(4, CURRENT_DATE, '15:00:00', '16:00:00', 'AVAILABLE');
