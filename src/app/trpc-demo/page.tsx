'use client';

import { trpc } from '@/utils/trpc'; // Adjust the path if your trpc utility is elsewhere
import React from 'react';

export default function TrpcDemoPage() {
  // Corrected path: trpc.ping.ping.useQuery()
  const { data, error, isLoading, isError } = trpc.ping.ping.useQuery();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>tRPC Demo Page</h1>
      <p>
        This page attempts to call a <code>protectedProcedure</code> (<code>trpc.ping.ping.useQuery()</code>).
        <br />
      </p>
      
      <h2>Query Result:</h2>
      {isLoading && <p>Loading...</p>}
      {isError && (
        <div>
          <p style={{ color: 'red' }}>Error fetching data:</p>
          <pre style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '4px' }}>
            {error?.message}
            {/* tRPC errors often have more details in error.data */}
            {error?.data && <details><summary>Error Data</summary><pre>{JSON.stringify(error.data, null, 2)}</pre></details>}
          </pre>
        </div>
      )}
      {data && (
        <div>
          <p>Data received:</p>
          <pre style={{ background: '', padding: '1rem', borderRadius: '4px' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 