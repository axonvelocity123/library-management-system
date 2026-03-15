-- seed.sql: Library Management System

INSERT INTO publishers (name, country, contact_email) VALUES
('Oxford University Press',    'United Kingdom', 'contact@oup.com'),
('Pearson Education',          'United States',  'info@pearson.com'),
('McGraw-Hill',                'United States',  'support@mcgraw.com'),
('Penguin Random House',       'United Kingdom', 'hello@prh.com'),
('HarperCollins',              'United States',  'info@harpercollins.com'),
('Cambridge University Press', 'United Kingdom', 'contact@cup.com'),
('Wiley',                      'United States',  'info@wiley.com'),
('Springer',                   'Germany',        'info@springer.com'),
('Bloomsbury Publishing',      'United Kingdom', 'contact@bloomsbury.com'),
('MIT Press',                  'United States',  'info@mitpress.com');


INSERT INTO categories (name, description) VALUES
('Computer Science',  'Programming, algorithms, software engineering'),
('Mathematics',       'Pure and applied mathematics'),
('Physics',           'Classical and modern physics'),
('Literature',        'Fiction, poetry, and literary criticism'),
('History',           'World history and historical analysis'),
('Biology',           'Life sciences and ecology'),
('Economics',         'Micro and macroeconomics'),
('Philosophy',        'Logic, ethics, and metaphysics'),
('Psychology',        'Human behavior and mental processes'),
('Engineering',       'Civil, mechanical, electrical engineering');


INSERT INTO staff (full_name, email, password_hash, role) VALUES
('Admin User',   'admin@library.com',  '$2b$12$cYT8TorqE1lAaLaLBp7XoOYEfDLlk1W1f0MMvN4fzdpVMSWH9y6B6', 'admin'),
('Sara Khan',    'sara@library.com',   '$2b$12$cYT8TorqE1lAaLaLBp7XoOYEfDLlk1W1f0MMvN4fzdpVMSWH9y6B6', 'librarian'),
('Ahmed Raza',   'ahmed@library.com',  '$2b$12$cYT8TorqE1lAaLaLBp7XoOYEfDLlk1W1f0MMvN4fzdpVMSWH9y6B6', 'librarian'),
('Fatima Malik', 'fatima@library.com', '$2b$12$cYT8TorqE1lAaLaLBp7XoOYEfDLlk1W1f0MMvN4fzdpVMSWH9y6B6', 'librarian'),
('Omar Sheikh',  'omar@library.com',   '$2b$12$cYT8TorqE1lAaLaLBp7XoOYEfDLlk1W1f0MMvN4fzdpVMSWH9y6B6', 'librarian');


INSERT INTO members (full_name, email, phone, address, membership_date, status) VALUES
('Ali Hassan',      'ali.hassan@gmail.com',  '0300-1234567', 'House 5, Gulberg, Lahore',        '2023-01-15', 'active'),
('Ayesha Tariq',    'ayesha.t@gmail.com',    '0301-2345678', 'Flat 3B, DHA Phase 4, Lahore',    '2023-02-20', 'active'),
('Bilal Ahmed',     'bilal.ahmed@gmail.com', '0302-3456789', 'Street 12, Model Town, Lahore',   '2023-03-10', 'active'),
('Zara Hussain',    'zara.h@gmail.com',      '0303-4567890', 'House 22, Johar Town, Lahore',    '2023-04-05', 'active'),
('Hamza Khan',      'hamza.k@gmail.com',     '0304-5678901', 'Block C, Gulshan Ravi, Lahore',   '2023-05-18', 'active'),
('Sana Mirza',      'sana.mirza@gmail.com',  '0305-6789012', 'House 8, Wapda Town, Lahore',     '2023-06-22', 'active'),
('Usman Butt',      'usman.butt@gmail.com',  '0306-7890123', 'Street 5, Faisal Town, Lahore',   '2023-07-11', 'active'),
('Hina Sheikh',     'hina.sheikh@gmail.com', '0307-8901234', 'House 15, Garden Town, Lahore',   '2023-08-30', 'active'),
('Tariq Mahmood',   'tariq.m@gmail.com',     '0308-9012345', 'Flat 7, Cavalry Ground, Lahore',  '2023-09-14', 'active'),
('Nadia Iqbal',     'nadia.iqbal@gmail.com', '0309-0123456', 'House 3, Bahria Town, Lahore',    '2023-10-01', 'active'),
('Kamran Ali',      'kamran.ali@gmail.com',  '0310-1234567', 'Street 9, Iqbal Town, Lahore',    '2023-11-05', 'active'),
('Rabia Nawaz',     'rabia.n@gmail.com',     '0311-2345678', 'House 44, Samanabad, Lahore',     '2023-12-19', 'active'),
('Faisal Qureshi',  'faisal.q@gmail.com',    '0312-3456789', 'Block D, Allama Iqbal Town',      '2024-01-08', 'active'),
('Maryam Zahid',    'maryam.z@gmail.com',    '0313-4567890', 'House 6, Township, Lahore',       '2024-02-14', 'active'),
('Saad Farooq',     'saad.f@gmail.com',      '0314-5678901', 'Street 3, Raiwind Road, Lahore',  '2024-03-21', 'active'),
('Amna Siddiqui',   'amna.s@gmail.com',      '0315-6789012', 'House 11, Gulberg III, Lahore',   '2024-04-17', 'active'),
('Rizwan Chaudhry', 'rizwan.c@gmail.com',    '0316-7890123', 'Flat 2, Cantt Area, Lahore',      '2024-05-09', 'suspended'),
('Lubna Javed',     'lubna.j@gmail.com',     '0317-8901234', 'House 27, Shadman, Lahore',       '2024-06-03', 'suspended'),
('Asad Malik',      'asad.m@gmail.com',      '0318-9012345', 'Street 7, Mustafa Town, Lahore',  '2024-07-25', 'expired'),
('Sidra Rehman',    'sidra.r@gmail.com',     '0319-0123456', 'House 33, Fortress Stadium Area', '2024-08-12', 'active');


