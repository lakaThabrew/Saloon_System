BEGIN;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    full_name VARCHAR(100) NOT NULL,

    email VARCHAR(100) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,

    phone VARCHAR(20),

    role VARCHAR(20) NOT NULL
        CHECK (role IN ('CUSTOMER', 'STAFF', 'ADMIN')),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 2. CUSTOMER
-- user_id is both PK and FK
-- ============================================================

CREATE TABLE customer (
    user_id INT PRIMARY KEY,

    gender VARCHAR(20)
        CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),

    preferences TEXT,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 3. STAFF
-- Extra id column has been removed
-- user_id is the primary key
-- ============================================================

CREATE TABLE staff (
    user_id INT PRIMARY KEY,

    gender VARCHAR(20)
        CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),

    specialization VARCHAR(100),

    experience_years INT
        CHECK (experience_years >= 0),

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 4. SERVICE
-- ============================================================

CREATE TABLE service (
    id SERIAL PRIMARY KEY,

    service_name VARCHAR(100) NOT NULL,

    category VARCHAR(50),

    target_gender VARCHAR(20)
        CHECK (target_gender IN ('MALE', 'FEMALE', 'UNISEX')),

    duration_minutes INT NOT NULL
        CHECK (duration_minutes > 0),

    description TEXT,

    is_active BOOLEAN DEFAULT TRUE
);


-- ============================================================
-- 5. STAFF SERVICE
-- Many-to-many relationship between staff and services
-- ============================================================

