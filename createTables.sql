create table if not exists movies(
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(50) UNIQUE NOT NULL,
	description TEXT,
	duration INTEGER NOT NULL,
	price DECIMAL(10,2) NOT NULL
);

INSERT INTO movies
(name, description,duration, price)
VALUES
('Avatar', 'Nova terra', 210, 13.00),
('Marvel', 'Filme de heróis', 260, 14.00),
('DC', 'Filme de super heróis', 220, 12.00);
