'use client';

export default function ErrorBoundary({error, reset}:{error: Error; reset: ()=>void}){
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="opacity-70 break-all">{error.message}</p>
      <button onClick={reset} className="mt-4 px-3 py-2 rounded bg-blue-600 text-white">Try again</button>
    </main>
  );
}