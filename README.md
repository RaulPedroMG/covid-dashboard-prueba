# COVID-19 Dashboard

Este proyecto es un mini-dashboard para visualización de datos de COVID-19, desarrollado como reto técnico. Utiliza React con TypeScript y Next.js para crear una aplicación web que consume datos de la API pública [disease.sh](https://disease.sh/).

## Características principales

- 📊 **Visualizaciones interactivas**: Gráficos de líneas, barras y comparativas.
- 🔄 **Transformaciones de datos**: Agregación temporal, cálculo de tasas, media móvil y Top-N.
- 🔍 **Filtros**: Por país y rango de fechas.
- 📱 **Responsive**: Diseño adaptable a diferentes tamaños de pantalla.
- 🔄 **Backend ligero**: API routes de Next.js que actúan como proxy.
- 📝 **Trazas y webhooks**: Registro de actividad y monitorización.

## Transformaciones de datos implementadas

1. **Agregación temporal**: Datos históricos agregados para visualizar tendencias.
2. **Cálculo de tasas**:
   - Tasa de actividad: `(casos_activos / casos_totales) * 100`
   - Tasa de letalidad: `(muertes / casos_totales) * 100`
3. **Media móvil de 7 días**: Para suavizar variaciones diarias.
4. **Top-N países**: Clasificación de países con más casos.

## Visualizaciones

- Gráfico de líneas para casos diarios y promedio semanal.
- Gráfico de barras para comparar fallecidos y recuperados.
- Gráfico de líneas para tasas de actividad y letalidad.
- Gráfico de barras para Top 5 países por casos totales.

## Requisitos previos

- Node.js (versión 14 o superior)
- pnpm, npm o yarn

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/covid-dashboard.git
   cd covid-dashboard
   ```

2. Instalar dependencias (se recomienda pnpm):
   ```bash
   pnpm install
   # o
   npm install
   # o
   yarn install
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   pnpm run dev
   # o
   npm run dev
   # o
   yarn dev
   ```

4. Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Arquitectura

- **Frontend**: React con TypeScript y Recharts para visualizaciones.
- **Backend**: API routes de Next.js que actúan como proxy para la API externa.
- **API**: Se utilizan dos endpoints principales:
  - `/api/historical`: Datos históricos de COVID-19.
  - `/api/countries`: Datos actuales de todos los países.

## Evidencia de ejecución

El proyecto incluye:
- Registro de trazas en la consola del servidor.
- Envío de eventos a webhooks configurables para monitoreo.
- Manejo de estados de carga y errores en la interfaz de usuario.

## Tecnologías utilizadas

- **React**: Biblioteca para construir interfaces de usuario.
- **Next.js**: Framework para aplicaciones React con SSR.
- **TypeScript**: Superset tipado de JavaScript.
- **Recharts**: Biblioteca de gráficos para React.
- **Axios**: Cliente HTTP para realizar peticiones a la API.

## Divulgación sobre el Uso de IA

Para la creación de este proyecto se utilizó un asistente de inteligencia artificial (IA). La asistencia de la IA fue empleada en las siguientes áreas:

- **Construcción inicial del proyecto:** Andamiaje y configuración inicial de la aplicación Next.js.
- **Desarrollo del backend:** En la implementación de llamadas a algunas apis y la refactorización de las mismas.
- **Documentación:** Generación y modificación de este archivo README y los comentarios dentro del código.

## Autor

Desarrollado como reto técnico para Admira.

## Licencia

MIT
