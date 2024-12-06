'use client'

import SlotCounter from 'react-slot-counter';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import ProgressBar from '@/app/ProgressBar'; // Import the new ProgressBar component
import ReactConfetti from 'react-confetti';
import { brazilianRealToFloat } from '@/app/utils';
import Image from 'next/image'

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
        console.log(data);

        if (response.ok) {
          const formattedValue = new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(brazilianRealToFloat(data.value));
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

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Parse the current count as a float and check if it meets or exceeds the goal
    const currentCount = brazilianRealToFloat(count);
    if (currentCount >= donationGoal) {
      setShowConfetti(true);
      // setTimeout(() => setShowConfetti(false), 5000); // Stop confetti after 5 seconds
    } else {
      setShowConfetti(false);
    }
  }, [count, donationGoal]);

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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)] antialiased bg-white dark:bg-slate-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center overflow-hidden">
        <div className="flex w-[108rem] flex-none justify-end">
          <picture>
            <source srcSet="https://tailwindcss.com/_next/static/media/docs@30.8b9a76a2.avif" type="image/avif" />
            <img src="https://tailwindcss.com/_next/static/media/docs@tinypng.d9e4dcdc.png" alt="" className="w-[71.75rem] max-w-none flex-none dark:hidden" decoding="async" />
          </picture>
          <picture>
            <source srcSet="https://tailwindcss.com/_next/static/media/docs-dark@30.1a9f8cbf.avif" type="image/avif" />
            <img src="https://tailwindcss.com/_next/static/media/docs-dark@tinypng.1bbe175e.png" alt="" className="hidden w-[90rem] max-w-none flex-none dark:block" decoding="async" />
          </picture>
        </div>
      </div>
      {showConfetti && <ReactConfetti/>}
      <main className="flex flex-col gap-2 sm:gap-4 md:gap-6 lg:gap-8 row-start-2 items-center">
        <div className="text-1xl sm:text-3xl md:text-5xl lg:text-6xl mt-28">Total de promessas:</div>
        
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
        <ProgressBar 
              currentValue={count} 
              goal={donationGoal} 
        />
        
        <div className="text-1xl sm:text-3xl md:text-4xl text-center lg:text-6xl">
          Meta: R${formatCurrency(donationGoal)}
        </div>

        <div className="mt-72">
          <div className='text-center font-bold text-1xl sm:text-3xl md:text-4xl text-center lg:text-6xl mb-4'>
             QR Code Formulário:
            </div>
          <Image src="/form_qr_code.png" alt="QR Code" className='size-56 sm:size-56 big-image' width={200} height={200} />
        </div>

        <div className="mt-72">
          <div className='text-center font-bold text-1xl sm:text-3xl md:text-4xl text-center lg:text-6xl mb-4'>
             QR Code PIX:
            </div>
          <Image src="/pix_qr_code.jpeg" alt="QR Code" className='size-56 sm:size-56 big-image' width={200} height={200} />
        </div>
      </main>
    </div>
  );
}