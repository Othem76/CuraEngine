# entrypoint.sh
#!/bin/sh

# Chemin vers le fichier indicatif
SEED_FILE=/api/db-seeded

# Exécuter les migrations
npm run migrate

# Vérifier si les seeds ont déjà été exécutés
if [ ! -f "$SEED_FILE" ]; then
  echo "First run: executing seeds..."
  npm run initDB  # Injecter les seeds
  touch "$SEED_FILE"  # Créer un fichier indicatif
else
  echo "Seeds already executed; skipping."
fi

# Lancer l’application
npm run start