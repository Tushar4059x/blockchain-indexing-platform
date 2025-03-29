import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyHeliusWebhook } from '@/lib/helius';

export async function POST(req: Request) {
  try {
    const signature = req.headers.get('x-helius-signature');
    if (!signature) {
      return NextResponse.json({ error: 'No signature provided' }, { status: 401 });
    }

    const body = await req.json();
    const isValid = await verifyHeliusWebhook(signature, body);
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Process different types of events
    const { type, data } = body;

    switch (type) {
      case 'NFT_BID':
        await processNftBid(data);
        break;
      case 'NFT_PRICE':
        await processNftPrice(data);
        break;
      case 'TOKEN_BORROW':
        await processTokenBorrow(data);
        break;
      case 'TOKEN_PRICE':
        await processTokenPrice(data);
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function processNftBid(data: any) {
  // Find all indexing tasks for NFT bids
  const tasks = await prisma.indexingTask.findMany({
    where: {
      type: 'NFT_BIDS',
      status: 'RUNNING',
    },
    include: {
      dbConnection: true,
    },
  });

  // Process each task and update the corresponding database
  for (const task of tasks) {
    // TODO: Implement database-specific logic to store NFT bid data
    // This will depend on the user's database schema
  }
}

async function processNftPrice(data: any) {
  const tasks = await prisma.indexingTask.findMany({
    where: {
      type: 'NFT_PRICES',
      status: 'RUNNING',
    },
    include: {
      dbConnection: true,
    },
  });

  for (const task of tasks) {
    // TODO: Implement database-specific logic to store NFT price data
  }
}

async function processTokenBorrow(data: any) {
  const tasks = await prisma.indexingTask.findMany({
    where: {
      type: 'TOKEN_BORROW',
      status: 'RUNNING',
    },
    include: {
      dbConnection: true,
    },
  });

  for (const task of tasks) {
    // TODO: Implement database-specific logic to store token borrow data
  }
}

async function processTokenPrice(data: any) {
  const tasks = await prisma.indexingTask.findMany({
    where: {
      type: 'TOKEN_PRICES',
      status: 'RUNNING',
    },
    include: {
      dbConnection: true,
    },
  });

  for (const task of tasks) {
    // TODO: Implement database-specific logic to store token price data
  }
} 