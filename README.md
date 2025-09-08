# COVID Dashboard Base

Este repositorio contiene la estructura base de un dashboard en Next.js + TypeScript, listo para implementar consumo de API y visualizaciones.

## ¿Qué incluye?

- Estructura Next.js con TypeScript
- Página principal lista para agregar gráficos y lógica
- Estilos globales básicos
- Dependencias esenciales instaladas (`react`, `next`, `typescript`)

## ¿Qué falta?

- Lógica de consumo de API
- Visualizaciones y gráficos (Recharts, etc.)
- Endpoints API personalizados

## ¿Cómo usar este proyecto?

1. **Instala las dependencias:**
   ```bash
   pnpm install
   # o
   yarn install
   ```

2. **Levanta el servidor de desarrollo:**
   ```bash
   pnpm run dev
   # o
   yarn dev
   ```

3. **Abre tu navegador en** [http://localhost:3000](http://localhost:3000)

## Estructura de carpetas

```
covid-dashboard/
├── pages/
│   ├── _app.tsx
│   └── index.tsx
├── styles/
│   └── globals.css
├── package.json
├── tsconfig.json
└── README.md
```

## Siguiente paso sugerido

- Implementa la lógica de consumo de API en `pages/index.tsx`.
- Agrega visualizaciones usando Recharts u otra librería de gráficos.

---

Proyecto creado para entregrable de una prueba usando Next.js y TypeScript con consumo de API.