INSERT INTO books (title, author, isbn, publisher_id, published_year, total_copies) VALUES
('Introduction to Algorithms',           'Thomas H. Cormen',     '978-0262033848', 1, 2009, 5),
('Clean Code',                           'Robert C. Martin',     '978-0132350884', 2, 2008, 4),
('The Great Gatsby',                     'F. Scott Fitzgerald',  '978-0743273565', 4, 1925, 3),
('A Brief History of Time',              'Stephen Hawking',      '978-0553380163', 5, 1988, 4),
('Calculus: Early Transcendentals',      'James Stewart',        '978-1285741550', 3, 2015, 3),
('Pride and Prejudice',                  'Jane Austen',          '978-0141439518', 4, 1813, 4),
('The Selfish Gene',                     'Richard Dawkins',      '978-0198788607', 1, 1976, 3),
('Thinking, Fast and Slow',              'Daniel Kahneman',      '978-0374533557', 5, 2011, 4),
('Principles of Economics',              'N. Gregory Mankiw',    '978-1305585126', 3, 2014, 3),
('The Republic',                         'Plato',                '978-0140455113', 6, 2003, 2),
('Design Patterns',                      'Gang of Four',         '978-0201633610', 7, 1994, 4),
('1984',                                 'George Orwell',        '978-0451524935', 4, 1949, 5),
('Physics for Scientists and Engineers', 'Paul A. Tipler',       '978-1429201247', 3, 2007, 3),
('The Lean Startup',                     'Eric Ries',            '978-0307887894', 5, 2011, 3),
('Sapiens',                              'Yuval Noah Harari',    '978-0062316097', 5, 2011, 4),
('Introduction to Psychology',           'James W. Kalat',       '978-1337565691', 2, 2016, 3),
('Database System Concepts',             'Abraham Silberschatz', '978-0078022159', 3, 2019, 5),
('The Pragmatic Programmer',             'David Thomas',         '978-0135957059', 2, 2019, 3),
('Atomic Habits',                        'James Clear',          '978-0735211292', 5, 2018, 4),
('Harry Potter and the Sorcerers Stone', 'J.K. Rowling',         '978-0590353427', 9, 1997, 5);


INSERT INTO book_copies (book_id, condition, status) VALUES
(1, 'good',    'available'),
(1, 'good',    'available'),
(1, 'fair',    'available'),
(1, 'good',    'available'),
(1, 'damaged', 'available'),
(2, 'good',    'available'),
(2, 'good',    'available'),
(2, 'fair',    'available'),
(2, 'good',    'available'),
(3, 'good',    'available'),
(3, 'fair',    'available'),
(3, 'good',    'available'),
(4, 'good',    'available'),
(4, 'good',    'available'),
(4, 'fair',    'available'),
(4, 'good',    'available'),
(5, 'good',    'available'),
(5, 'fair',    'available'),
(5, 'good',    'available'),
(6, 'good',    'available'),
(6, 'good',    'available'),
(6, 'fair',    'available'),
(6, 'good',    'available'),
(7, 'good',    'available'),
(7, 'fair',    'available'),
(7, 'good',    'available'),
(8, 'good',    'available'),
(8, 'good',    'available'),
(8, 'fair',    'available'),
(8, 'good',    'available'),
(9, 'good',    'available'),
(9, 'fair',    'available'),
(9, 'good',    'available'),
(10, 'good',   'available'),
(10, 'fair',   'available'),
(11, 'good',   'available'),
(11, 'good',   'available'),
(11, 'fair',   'available'),
(11, 'good',   'available'),
(12, 'good',   'available'),
(12, 'good',   'available'),
(12, 'fair',   'available'),
(12, 'good',   'available'),
(12, 'good',   'available'),
(13, 'good',   'available'),
(13, 'fair',   'available'),
(13, 'good',   'available'),
(14, 'good',   'available'),
(14, 'fair',   'available'),
(14, 'good',   'available'),
(15, 'good',   'available'),
(15, 'good',   'available'),
(15, 'fair',   'available'),
(15, 'good',   'available'),
(16, 'good',   'available'),
(16, 'fair',   'available'),
(16, 'good',   'available'),
(17, 'good',   'available'),
(17, 'good',   'available'),
(17, 'fair',   'available'),
(17, 'good',   'available'),
(17, 'good',   'available'),
(18, 'good',   'available'),
(18, 'fair',   'available'),
(18, 'good',   'available'),
(19, 'good',   'available'),
(19, 'good',   'available'),
(19, 'fair',   'available'),
(19, 'good',   'available'),
(20, 'good',   'available'),
(20, 'good',   'available'),
(20, 'fair',   'available'),
(20, 'good',   'available'),
(20, 'good',   'available');


