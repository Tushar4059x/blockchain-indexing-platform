import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';

const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
const HELIUS_WEBHOOK_SECRET = process.env.HELIUS_WEBHOOK_SECRET;
const HELIUS_API_URL = 'https://api.helius.xyz/v0';

if (!HELIUS_API_KEY) {
  throw new Error('HELIUS_API_KEY is not set');
}

if (!HELIUS_WEBHOOK_SECRET) {
  throw new Error('HELIUS_WEBHOOK_SECRET is not set');
}

const heliusClient: AxiosInstance = axios.create({
  baseURL: HELIUS_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${HELIUS_API_KEY}`,
  },
});

interface WebhookBody {
  url: string;
  accountAddresses: string[];
  transactionTypes: string[];
}

interface WebhookResponse {
  id: string;
  url: string;
  accountAddresses: string[];
  transactionTypes: string[];
}

export async function verifyHeliusWebhook(signature: string, body: unknown): Promise<boolean> {
  const hmac = crypto.createHmac('sha256', HELIUS_WEBHOOK_SECRET as crypto.BinaryLike);
  const calculatedSignature = hmac
    .update(JSON.stringify(body))
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(calculatedSignature)
  );
}

export async function createWebhook(url: string, accountAddresses: string[]): Promise<WebhookResponse> {
  try {
    const webhookBody: WebhookBody = {
      url,
      accountAddresses,
      transactionTypes: ['NFT_BID', 'NFT_PRICE', 'TOKEN_BORROW', 'TOKEN_PRICE'],
    };
    const response = await heliusClient.post<WebhookResponse>('/webhooks', webhookBody);
    return response.data;
  } catch (error) {
    console.error('Error creating webhook:', error);
    throw error;
  }
}

export async function deleteWebhook(webhookId: string): Promise<void> {
  try {
    await heliusClient.delete(`/webhooks/${webhookId}`);
  } catch (error) {
    console.error('Error deleting webhook:', error);
    throw error;
  }
}

export async function getNFTBids(mintAddress: string): Promise<unknown> {
  try {
    const response = await heliusClient.get(`/nft-bids/${mintAddress}`);
    return response.data;
  } catch (error) {
    console.error('Error getting NFT bids:', error);
    throw error;
  }
}

export async function getNFTPrice(mintAddress: string): Promise<unknown> {
  try {
    const response = await heliusClient.get(`/nft-price/${mintAddress}`);
    return response.data;
  } catch (error) {
    console.error('Error getting NFT price:', error);
    throw error;
  }
}

export async function getTokenBorrowInfo(tokenAddress: string): Promise<unknown> {
  try {
    const response = await heliusClient.get(`/token-borrow/${tokenAddress}`);
    return response.data;
  } catch (error) {
    console.error('Error getting token borrow info:', error);
    throw error;
  }
}

export async function getTokenPrice(tokenAddress: string): Promise<unknown> {
  try {
    const response = await heliusClient.get(`/token-price/${tokenAddress}`);
    return response.data;
  } catch (error) {
    console.error('Error getting token price:', error);
    throw error;
  }
} 