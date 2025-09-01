-- db quanlytrungtrang
ALTER TABLE khachhang ADD COLUMN id_pin VARCHAR(50);
ALTER TABLE khachhang ADD COLUMN pin_health INT;
ALTER TABLE khachhang ADD COLUMN vehicle_type VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
