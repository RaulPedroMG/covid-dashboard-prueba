// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { logTrace } from "../../lib/logger";

// Define the shape of the transformed data
interface TransformedData {
  date: string;
  cases: number;
  deaths: number;
  recovered: number;
  activeRatio?: number;
  fatalityRate?: number;
  weeklyAverage?: number;
}

// Define the shape of the raw timeline data from the API
interface Timeline {
  cases: { [key: string]: number };
  deaths: { [key: string]: number };
  recovered: { [key: string]: number };
}

/**
 * Transforms raw historical data into a structured format with calculated metrics.
 * @param timeline - The raw timeline data from the disease.sh API.
 * @returns An array of transformed data points.
 */
const transformHistoricalData = (timeline: Timeline): TransformedData[] => {
  const data: TransformedData[] = [];
  const dates = Object.keys(timeline.cases);

  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    const cases = timeline.cases[date] || 0;
    const deaths = timeline.deaths[date] || 0;
    const recovered = timeline.recovered[date] || 0;
    const active = cases - deaths - recovered;

    // Transformation 1: Calculate rate of active cases
    const activeRatio = cases > 0 ? (active / cases) * 100 : 0;
    // Transformation 2: Calculate fatality rate
    const fatalityRate = cases > 0 ? (deaths / cases) * 100 : 0;

    // Transformation 3: Calculate 7-day rolling average of new cases
    let weeklyAverage = 0;
    if (i >= 6) {
      let sum = 0;
      for (let j = i - 6; j <= i; j++) {
        // Calculate daily new cases for the average
        const dailyCases =
          (timeline.cases[dates[j]] || 0) -
          (timeline.cases[dates[j - 1]] || timeline.cases[dates[j]] || 0);
        sum += dailyCases;
      }
      weeklyAverage = sum / 7;
    }

    data.push({
      date,
      cases,
      deaths,
      recovered,
      activeRatio,
      fatalityRate,
      weeklyAverage: weeklyAverage > 0 ? weeklyAverage : undefined,
    });
  }

  return data;
};

/**
 * API route for fetching and transforming historical COVID-19 data.
 * @param req - The request object.
 * @param res - The response object.
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const start = Date.now();
  const country = req.query.country as string;
  const lastdays = req.query.lastdays || 30;

  let url = "https://disease.sh/v3/covid-19/historical";
  url += country && country !== "all" ? `/${country}` : "/all";
  url += `?lastdays=${lastdays}`;

  console.log("[API] Historical data request received:", {
    country: country,
    lastdays: lastdays,
    timestamp: new Date().toISOString(),
  });

  try {
    const response = await axios.get(url);
    const rawData = response.data;

    // Log to file
    logTrace({
      ts: new Date().toISOString(),
      method: "GET",
      url: url,
      status: response.status,
      duration_ms: Date.now() - start,
    });

    // Extract the timeline object, which varies depending on the query
    const timeline = country && country !== "all" ? rawData.timeline : rawData;

    // Perform the data transformations on the backend
    const transformedData = transformHistoricalData(timeline);

    console.log("[API] Historical data successfully fetched and transformed", {
      url,
      status: response.status,
      timestamp: new Date().toISOString(),
    });

    // Send webhook notification
    try {
      await axios.post(
        "https://webhook.site/1fc869b4-8483-47ea-a3bc-681bdfd4079b",
        {
          event: "historical_data_transformed",
          country: country || "all",
          timestamp: new Date().toISOString(),
          status: "success",
        },
      );
    } catch (webhookError) {
      console.error("[API] Webhook notification failed:", webhookError);
    }

    // Return the *transformed* data
    return res.status(200).json(transformedData);
  } catch (error) {
    const errorMessage = (error as any).message || "Unknown error";
    // Log to file
    logTrace({
      ts: new Date().toISOString(),
      method: "GET",
      url: url,
      error: errorMessage,
      duration_ms: Date.now() - start,
    });

    console.error("[API] Error fetching historical data:", error);

    // Send webhook notification about the error
    try {
      await axios.post(
        "https://webhook.site/1fc869b4-8483-47ea-a3bc-681bdfd4079b",
        {
          event: "historical_data_error",
          query: req.query,
          timestamp: new Date().toISOString(),
          error: errorMessage,
        },
      );
    } catch (webhookError) {
      console.error("[API] Webhook error notification failed:", webhookError);
    }

    return res.status(500).json({
      error: "Failed to fetch historical data",
    });
  }
}
