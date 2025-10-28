'use client';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
const page = () => {
  const router = useRouter();

  return (
    <main className='flex flex-col items-center justify-center gap-6'>
      <h1 className='text-3xl'>Bem-vindo ao Quiz Gol de Ouro</h1>
      <p>
        Teste seus conhecimentos sobre futebol e conquiste o topo do ranking!
      </p>
      <Button variant='primary' onClick={() => router.push('/quiz')}>
        Jogar agora
      </Button>
    </main>
  );
};

export default page;
