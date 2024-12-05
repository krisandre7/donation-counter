'use server'

import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Parse credentials from environment variable
    const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || '{}');

    // Create a new JWT client
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });
    const sheets = google.sheets({ version: 'v4', auth });

    // Replace with your spreadsheet ID and range
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const range = process.env.DONATION_COUNT_RANGE || 'Sheet1!A1';

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const value = response.data.values?.[0]?.[0] || '0';
    return NextResponse.json({ value });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}