# Werewolf Game Backend

Ein TypeScript Node.js Backend für ein Online-Werwolf-Spiel mit Express.js, PostgreSQL und Socket.IO.

## 🚀 Schnellstart

### Voraussetzungen

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (falls nicht über Docker verwendet)

### Installation

1. Repository klonen und in das Verzeichnis wechseln:
```bash
git clone <repository-url>
cd werewolf-game
```

2. Dependencies installieren:
```bash
npm install
```

3. Environment-Variablen konfigurieren:
```bash
cp .env.example .env
# Bearbeite .env mit deinen Werten
```

4. Mit Docker starten:
```bash
npm run docker:up
```

5. Oder lokal entwickeln:
```bash
npm run dev
```

## 📁 Projektstruktur

```
werewolf-game/
├── src/
│   ├── controllers/     # Route Handler
│   ├── models/         # Datenbank Models
│   ├── routes/         # API Routes
│   ├── middleware/     # Express Middleware
│   ├── services/       # Business Logic
│   ├── types/          # TypeScript Definitionen
│   ├── utils/          # Utility Funktionen
│   └── server.ts       # Haupt Server Datei
├── tests/              # Test Dateien
├── docs/               # Dokumentation
├── logs/               # Log Dateien
├── docker-compose.yml  # Docker Konfiguration
├── Dockerfile         # Docker Image
├── package.json       # Dependencies
└── tsconfig.json      # TypeScript Config
```

## 🛠 Verfügbare Scripts

- `npm run dev` - Entwicklungsserver mit Hot-Reload
- `npm run build` - TypeScript kompilieren
- `npm start` - Produktionsserver starten
- `npm run lint` - Code linting
- `npm run format` - Code formatierung
- `npm test` - Tests ausführen
- `npm run docker:up` - Docker Container starten
- `npm run docker:down` - Docker Container stoppen

## 🐳 Docker Setup

Das Projekt verwendet Docker Compose für die lokale Entwicklung:

- **app**: Node.js Backend (Port 3000)
- **db**: PostgreSQL Datenbank (Port 5432)
- **redis**: Redis Cache (Port 6379)

## 🌐 API Endpunkte

- `GET /` - API Information
- `GET /health` - Health Check

## 🎮 Spiellogik

Das Werwolf-Spiel unterstützt verschiedene Rollen:
- **Dorfbewohner**: Versuchen die Werwölfe zu finden
- **Werwölfe**: Eliminieren nachts die Dorfbewohner
- **Seher**: Kann nachts die Rolle eines Spielers erfahren
- **Arzt**: Kann nachts einen Spieler heilen
- **Weitere Rollen**: Jäger, Hexe, Bürgermeister

## 🔧 Konfiguration

Alle Konfigurationen werden über Environment-Variablen gesteuert. Siehe `.env.example` für alle verfügbaren Optionen.

## 📝 Logging

Das Projekt verwendet Winston für strukturiertes Logging:
- Console-Output in der Entwicklung
- Datei-Logging in der Produktion
- Separate Error-Logs

## 🧪 Testing

```bash
npm test          # Alle Tests
npm run test:watch  # Tests im Watch-Modus
```

## 🔒 Sicherheit

- Helmet.js für HTTP-Header-Sicherheit
- CORS-Konfiguration
- Rate Limiting
- Input-Validierung mit Joi
- JWT für Authentifizierung

## 📄 Lizenz

MIT License