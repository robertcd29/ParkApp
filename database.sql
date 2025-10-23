-- Creează baza de date
CREATE DATABASE parking_db;

-- Conectează-te la baza de date
\c parking_db;

-- Creează tabela parking_lot
CREATE TABLE parking_lot (
    id SERIAL PRIMARY KEY,
    parking_number VARCHAR(10) NOT NULL UNIQUE,
    parking_name VARCHAR(100) NOT NULL UNIQUE,
    empty_spots INTEGER NOT NULL DEFAULT 0,
    occupied_spots INTEGER NOT NULL DEFAULT 0,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    tariff DECIMAL(10, 2) DEFAULT 5.00,
    schedule VARCHAR(50) DEFAULT 'Non-stop',
    facilities TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creează funcție pentru actualizare automată a updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Creează trigger pentru actualizare automată
CREATE TRIGGER update_parking_lot_updated_at
    BEFORE UPDATE ON parking_lot
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Inserează date de exemplu pentru Timișoara
INSERT INTO parking_lot (parking_number, parking_name, empty_spots, occupied_spots, latitude, longitude, facilities) VALUES
('P001', 'Bega_Central', 15, 35, 45.749150, 21.227000, ARRAY['Parcare supravegheată', 'Non-stop']),
('P002', 'Zona_Primarie', 8, 42, 45.751315, 21.227400, ARRAY['Parcare supravegheată', 'Acces persoane dizabilități']),
('P003', 'Zona_Piata_Victoriei', 25, 25, 45.752450, 21.226750, ARRAY['Parcare supravegheată', 'Stații încărcare EV', 'Acces persoane dizabilități']),
('P004', 'Parcul_Central', 40, 10, 45.755000, 21.229000, ARRAY['Parcare gratuită', 'Non-stop']),
('P005', 'Mall_Iulius', 120, 180, 45.747500, 21.230500, ARRAY['Parcare supravegheată', 'Stații încărcare EV', 'Acces persoane dizabilități', 'Non-stop']),
('P006', 'Piata_700', 0, 80, 45.756500, 21.225000, ARRAY['Parcare supravegheată']),
('P007', 'Zona_Spitalului', 5, 45, 45.753000, 21.232000, ARRAY['Acces persoane dizabilități']),
('P008', 'Parcul_Rozelor', 30, 20, 45.758000, 21.227500, ARRAY['Parcare gratuită', 'Non-stop']);

-- Creare index pentru căutări rapide
CREATE INDEX idx_parking_name ON parking_lot(parking_name);
CREATE INDEX idx_empty_spots ON parking_lot(empty_spots);
CREATE INDEX idx_updated_at ON parking_lot(updated_at DESC);

-- View pentru statistici
CREATE OR REPLACE VIEW parking_statistics AS
SELECT 
    COUNT(*) as total_zones,
    SUM(empty_spots) as total_empty,
    SUM(occupied_spots) as total_occupied,
    SUM(empty_spots + occupied_spots) as total_spots,
    ROUND(AVG(empty_spots::decimal / NULLIF((empty_spots + occupied_spots), 0) * 100), 2) as avg_availability_percentage,
    MAX(updated_at) as last_update
FROM parking_lot;

-- Funcție pentru simulare actualizare aleatorie (pentru testare)
CREATE OR REPLACE FUNCTION simulate_parking_changes()
RETURNS void AS $$
DECLARE
    parking_record RECORD;
    total_spots INTEGER;
    new_occupied INTEGER;
BEGIN
    FOR parking_record IN SELECT * FROM parking_lot LOOP
        total_spots := parking_record.empty_spots + parking_record.occupied_spots;
        
        -- Generează un număr aleatoriu de locuri ocupate (±10 față de valoarea curentă)
        new_occupied := parking_record.occupied_spots + FLOOR(RANDOM() * 21) - 10;
        
        -- Asigură-te că valorile sunt în limite
        IF new_occupied < 0 THEN
            new_occupied := 0;
        ELSIF new_occupied > total_spots THEN
            new_occupied := total_spots;
        END IF;
        
        -- Actualizează parcarea
        UPDATE parking_lot 
        SET 
            occupied_spots = new_occupied,
            empty_spots = total_spots - new_occupied
        WHERE id = parking_record.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Afișează datele inițiale
SELECT * FROM parking_lot ORDER BY parking_number;

-- Afișează statisticile
SELECT * FROM parking_statistics;

-- Comentarii utile:
-- Pentru a simula schimbări în parcări (rulează periodic pentru teste):
-- SELECT simulate_parking_changes();

-- Pentru a vedea toate parcările cu disponibilitate:
-- SELECT parking_name, empty_spots, occupied_spots, 
--        ROUND((empty_spots::decimal / NULLIF(empty_spots + occupied_spots, 0) * 100), 2) as availability_percentage
-- FROM parking_lot 
-- ORDER BY availability_percentage DESC;