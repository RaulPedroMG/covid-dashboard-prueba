import React from "react";
import Head from "next/head";
import Link from "next/link";

const Documentation: React.FC = () => {
  return (
    <div
      className="container"
      style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}
    >
      <Head>
        <title>Documentación - COVID-19 Dashboard</title>
        <meta
          name="description"
          content="Documentación del COVID-19 Dashboard"
        />
      </Head>

      <nav style={{ marginBottom: "20px" }}>
        <Link href="/" style={{ color: "#4285f4", textDecoration: "none" }}>
          ← Volver al Dashboard
        </Link>
      </nav>

      <h1>Documentación del COVID-19 Dashboard</h1>

      <section>
        <h2>Descripción General</h2>
        <p>
          Este mini-dashboard visualiza datos de la pandemia de COVID-19
          utilizando la API pública de disease.sh. Implementa transformaciones
          de datos, visualizaciones interactivas y filtros para explorar los
          datos.
        </p>
      </section>

      <section>
        <h2>Arquitectura</h2>
        <p>
          El proyecto está construido con React y Next.js, utilizando TypeScript
          para el tipado estático. La arquitectura se divide en dos partes
          principales:
        </p>
        <ul>
          <li>
            <strong>Frontend</strong>: Interfaz de usuario construida con React
            y Recharts para las visualizaciones.
          </li>
          <li>
            <strong>Backend</strong>: API routes de Next.js que actúan como
            proxy para la API externa, permitiendo el registro de trazas y el
            envío de eventos a webhooks.
          </li>
        </ul>
      </section>

      <section>
        <h2>Transformaciones de Datos</h2>
        <p>El dashboard implementa las siguientes transformaciones de datos:</p>

        <h3>1. Agregación Temporal</h3>
        <p>
          Los datos históricos se agregan para mostrar las tendencias a lo largo
          del tiempo. Esto permite visualizar patrones en los casos, muertes y
          recuperaciones.
          <br />
          <code>Implementado en: transformHistoricalData()</code>
        </p>

        <h3>2. Cálculo de Tasas</h3>
        <p>
          Se calculan dos tasas importantes para entender la situación de la
          pandemia:
        </p>
        <ul>
          <li>
            <strong>Tasa de Actividad</strong>: Porcentaje de casos que siguen
            activos (no recuperados ni fallecidos).
            <br />
            <code>activeRatio = (active / cases) * 100</code>
          </li>
          <li>
            <strong>Tasa de Letalidad</strong>: Porcentaje de casos que
            resultaron en fallecimiento.
            <br />
            <code>fatalityRate = (deaths / cases) * 100</code>
          </li>
        </ul>

        <h3>3. Media Móvil de 7 días</h3>
        <p>
          Cálculo de una media móvil de 7 días para suavizar las variaciones
          diarias en los datos y mostrar tendencias más claras.
          <br />
          <code>weeklyAverage = sum(cases[i-6]...cases[i]) / 7</code>
        </p>

        <h3>4. Top-N por Métrica</h3>
        <p>
          Selección de los países con mayor número de casos (Top 5) para su
          visualización comparativa.
          <br />
          <code>
            {
              "topCountriesData = countriesResponse.data.sort((a, b) => b.cases - a.cases).slice(0, 5)"
            }
          </code>
        </p>
      </section>

      <section>
        <h2>Visualizaciones</h2>
        <p>El dashboard incluye las siguientes visualizaciones:</p>
        <ol>
          <li>
            <strong>Gráfico de Líneas para Casos y Promedio Semanal</strong>:
            Muestra la evolución de los casos diarios junto con la media móvil
            de 7 días.
          </li>
          <li>
            <strong>Gráfico de Barras de Fallecidos y Recuperados</strong>:
            Compara las cifras de fallecidos y recuperados a lo largo del
            tiempo.
          </li>
          <li>
            <strong>Gráfico de Líneas para Tasas</strong>: Visualiza las tasas
            de actividad y letalidad calculadas.
          </li>
          <li>
            <strong>Gráfico de Barras para Top 5 Países</strong>: Muestra los 5
            países con mayor número de casos totales.
          </li>
        </ol>
      </section>

      <section>
        <h2>Filtros</h2>
        <p>Los datos pueden filtrarse mediante:</p>
        <ul>
          <li>
            <strong>Filtro de País</strong>: Permite seleccionar un país
            específico o todos los países.
          </li>
          <li>
            <strong>Rango de Fechas</strong>: Permite acotar los datos a un
            período específico mediante selección de fecha inicial y fecha
            final.
          </li>
        </ul>
      </section>

      <section>
        <h2>Implementación de API</h2>
        <p>El backend implementa dos endpoints principales:</p>
        <ul>
          <li>
            <strong>/api/historical</strong>: Obtiene datos históricos de
            COVID-19 para un país específico o todos los países, con parámetros
            para filtrar por número de días.
          </li>
          <li>
            <strong>/api/countries</strong>: Obtiene datos actuales de todos los
            países para comparativas.
          </li>
        </ul>
        <p>
          Todos los endpoints incluyen registro de trazas y envío de eventos a
          webhooks para monitoreo y depuración.
        </p>
      </section>

      <section>
        <h2>Trazas y Webhooks</h2>
        <p>Cada solicitud a la API se registra con información como:</p>
        <ul>
          <li>Timestamp</li>
          <li>Parámetros de consulta</li>
          <li>Estado de la respuesta</li>
        </ul>
        <p>
          Además, se envían eventos a un webhook configurable para rastrear:
        </p>
        <ul>
          <li>Solicitudes exitosas de datos</li>
          <li>Errores en las solicitudes</li>
        </ul>
        <p>
          Esto permite un monitoreo efectivo del uso del dashboard y la
          detección temprana de problemas.
        </p>
      </section>

      <footer
        style={{
          marginTop: "30px",
          textAlign: "center",
          color: "#666",
          fontSize: "0.8rem",
        }}
      >
        <p>
          COVID-19 Dashboard - Reto Técnico Admira - {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default Documentation;
