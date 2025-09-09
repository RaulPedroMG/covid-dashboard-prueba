import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import Link from "next/link";

// Data types
interface CountryData {
  country: string;
  countryInfo: {
    _id: number;
    iso2: string;
    iso3: string;
    lat: number;
    long: number;
    flag: string;
  };
  cases: number;
  deaths: number;
  recovered: number;
  active: number;
}

interface TransformedData {
  date: string;
  cases: number;
  deaths: number;
  recovered: number;
  activeRatio?: number;
  fatalityRate?: number;
  weeklyAverage?: number;
}

const Dashboard: React.FC = () => {
  // States to store data
  const [historicalData, setHistoricalData] = useState<TransformedData[]>([]);
  const [countriesData, setCountriesData] = useState<CountryData[]>([]);
  const [topCountries, setTopCountries] = useState<CountryData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch pre-transformed data from our backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch historical data (already transformed by the backend)
        const historicalPromise = axios.get("/api/historical", {
          params: {
            country: selectedCountry,
            lastdays: 30, // The backend handles the `lastdays` logic
          },
        });

        // Fetch all countries for the filter dropdown
        const countriesPromise = axios.get("/api/countries");

        // Fetch top 5 countries (already transformed by the backend)
        const topCountriesPromise = axios.get("/api/top-countries");

        const [historicalResponse, countriesResponse, topCountriesResponse] =
          await Promise.all([
            historicalPromise,
            countriesPromise,
            topCountriesPromise,
          ]);

        // Filter by date range on the frontend (this is a UI interaction)
        const filteredData = filterByDateRange(
          historicalResponse.data,
          dateRange.start,
          dateRange.end,
        );

        setHistoricalData(filteredData);
        setCountriesData(countriesResponse.data);
        setTopCountries(topCountriesResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          "Error al cargar los datos. Por favor, inténtelo de nuevo más tarde.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCountry, dateRange]);

  // Date filtering is a UI operation, so it remains on the frontend
  const filterByDateRange = (
    data: TransformedData[],
    start: string,
    end: string,
  ): TransformedData[] => {
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      const startDate = new Date(start);
      const endDate = new Date(end);
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  // Event handlers
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange({ ...dateRange, start: e.target.value });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange({ ...dateRange, end: e.target.value });
  };

  return (
    <div
      className="container"
      style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}
    >
      <h1>COVID-19 Dashboard</h1>
      <div style={{ marginBottom: "20px" }}>
        <Link
          href="/documentation"
          style={{ color: "#4285f4", textDecoration: "none" }}
        >
          Ver documentación
        </Link>
      </div>

      {/* Filters */}
      <div
        className="filters"
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
        }}
      >
        <h3>Filtros</h3>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <div>
            <label htmlFor="country">País:</label>
            <select
              id="country"
              value={selectedCountry}
              onChange={handleCountryChange}
              style={{ margin: "0 10px", padding: "5px" }}
            >
              <option value="all">Todos</option>
              {countriesData.map((country) => (
                <option key={country.country} value={country.country}>
                  {country.country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="startDate">Fecha inicial:</label>
            <input
              type="date"
              id="startDate"
              value={dateRange.start}
              onChange={handleStartDateChange}
              style={{ margin: "0 10px", padding: "5px" }}
            />
          </div>

          <div>
            <label htmlFor="endDate">Fecha final:</label>
            <input
              type="date"
              id="endDate"
              value={dateRange.end}
              onChange={handleEndDateChange}
              style={{ margin: "0 10px", padding: "5px" }}
            />
          </div>
        </div>
      </div>

      {loading && (
        <div
          className="loading"
          style={{ textAlign: "center", padding: "50px" }}
        >
          <h2>Cargando datos...</h2>
        </div>
      )}

      {error && (
        <div
          className="error"
          style={{ textAlign: "center", padding: "50px", color: "red" }}
        >
          <h2>{error}</h2>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Charts */}
          <div
            className="dashboard-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(500px, 1fr))",
              gap: "20px",
            }}
          >
            {/* Line chart for daily cases and weekly averages */}
            <div
              className="chart"
              style={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "15px",
                backgroundColor: "white",
              }}
            >
              <h3>Tendencia de Casos y Promedio Semanal</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={historicalData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cases"
                    stroke="#8884d8"
                    name="Casos"
                  />
                  <Line
                    type="monotone"
                    dataKey="weeklyAverage"
                    stroke="#82ca9d"
                    name="Promedio semanal"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bar chart to compare deaths and recoveries */}
            <div
              className="chart"
              style={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "15px",
                backgroundColor: "white",
              }}
            >
              <h3>Comparativa de Fallecidos y Recuperados</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={historicalData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="deaths" fill="#FF8042" name="Fallecidos" />
                  <Bar dataKey="recovered" fill="#00C49F" name="Recuperados" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Line chart for rates */}
            <div
              className="chart"
              style={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "15px",
                backgroundColor: "white",
              }}
            >
              <h3>Tasas de Actividad y Fatalidad</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={historicalData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="activeRatio"
                    stroke="#0088FE"
                    name="% Casos Activos"
                  />
                  <Line
                    type="monotone"
                    dataKey="fatalityRate"
                    stroke="#FF8042"
                    name="Tasa de Letalidad (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bar chart for Top 5 countries */}
            <div
              className="chart"
              style={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "15px",
                backgroundColor: "white",
              }}
            >
              <h3>Top 5 Países por Casos</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={topCountries}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="country" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cases" fill="#8884D8" name="Casos Totales" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Data Table */}
          <div
            className="data-table"
            style={{ marginTop: "30px", overflowX: "auto" }}
          >
            <h3>Detalle de Datos</h3>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #ddd",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f2f2f2" }}>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "left",
                      border: "1px solid #ddd",
                    }}
                  >
                    Fecha
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "left",
                      border: "1px solid #ddd",
                    }}
                  >
                    Casos
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "left",
                      border: "1px solid #ddd",
                    }}
                  >
                    Fallecidos
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "left",
                      border: "1px solid #ddd",
                    }}
                  >
                    Recuperados
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "left",
                      border: "1px solid #ddd",
                    }}
                  >
                    Tasa de Actividad (%)
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "left",
                      border: "1px solid #ddd",
                    }}
                  >
                    Tasa de Letalidad (%)
                  </th>
                </tr>
              </thead>
              <tbody>
                {historicalData.map((item, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                    }}
                  >
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                      {item.date}
                    </td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                      {item.cases.toLocaleString()}
                    </td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                      {item.deaths.toLocaleString()}
                    </td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                      {item.recovered?.toLocaleString() || "N/A"}
                    </td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                      {item.activeRatio?.toFixed(2) || "N/A"}
                    </td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                      {item.fatalityRate?.toFixed(2) || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Footer with client-side date to avoid hydration error */}
      <Footer />
    </div>
  );
};

// Separate footer to handle client-side date
const Footer: React.FC = () => {
  const [now, setNow] = useState<string>("");

  useEffect(() => {
    setNow(new Date().toLocaleString());
  }, []);

  return (
    <footer
      style={{
        marginTop: "30px",
        textAlign: "center",
        color: "#666",
        fontSize: "0.8rem",
      }}
    >
      <p>
        Datos proporcionados por disease.sh API - Última actualización: {now}
      </p>
      <p>
        <Link
          href="/documentation"
          style={{ color: "#4285f4", textDecoration: "underline" }}
        >
          Documentación
        </Link>
        {" | "}
        <a
          href="https://github.com/disease-sh/API"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#4285f4", textDecoration: "underline" }}
        >
          Fuente de datos
        </a>
      </p>
    </footer>
  );
};

export default Dashboard;
