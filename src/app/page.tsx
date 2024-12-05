'use client'

import SlotCounter from 'react-slot-counter';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// Custom hook to fetch and update the sheet value with initial loading state
function useGoogleSheetValue() {
  const [count, setCount] = useState('0,00');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSheetValue = async (isInitial = false) => {
      if (isInitial) {
        setIsInitialLoading(true);
        setError(null);
      }

      try {
        const response = await fetch('/api');
        const data = await response.json();

        if (response.ok) {
          const formattedValue = new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(data.value);
          setCount(formattedValue);
        } else {
          throw new Error(data.error || 'Failed to fetch sheet value');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching sheet value:', err);
      } finally {
        if (isInitial) {
          setIsInitialLoading(false);
        }
      }
    };

    // Initial fetch with loading state
    fetchSheetValue(true);

    // Subsequent periodic refreshes without loading state
    const interval = process.env.NEXT_PUBLIC_REFRESH_INTERVAL ? parseInt(process.env.NEXT_PUBLIC_REFRESH_INTERVAL) : 30000;
    const intervalId = setInterval(() => fetchSheetValue(), interval);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return { count, isInitialLoading, error };
}

export default function Home() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }).format(value);
  };

  const { count, isInitialLoading, error } = useGoogleSheetValue();

  const donationGoal = process.env.NEXT_PUBLIC_DONATION_GOAL ? parseFloat(process.env.NEXT_PUBLIC_DONATION_GOAL) : 0;

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center w-full my-4">
      <Loader2 className="animate-spin text-white-500" />
    </div>
  );

  // Error display component
  const ErrorDisplay = () => (
    <div className="text-red-500 text-center my-4">
      {error || 'Não foi possível carregar o valor das promessas'}
    </div>
  );

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-2 sm:gap-4 md:gap-6 lg:gap-8 row-start-2 items-center">
        <div className="text-1xl sm:text-3xl md:text-5xl lg:text-6xl">Total de promessas:</div>
        
        {isInitialLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorDisplay />
        ) : (
          <div className="flex items-center text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-bold">
            <div className="">R$</div>
            <SlotCounter value={count} startValue={"0,00"} />
          </div>
        )}
        
        <div className="text-1xl sm:text-3xl md:text-4xl text-center lg:text-6xl">
          Meta: R${formatCurrency(donationGoal)}
        </div>
      </main>
    </div>
  );
}