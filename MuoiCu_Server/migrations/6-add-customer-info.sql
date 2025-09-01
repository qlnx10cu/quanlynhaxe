-- db quanlymyxuyen, quanlybinhkhanh

ALTER TABLE hoadon ADD COLUMN fuel_level VARCHAR(50);
ALTER TABLE hoadon ADD COLUMN motorbike_wash VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE hoadon ADD COLUMN decline_reason VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE hoadon ADD COLUMN phone_accept VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE hoadon ADD COLUMN old_parts_return_confirmed Boolean DEFAULT FALSE;
