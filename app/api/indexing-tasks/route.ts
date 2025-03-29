import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { createWebhook } from '@/lib/helius';

const indexingTaskSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['NFT_BIDS', 'NFT_PRICES', 'TOKEN_BORROW', 'TOKEN_PRICES']),
  dbConnectionId: z.string().min(1),
  config: z.object({
    accountAddresses: z.array(z.string()),
    // Add other configuration options based on the indexing type
  }),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = indexingTaskSchema.parse(body);

    // Verify that the database connection belongs to the user
    const dbConnection = await prisma.dbConnection.findUnique({
      where: {
        id: validatedData.dbConnectionId,
        userId: session.user.id,
      },
    });

    if (!dbConnection) {
      return NextResponse.json({ error: 'Database connection not found' }, { status: 404 });
    }

    // Create Helius webhook
    const webhookUrl = `${process.env.NEXTAUTH_URL}/api/webhooks/helius`;
    const webhook = await createWebhook(webhookUrl, validatedData.config.accountAddresses);

    // Create indexing task
    const indexingTask = await prisma.indexingTask.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        status: 'RUNNING',
        config: {
          ...validatedData.config,
          webhookId: webhook.id,
        },
      },
    });

    return NextResponse.json(indexingTask);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating indexing task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const indexingTasks = await prisma.indexingTask.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        dbConnection: true,
      },
    });

    return NextResponse.json(indexingTasks);
  } catch (error) {
    console.error('Error fetching indexing tasks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    // Verify that the task belongs to the user
    const existingTask = await prisma.indexingTask.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const indexingTask = await prisma.indexingTask.update({
      where: {
        id,
      },
      data: updateData,
    });

    return NextResponse.json(indexingTask);
  } catch (error) {
    console.error('Error updating indexing task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    // Verify that the task belongs to the user
    const existingTask = await prisma.indexingTask.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Delete the Helius webhook if it exists
    if (existingTask.config?.webhookId) {
      await deleteWebhook(existingTask.config.webhookId);
    }

    await prisma.indexingTask.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting indexing task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 