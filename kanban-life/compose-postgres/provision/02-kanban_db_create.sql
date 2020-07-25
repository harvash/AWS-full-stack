  --
  -- Create Schema in pgkanban DB
  --
    CREATE SCHEMA pgkanban AUTHORIZATION postgres;
--
-- Create TABLE for Kanban Database
--
CREATE TABLE pgkanban.kanban_list(
  id SERIAL PRIMARY KEY,
  kb_name VARCHAR NOT NULL
);
--
-- Insert a default row for Kanban Board table
--
INSERT INTO pgkanban.kanban_list(kb_name) VALUES ('Starting Kanban Board');
COMMIT;