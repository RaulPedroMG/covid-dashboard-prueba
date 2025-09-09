// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { logTrace } from "../../lib/logger";

type ResponseData = {
  data?: any;
  error?: string;
};

interface CountryData {
  country: string;
  cases: number;
}

/**
 * API route for fetching top 5 countries by cases
 * @param req - The request object
 * @param res - The response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const start = Date.now();
  const url = "https://disease.sh/v3/covid-19/countries";

  // Log the request for tracing purposes
  console.log("[API] Top Countries data request received:", {
    timestamp: new Date().toISOString(),
  });

  try {
    // Make the API request to disease.sh
    const response = await axios.get(url);

    // Log to file
    logTrace({
      ts: new Date().toISOString(),
      method: "GET",
      url: url,
      status: response.status,
      duration_ms: Date.now() - start,
    });

    // Transformation: Sort by cases and take the top 5
    const top5Countries = response.data
      .sort((a: CountryData, b: CountryData) => b.cases - a.cases)
      .slice(0, 5);

    // Log successful response for tracing
    console.log(
      "[API] Top Countries data successfully fetched and transformed",
      {
        status: response.status,
        timestamp: new Date().toISOString(),
        countriesCount: top5Countries.length,
      },
    );

    // Send webhook notification about the API call
    try {
      await axios.post(
        "https://webhook.site/1fc869b4-8483-47ea-a3bc-681bdfd4079b",
        {
          event: "top_countries_data_fetched",
          timestamp: new Date().toISOString(),
          status: "success",
          countriesCount: top5Countries.length,
        },
      );
    } catch (webhookError) {
      console.error("[API] Webhook notification failed:", webhookError);
    }

    // Return the transformed data
    return res.status(200).json(top5Countries);
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

    console.error("[API] Error fetching top countries data:", error);

    // Send webhook notification about the error
    try {
      await axios.post(
        "https://webhook.site/1fc869b4-8483-47ea-a3bc-681bdfd4079b",
        {
          event: "top_countries_data_error",
          timestamp: new Date().toISOString(),
          error: errorMessage,
        },
      );
    } catch (webhookError) {
      console.error("[API] Webhook error notification failed:", webhookError);
    }

    return res.status(500).json({
      error: "Failed to fetch top countries data",
    });
  }
}