INSERT INTO book_category_map (book_id, category_id) VALUES
(1,  1), (1,  2),
(2,  1),
(3,  4),
(4,  3),
(5,  2),
(6,  4),
(7,  6),
(8,  9),
(9,  7),
(10, 8),
(11, 1),
(12, 4), (12, 8),
(13, 3), (13, 10),
(14, 7),
(15, 5), (15, 6),
(16, 9),
(17, 1),
(18, 1),
(19, 9),
(20, 4);


INSERT INTO loans (member_id, copy_id, staff_id, borrow_date, due_date, return_date) VALUES
(1,  1,  2, '2025-01-05', '2025-01-19', NULL),
(2,  6,  2, '2025-01-10', '2025-01-24', NULL),
(3,  10, 3, '2025-01-12', '2025-01-26', NULL),
(4,  13, 2, '2025-01-15', '2025-01-29', NULL),
(5,  17, 4, '2025-01-18', '2025-02-01', NULL),
(6,  20, 2, '2025-01-01', '2025-01-15', NULL),
(7,  24, 3, '2025-01-03', '2025-01-17', NULL),
(8,  28, 4, '2025-01-05', '2025-01-19', NULL),
(9,  30, 2, '2025-01-07', '2025-01-21', NULL),
(10, 33, 3, '2025-01-09', '2025-01-23', NULL),
(11, 36, 2, '2024-12-01', '2024-12-15', NULL),
(12, 40, 3, '2024-12-05', '2024-12-19', NULL),
(13, 44, 4, '2024-12-10', '2024-12-24', NULL),
(14, 48, 2, '2024-12-15', '2024-12-29', NULL),
(15, 52, 3, '2024-12-20', '2025-01-03', NULL),
(16, 55, 4, '2025-01-20', '2025-02-03', NULL),
(1,  58, 2, '2025-01-22', '2025-02-05', NULL),
(2,  62, 3, '2025-01-25', '2025-02-08', NULL),
(3,  65, 4, '2025-01-28', '2025-02-11', NULL),
(4,  66, 2, '2025-02-01', '2025-02-15', NULL),
(5,  70, 3, '2025-02-05', '2025-02-19', NULL),
(6,  71, 4, '2025-02-08', '2025-02-22', NULL),
(7,  72, 2, '2025-02-10', '2025-02-24', NULL),
(8,  73, 3, '2025-02-12', '2025-02-26', NULL),
(9,  74, 4, '2025-02-15', '2025-03-01', NULL);

-- On-time returns
UPDATE loans SET return_date = '2025-01-14' WHERE loan_id = 6;
UPDATE loans SET return_date = '2025-01-16' WHERE loan_id = 7;
UPDATE loans SET return_date = '2025-01-18' WHERE loan_id = 8;
UPDATE loans SET return_date = '2025-01-20' WHERE loan_id = 9;
UPDATE loans SET return_date = '2025-01-22' WHERE loan_id = 10;
UPDATE loans SET return_date = '2025-02-01' WHERE loan_id = 16;
UPDATE loans SET return_date = '2025-02-03' WHERE loan_id = 17;
UPDATE loans SET return_date = '2025-02-07' WHERE loan_id = 18;
UPDATE loans SET return_date = '2025-02-10' WHERE loan_id = 19;
UPDATE loans SET return_date = '2025-02-14' WHERE loan_id = 20;

-- Late returns (triggers auto-generate fines)
UPDATE loans SET return_date = '2024-12-25' WHERE loan_id = 11;
UPDATE loans SET return_date = '2024-12-30' WHERE loan_id = 12;
UPDATE loans SET return_date = '2025-01-05' WHERE loan_id = 13;
UPDATE loans SET return_date = '2025-01-10' WHERE loan_id = 14;
UPDATE loans SET return_date = '2025-01-15' WHERE loan_id = 15;


INSERT INTO reservations (member_id, book_id, reserved_date, status) VALUES
(10, 1,  '2025-01-20', 'pending'),
(11, 2,  '2025-01-21', 'pending'),
(12, 4,  '2025-01-22', 'pending'),
(13, 12, '2025-01-23', 'fulfilled'),
(14, 17, '2025-01-24', 'fulfilled'),
(15, 20, '2025-01-25', 'pending'),
(16, 8,  '2025-01-26', 'cancelled'),
(1,  15, '2025-01-27', 'pending'),
(2,  19, '2025-01-28', 'pending'),
(3,  11, '2025-01-29', 'cancelled');
