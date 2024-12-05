'use client'

import { useState } from "react";
import SlotCounter from 'react-slot-counter';

export default function Home() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  const startCount = formatCurrency(0); // Replace 0 with your desired starting value
  const [count] = useState(startCount); // Replace 0 with your desired starting value
  const donationGoal = 2_000_000; // Set your desired donation goal

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-2 sm:gap-4 md:gap-6 lg:gap-8 row-start-2 items-center">
        <div className="text-1xl sm:text-3xl md:text-5xl lg:text-6xl">Total de promessas:</div>
        <div className="flex items-center text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-bold">
          <div className="">R$</div>
          <SlotCounter value={count} startValue={"0,00"} />
        </div>
        <div className="text-1xl sm:text-3xl md:text-4xl text-center lg:text-6xl">Meta: R${formatCurrency(donationGoal)}</div>
      </main>
    </div>
  );
}