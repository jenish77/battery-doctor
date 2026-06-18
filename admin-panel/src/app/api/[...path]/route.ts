/**
 * API Proxy Route
 *
 * Proxies all /api/* requests to the backend (configured via NEXT_PUBLIC_API_BASE_URL).
 * This avoids CORS issues and ensures required headers are sent.
 *
 * Only forwards essential headers — strips browser-specific headers
 * (origin, referer, sec-fetch-*) that may cause backend to reject requests.
 */

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

// Headers that should NOT be forwarded to the backend
const SKIP_HEADERS = new Set([
  "host",
  "connection",
  "content-length",
  "origin",
  "referer",
  "sec-fetch-dest",
  "sec-fetch-mode",
  "sec-fetch-site",
  "sec-ch-ua",
  "sec-ch-ua-mobile",
  "sec-ch-ua-platform",
  "user-agent",
  "accept-encoding",
  "accept-language",
  "cookie",
  "x-forwarded-for",
  "x-forwarded-host",
  "x-forwarded-port",
  "x-forwarded-proto",
]);

async function proxyRequest(request: NextRequest) {
  // Build the backend URL from the path
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api/, ""); // Remove /api prefix
  const backendUrl = `${BACKEND_URL}${path}${url.search}`;

  // Build clean headers - only forward what's needed
  const headers = new Headers();

  // Always set required headers
  headers.set("env", process.env.NEXT_PUBLIC_ENV || "test");
  headers.set("x-device", process.env.NEXT_PUBLIC_DEVICE || "web");
  headers.set("Content-Type", "application/json");

  // Forward Authorization header if present
  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    headers.set("Authorization", authHeader);
  }

  // Forward any custom env/x-device if client sends them
  const clientEnv = request.headers.get("env");
  if (clientEnv) {
    headers.set("env", clientEnv);
  }
  const clientDevice = request.headers.get("x-device");
  if (clientDevice) {
    headers.set("x-device", clientDevice);
  }

  // Build fetch options
  const fetchOptions: RequestInit = {
    method: request.method,
    headers,
  };

  // Forward body for POST/PUT/PATCH requests
  if (["POST", "PUT", "PATCH"].includes(request.method)) {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      // For file uploads, forward raw body and set correct content-type
      headers.set("Content-Type", contentType);
      fetchOptions.body = await request.arrayBuffer();
    } else {
      // For JSON, forward as text
      fetchOptions.body = await request.text();
    }
  }

  try {
    const response = await fetch(backendUrl, fetchOptions);

    // Get response body
    const responseBody = await response.arrayBuffer();

    // Build response headers
    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", response.headers.get("content-type") || "application/json");

    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { message: "Failed to connect to backend API" },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest) {
  return proxyRequest(request);
}

export async function POST(request: NextRequest) {
  return proxyRequest(request);
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request);
}

export async function PATCH(request: NextRequest) {
  return proxyRequest(request);
}

export async function DELETE(request: NextRequest) {
  return proxyRequest(request);
}
