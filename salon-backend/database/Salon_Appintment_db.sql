

DROP TABLE IF EXISTS appointment_service, review, appointment, time_slot, staff_schedule, staff_service, customer, staff, service, users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL
        CHECK(role IN ('CUSTOMER','STAFF','ADMIN')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customer (
    user_id INT PRIMARY KEY,
    gender VARCHAR(20),
    preferences TEXT,

    FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE staff (
    user_id INT PRIMARY KEY,
    gender VARCHAR(20),
    specialization VARCHAR(100),
    experience_years INT,

    FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE service (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    target_gender VARCHAR(20)
        CHECK(target_gender IN ('MALE','FEMALE','UNISEX')),
    duration_minutes INT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE staff_service (
    staff_id INT,
    service_id INT,

    PRIMARY KEY(staff_id, service_id),

    FOREIGN KEY(staff_id)
        REFERENCES staff(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY(service_id)
        REFERENCES service(id)
        ON DELETE CASCADE
);

CREATE TABLE staff_schedule (
    id SERIAL PRIMARY KEY,
    staff_id INT NOT NULL,

    day_of_week VARCHAR(10)
        CHECK(day_of_week IN
        ('MONDAY','TUESDAY','WEDNESDAY',
         'THURSDAY','FRIDAY',
         'SATURDAY','SUNDAY')),

    work_start TIME NOT NULL,
    work_end TIME NOT NULL,

    FOREIGN KEY(staff_id)
        REFERENCES staff(user_id)
        ON DELETE CASCADE
);

CREATE TABLE time_slot (
    id SERIAL PRIMARY KEY,
    staff_id INT NOT NULL,

    slot_date DATE NOT NULL,

    start_time TIME NOT NULL,
    end_time TIME NOT NULL,

    status VARCHAR(20)
        DEFAULT 'AVAILABLE'
        CHECK(status IN
        ('AVAILABLE','BOOKED','UNAVAILABLE')),

    FOREIGN KEY(staff_id)
        REFERENCES staff(user_id)
        ON DELETE CASCADE
);

CREATE TABLE appointment (
    id SERIAL PRIMARY KEY,

    customer_id INT NOT NULL,

    slot_id INT UNIQUE NOT NULL,

    appointment_date TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    notes TEXT,

    status VARCHAR(20)
        DEFAULT 'BOOKED'
        CHECK(status IN
        ('BOOKED',
         'COMPLETED',
         'CANCELLED',
         'NO_SHOW')),

    FOREIGN KEY(customer_id)
        REFERENCES customer(user_id),

    FOREIGN KEY(slot_id)
        REFERENCES time_slot(id)
);

CREATE TABLE appointment_service (

    appointment_id INT,

    service_id INT,

    PRIMARY KEY(appointment_id, service_id),

    FOREIGN KEY(appointment_id)
        REFERENCES appointment(id)
        ON DELETE CASCADE,

    FOREIGN KEY(service_id)
        REFERENCES service(id)
        ON DELETE CASCADE
);

CREATE TABLE review (
    id SERIAL PRIMARY KEY,

    appointment_id INT UNIQUE NOT NULL,

    customer_id INT NOT NULL,

    staff_id INT NOT NULL,

    rating INT
        CHECK(rating BETWEEN 1 AND 5),

    comment TEXT,

    created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(appointment_id)
        REFERENCES appointment(id)
        ON DELETE CASCADE,

    FOREIGN KEY(customer_id)
        REFERENCES customer(user_id),

    FOREIGN KEY(staff_id)
        REFERENCES staff(user_id)
);