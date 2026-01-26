# GamePulse 🎮📈

GamePulse es una web app de inteligencia de negocio diseñada exclusivamente para la monitorización de empresas del sector de videojuegos. Proporciona datos de mercado, noticias sectoriales y un sistema de alertas informativas.

## Requisitos Previos

- Node.js 18+ 
- NPM o PNPM
- Una API Key de [Finnhub](https://finnhub.io/) (Gratuita)

## Configuración del Entorno

1. Copia el archivo de ejemplo de variables de entorno:
   ```bash
   touch .env.local
   ```

2. Añade tu API Key de Finnhub:
   ```env
   FINNHUB_API_KEY=tu_api_key_aqui
   ```

## Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build
```

## Stack Tecnológico

- **Frontend**: Next.js 15+ (App Router), TypeScript, Tailwind CSS v4.
- **Gráficos**: Chart.js con react-chartjs-2.
- **Iconos**: Lucide React.
- **Backend/API**: Next.js API Routes (Proxy con caching de 60s para precios y 5-10m para noticias).
- **Persistencia**: LocalStorage (Alertas y ajustes de Admin).

## Estructura de Datos (Seed)

El proyecto incluye un dataset inicial (`src/data/companies.ts`) con 30 empresas globales incluyendo Nintendo, Sony, Tencent, EA, Take-Two, Ubisoft, y muchas más, categorizadas por:
- Publisher
- Platform
- Holding
- Indie-public
- Esports-related

## Disclaimer

**Información general. No asesoramiento financiero.** GamePulse es una herramienta de inteligencia de negocio y no debe utilizarse como base para decisiones de inversión.
