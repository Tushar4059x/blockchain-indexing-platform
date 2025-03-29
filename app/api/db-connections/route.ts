import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const dbConnectionSchema = z.object({
  name: z.string().min(1),
  host: z.string().min(1),
  port: z.number().min(1),
  database: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = dbConnectionSchema.parse(body);

    const dbConnection = await prisma.dbConnection.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
    });

    return NextResponse.json(dbConnection);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating database connection:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbConnections = await prisma.dbConnection.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        indexingTasks: true,
      },
    });

    return NextResponse.json(dbConnections);
  } catch (error) {
    console.error('Error fetching database connections:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 