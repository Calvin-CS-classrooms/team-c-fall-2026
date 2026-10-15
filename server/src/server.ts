import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { mockLocations, mockRatings } from './data.js';

function sendJson(response: ServerResponse, statusCode: number, body: unknown): void {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
}

function handleRequest(request: IncomingMessage, response: ServerResponse): void {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    sendJson(response, 405, { error: 'Method not allowed' });
    return;
  }

  const segments = new URL(request.url ?? '/', 'http://localhost').pathname.split('/').filter(Boolean);
  if (segments[0] !== 'api' || segments[1] !== 'locations') {
    sendJson(response, 404, { error: 'Not found' });
    return;
  }

  if (segments.length === 2) {
    sendJson(response, 200, mockLocations);
    return;
  }

  const isRatingsRoute = segments.length === 4 && segments[3] === 'ratings';
  if (segments.length !== 3 && !isRatingsRoute) {
    sendJson(response, 404, { error: 'Not found' });
    return;
  }

  let locationId: string;
  try {
    locationId = decodeURIComponent(segments[2]);
  } catch {
    sendJson(response, 400, { error: 'Malformed location ID' });
    return;
  }

  const location = mockLocations.find((item) => item.id === locationId);
  if (!location) {
    sendJson(response, 404, { error: 'Location not found' });
    return;
  }

  if (isRatingsRoute) {
    sendJson(response, 200, mockRatings.filter((rating) => rating.locationId === locationId));
    return;
  }

  sendJson(response, 200, location);
}

export function createApiServer(): Server {
  return createServer(handleRequest);
}