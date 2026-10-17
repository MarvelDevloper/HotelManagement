CREATE DATABASE smart_hotel;
USE smart_hotel;
CREATE TABLE rooms(
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number INT NOT NULL,
    room_type VARCHAR(50),
    price INT,
    status VARCHAR(20)
);
SHOW TABLES;
INSERT INTO rooms(room_number, room_type, price, status)
VALUES
(101, 'Deluxe', 3000, 'Available'),
(102, 'Suite', 5000, 'Available'),
(103, 'Single', 2000, 'Booked'),
(104, 'Double', 3500, 'Available');

SELECT * FROM rooms;

CREATE TABLE bookings(
id INT AUTO_INCREMENT PRIMARY KEY,
guest_name VARCHAR(100),
email VARCHAR(100),
room_id INT,
check_in DATE,
check_out DATE,
status VARCHAR(20),
FOREIGN KEY(room_id) REFERENCES rooms(id)
);
SHOW TABLES;
SELECT * FROM bookings;
CREATE TABLE users(

id INT AUTO_INCREMENT PRIMARY KEY,

name VARCHAR(100),

email VARCHAR(100) UNIQUE,

password VARCHAR(255),

role VARCHAR(20)

);
	
select * from users;


USE smart_hotel;

SELECT id, name, email, role
FROM users;




