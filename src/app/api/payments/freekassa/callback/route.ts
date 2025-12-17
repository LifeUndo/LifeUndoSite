import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Delegate to canonical result handler to keep a single source of truth
export { POST } from '../result/route';