CREATE TABLE staff_service (
    staff_id INT NOT NULL,

    service_id INT NOT NULL,

    PRIMARY KEY (staff_id, service_id),

    FOREIGN KEY (staff_id)
        REFERENCES staff(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (service_id)
        REFERENCES service(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 6. STAFF SCHEDULE
-- ============================================================

CREATE TABLE staff_schedule (
    id SERIAL PRIMARY KEY,

    staff_id INT NOT NULL,

    day_of_week VARCHAR(10) NOT NULL
        CHECK (
            day_of_week IN (
                'MONDAY',
                'TUESDAY',
                'WEDNESDAY',
                'THURSDAY',
                'FRIDAY',
                'SATURDAY',
                'SUNDAY'
            )
        ),

    work_start TIME NOT NULL,

    work_end TIME NOT NULL,

    CHECK (work_end > work_start),

    FOREIGN KEY (staff_id)
        REFERENCES staff(user_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 7. TIME SLOT
-- ============================================================

CREATE TABLE time_slot (
    id SERIAL PRIMARY KEY,

    staff_id INT NOT NULL,

    slot_date DATE NOT NULL,

    start_time TIME NOT NULL,

    end_time TIME NOT NULL,

    status VARCHAR(20) NOT NULL
        DEFAULT 'AVAILABLE'
        CHECK (
            status IN (
                'AVAILABLE',
                'BOOKED',
                'UNAVAILABLE'
            )
        ),

    CHECK (end_time > start_time),

    FOREIGN KEY (staff_id)
        REFERENCES staff(user_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 8. APPOINTMENT
-- ============================================================

CREATE TABLE appointment (
    id SERIAL PRIMARY KEY,

    customer_id INT NOT NULL,

    slot_id INT UNIQUE NOT NULL,

    appointment_date TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    notes TEXT,

    status VARCHAR(20) NOT NULL
        DEFAULT 'BOOKED'
        CHECK (
            status IN (
                'BOOKED',
                'COMPLETED',
                'CANCELLED',
                'NO_SHOW'
            )
        ),

    FOREIGN KEY (customer_id)
        REFERENCES customer(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (slot_id)
        REFERENCES time_slot(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 9. APPOINTMENT SERVICE
-- Many-to-many relationship
-- ============================================================

CREATE TABLE appointment_service (
    appointment_id INT NOT NULL,

    service_id INT NOT NULL,

    PRIMARY KEY (appointment_id, service_id),

    FOREIGN KEY (appointment_id)
        REFERENCES appointment(id)
        ON DELETE CASCADE,

    FOREIGN KEY (service_id)
        REFERENCES service(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 10. REVIEW
-- ============================================================

CREATE TABLE review (
    id SERIAL PRIMARY KEY,

    appointment_id INT UNIQUE NOT NULL,

    customer_id INT NOT NULL,

    staff_id INT NOT NULL,

    rating INT NOT NULL
        CHECK (rating BETWEEN 1 AND 5),

    comment TEXT,

    created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (appointment_id)
        REFERENCES appointment(id)
        ON DELETE CASCADE,

    FOREIGN KEY (customer_id)
        REFERENCES customer(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (staff_id)
        REFERENCES staff(user_id)
        ON DELETE CASCADE
);


-- ============================================================
-- MOCK DATA
-- ============================================================


-- ============================================================
-- 1. USERS
-- IDs: 1 to 15
-- ============================================================

INSERT INTO users (
    full_name,
    email,
    password,
    phone,
    role
)
VALUES
    ('Alice Admin',
     'alice.admin@salon.com',
     'hashed_pw_admin1',
     '0771000001',
     'ADMIN'),

    ('Bob SuperAdmin',
     'bob.superadmin@salon.com',
     'hashed_pw_admin2',
     '0771000002',
     'ADMIN'),

    ('Carol Stylist',
     'carol.stylist@salon.com',
     'hashed_pw_staff1',
     '0771000003',
     'STAFF'),

    ('David Barber',
     'david.barber@salon.com',
     'hashed_pw_staff2',
     '0771000004',
     'STAFF'),

    ('Emma Therapist',
     'emma.therapist@salon.com',
     'hashed_pw_staff3',
     '0771000005',
     'STAFF'),

    ('Frank Masseur',
     'frank.masseur@salon.com',
     'hashed_pw_staff4',
     '0771000006',
     'STAFF'),

    ('Grace NailTech',
     'grace.nailtech@salon.com',
     'hashed_pw_staff5',
     '0771000007',
     'STAFF'),

    ('Henry Customer',
     'henry.c@example.com',
     'hashed_pw_cust1',
     '0771000008',
     'CUSTOMER'),

    ('Ivy Customer',
     'ivy.c@example.com',
     'hashed_pw_cust2',
     '0771000009',
     'CUSTOMER'),

    ('Jack Customer',
     'jack.c@example.com',
     'hashed_pw_cust3',
     '0771000010',
     'CUSTOMER'),

    ('Kate Customer',
     'kate.c@example.com',
     'hashed_pw_cust4',
     '0771000011',
     'CUSTOMER'),

    ('Liam Customer',
     'liam.c@example.com',
     'hashed_pw_cust5',
     '0771000012',
     'CUSTOMER'),

    ('Mia Customer',
     'mia.c@example.com',
     'hashed_pw_cust6',
     '0771000013',
     'CUSTOMER'),

    ('Noah Customer',
     'noah.c@example.com',
     'hashed_pw_cust7',
     '0771000014',
     'CUSTOMER'),

    ('Olivia Customer',
     'olivia.c@example.com',
     'hashed_pw_cust8',
     '0771000015',
     'CUSTOMER');


-- ============================================================
-- 2. STAFF
-- user_id values: 3 to 7
-- No separate staff.id column
-- ============================================================

INSERT INTO staff (
    user_id,
    gender,
    specialization,
    experience_years
)
VALUES
    (3, 'FEMALE', 'Hair Styling', 6),
    (4, 'MALE', 'Barbering', 9),
    (5, 'FEMALE', 'Skin Therapy', 4),
    (6, 'MALE', 'Massage Therapy', 8),
    (7, 'FEMALE', 'Nail Art', 3);


-- ============================================================
-- 3. CUSTOMERS
-- user_id values: 8 to 15
-- ============================================================

INSERT INTO customer (
    user_id,
    gender,
    preferences
)
VALUES
    (
        8,
        'MALE',
        'Prefers short appointments, no fragrance products'
    ),
    (
        9,
        'FEMALE',
        'Likes organic products'
    ),
    (
        10,
        'MALE',
        'Regular haircut every 3 weeks'
    ),
    (
        11,
        'FEMALE',
        'Sensitive skin'
    ),
    (
        12,
        'MALE',
        'Prefers evening slots'
    ),
    (
        13,
        'FEMALE',
        'Enjoys aromatherapy'
    ),
    (
        14,
        'MALE',
        'No preferences specified'
    ),
    (
        15,
        'FEMALE',
        'Prefers same stylist every visit'
    );


-- ============================================================
-- 4. SERVICES
-- IDs: 1 to 10
-- ============================================================

INSERT INTO service (
    service_name,
    category,
    target_gender,
    duration_minutes,
    description,
    is_active
)
VALUES
    (
        'Classic Haircut',
        'Hair',
        'UNISEX',
        30,
        'Standard haircut and styling',
        TRUE
    ),
    (
        'Beard Trim',
        'Hair',
        'MALE',
        20,
        'Beard shaping and trimming',
        TRUE
    ),
    (
        'Hair Coloring',
        'Hair',
        'UNISEX',
        90,
        'Full hair coloring service',
        TRUE
    ),
    (
        'Facial Treatment',
        'Skin',
        'UNISEX',
        45,
        'Deep cleansing facial',
        TRUE
    ),
    (
        'Anti-Aging Facial',
        'Skin',
        'FEMALE',
        60,
        'Advanced anti-aging skin treatment',
        TRUE
    ),
    (
        'Swedish Massage',
        'Massage',
        'UNISEX',
        60,
        'Relaxing full body massage',
        TRUE
    ),
    (
        'Deep Tissue Massage',
        'Massage',
        'UNISEX',
        60,
        'Therapeutic deep tissue massage',
        TRUE
    ),
    (
        'Manicure',
        'Nails',
        'UNISEX',
        40,
        'Nail shaping, cuticle care and polish',
        TRUE
    ),
    (
        'Pedicure',
        'Nails',
        'UNISEX',
        50,
        'Foot care, exfoliation and polish',
        TRUE
    ),
    (
        'Gel Nail Art',
        'Nails',
        'FEMALE',
        60,
        'Custom gel nail art design',
        TRUE
    );


-- ============================================================
-- 5. STAFF SERVICES
-- ============================================================

INSERT INTO staff_service (
    staff_id,
    service_id
)
VALUES
    (3, 1),
    (3, 3),

    (4, 1),
    (4, 2),

    (5, 4),
    (5, 5),

    (6, 6),
    (6, 7),

    (7, 8),
    (7, 9),
    (7, 10);


-- ============================================================
-- 6. STAFF SCHEDULES
-- ============================================================

INSERT INTO staff_schedule (
    staff_id,
    day_of_week,
    work_start,
    work_end
)
VALUES
    (3, 'MONDAY',    '09:00', '17:00'),
    (3, 'WEDNESDAY', '09:00', '17:00'),
    (3, 'FRIDAY',    '09:00', '17:00'),

    (4, 'TUESDAY',   '10:00', '18:00'),
    (4, 'THURSDAY',  '10:00', '18:00'),
    (4, 'SATURDAY',  '10:00', '15:00'),

    (5, 'MONDAY',    '08:00', '16:00'),
    (5, 'THURSDAY',  '08:00', '16:00'),

    (6, 'WEDNESDAY', '11:00', '19:00'),
    (6, 'FRIDAY',    '11:00', '19:00'),

    (7, 'TUESDAY',   '09:00', '17:00'),
    (7, 'SATURDAY',  '09:00', '14:00');


-- ============================================================
-- 7. TIME SLOTS
-- IDs: 1 to 12
-- ============================================================

INSERT INTO time_slot (
    staff_id,
    slot_date,
    start_time,
    end_time,
    status
)
VALUES
    (3, '2026-07-27', '09:00', '09:30', 'BOOKED'),
    (3, '2026-07-27', '10:00', '11:30', 'BOOKED'),
    (3, '2026-07-29', '09:00', '09:30', 'AVAILABLE'),

    (4, '2026-07-28', '10:00', '10:30', 'BOOKED'),
    (4, '2026-07-28', '11:00', '11:20', 'AVAILABLE'),
    (4, '2026-08-01', '10:00', '10:30', 'UNAVAILABLE'),

    (5, '2026-07-27', '08:00', '08:45', 'BOOKED'),
    (5, '2026-07-30', '09:00', '10:00', 'AVAILABLE'),

    (6, '2026-07-29', '11:00', '12:00', 'BOOKED'),
    (6, '2026-07-31', '12:00', '13:00', 'AVAILABLE'),

    (7, '2026-07-28', '09:00', '09:40', 'BOOKED'),
    (7, '2026-08-01', '09:00', '10:00', 'AVAILABLE');


-- ============================================================
-- 8. APPOINTMENTS
-- IDs: 1 to 6
-- ============================================================

INSERT INTO appointment (
    customer_id,
    slot_id,
    notes,
    status
)
VALUES
    (
        8,
        1,
        'Regular trim',
        'COMPLETED'
    ),
    (
        9,
        2,
        'Full color change to auburn',
        'COMPLETED'
    ),
    (
        10,
        4,
        'Quick beard trim',
        'COMPLETED'
    ),
    (
        11,
        7,
        'Sensitive skin - patch test done',
        'CANCELLED'
    ),
    (
        12,
        9,
        'Requested firmer pressure',
        'COMPLETED'
    ),
    (
        13,
        11,
        'Gel art with floral design',
        'NO_SHOW'
    );


-- ============================================================
-- 9. APPOINTMENT SERVICES
-- ============================================================

INSERT INTO appointment_service (
    appointment_id,
    service_id
)
VALUES
    (1, 1),
    (2, 3),
    (3, 2),
    (4, 4),
    (5, 7),
    (6, 10);


-- ============================================================
-- 10. REVIEWS
-- Only completed appointments receive reviews
-- ============================================================

INSERT INTO review (
    appointment_id,
    customer_id,
    staff_id,
    rating,
    comment
)
VALUES
    (
        1,
        8,
        3,
        5,
        'Great haircut, very professional!'
    ),
    (
        2,
        9,
        3,
        4,
        'Loved the color, slightly longer wait than expected'
    ),
    (
        3,
        10,
        4,
        5,
        'Best beard trim I have had'
    ),
    (
        5,
        12,
        6,
        4,
        'Very relaxing massage, would book again'
    );

COMMIT;