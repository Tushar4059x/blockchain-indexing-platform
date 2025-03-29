'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DbConnection {
  id: string;
  name: string;
  host: string;
  port: number;
  database: string;
  username: string;
}

interface IndexingTask {
  id: string;
  name: string;
  type: string;
  status: string;
  dbConnection: DbConnection;
  lastSyncedAt: string | null;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dbConnections, setDbConnections] = useState<DbConnection[]>([]);
  const [indexingTasks, setIndexingTasks] = useState<IndexingTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

  const fetchData = async () => {
    try {
      const [dbConnectionsRes, indexingTasksRes] = await Promise.all([
        fetch('/api/db-connections'),
        fetch('/api/indexing-tasks'),
      ]);

      if (!dbConnectionsRes.ok || !indexingTasksRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [dbConnectionsData, indexingTasksData] = await Promise.all([
        dbConnectionsRes.json(),
        indexingTasksRes.json(),
      ]);

      setDbConnections(dbConnectionsData);
      setIndexingTasks(indexingTasksData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="space-x-4">
              <Link
                href="/dashboard/db-connections/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Add Database Connection
              </Link>
              <Link
                href="/dashboard/indexing-tasks/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Create Indexing Task
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Database Connections */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Database Connections</h3>
                <div className="mt-4">
                  {dbConnections.length === 0 ? (
                    <p className="text-sm text-gray-500">No database connections found</p>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {dbConnections.map((connection) => (
                        <li key={connection.id} className="py-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{connection.name}</p>
                              <p className="text-sm text-gray-500">
                                {connection.host}:{connection.port}/{connection.database}
                              </p>
                            </div>
                            <Link
                              href={`/dashboard/db-connections/${connection.id}`}
                              className="text-sm text-primary-600 hover:text-primary-500"
                            >
                              View
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Indexing Tasks */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Indexing Tasks</h3>
                <div className="mt-4">
                  {indexingTasks.length === 0 ? (
                    <p className="text-sm text-gray-500">No indexing tasks found</p>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {indexingTasks.map((task) => (
                        <li key={task.id} className="py-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{task.name}</p>
                              <p className="text-sm text-gray-500">
                                {task.type} • {task.status}
                              </p>
                              {task.lastSyncedAt && (
                                <p className="text-xs text-gray-400">
                                  Last synced: {new Date(task.lastSyncedAt).toLocaleString()}
                                </p>
                              )}
                            </div>
                            <Link
                              href={`/dashboard/indexing-tasks/${task.id}`}
                              className="text-sm text-primary-600 hover:text-primary-500"
                            >
                              View
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 