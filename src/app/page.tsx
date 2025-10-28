/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import Button from '@/components/Button';
import { Star, Trophy, ArrowUp, Flame, Gamepad2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
const page = () => {
  const router = useRouter();

  return (
    <main className='flex flex-col items-center justify-center gap-6 bg-blue-600 py-10 px-6 rounded-4xl border border-cyan-400 shadow-lg shadow- shadow-amber-50 max-w-xl mx-auto'>
      <div className='flex gap-6 items-center justify-center'>
    <Trophy className='w-20 h-20'/>
        <h1 className='text-4xl font-bold'>Quiz Gol <br /> de Ouro</h1>
      </div>
      <p className='text-xl'>
        Teste seus conhecimentos sobre futebol, ganhe XP, suba de nível e desbloqueie conquista!
      </p>
      <Button className="text-xl" variant='primary' onClick={() => router.push('/quiz')}>
        Jogar Agora
      </Button>
      <div className='w-full p-4 rounded-2xl bg-blue-500'>
        <ul className='flex flex-col text-xl gap-2 font-medium'>
          <li className='flex gap-2'><Star fill="yellow" color='yellow'/>Nível: Craque</li>
          <li className='flex gap-2'><ArrowUp fill="yellow" color='yellow' strokeWidth={3}/>XP Total: 620</li>
          <li className='flex gap-2'><Flame />Maior Sequência: 8</li>
          <li className='flex gap-2'><Gamepad2 />Melhor Partida: 9/10</li>
        </ul>
      </div>
    </main>
  );
};

export default page;
