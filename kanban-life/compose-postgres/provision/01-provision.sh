#!/bin/bash
set -e
# Provision the EMPTY DB 
# Additional scripts for a specific DB can be added to the provision directory (Docker will run them in Alphabetical order)
#
# Setup monitoring ROLE
#
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE ROLE pgwatch2 WITH LOGIN PASSWORD 'secret';
  -- NB! For very important databases it might make sense to ensure that the user
  -- account used for monitoring can only open a limited number of connections 
  -- (there are according checks in code also though)
  ALTER ROLE pgwatch2 CONNECTION LIMIT 3;
  GRANT pg_monitor TO pgwatch2;  
  --
  --
  -- Create Extensions
  CREATE EXTENSION pg_stat_statements;
EOSQL