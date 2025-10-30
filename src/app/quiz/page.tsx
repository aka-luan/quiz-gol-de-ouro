'use client';
import Button from "@/components/Button"
import Progress from "@/components/Progress"
function quiz() {
  return (
    <main className='flex flex-col items-center justify-center gap-6 bg-surface-1 pt-16 pb-10 px-8 rounded-3xl border border-surface-2 shadow-card max-w-xl mx-auto'>
      <div className="w-full border-b border-surface-2 pb-4">
        <div className="flex justify-between mb-2">
          <p>Perguntas 3 / 10</p>
          <p>XP: 80</p>
        </div>
        <Progress max={10} value={3} />
      </div>
      <div className="flex flex-col gap-6 w-full">
        <div className="flex justify-between">
          <p>ICONE Copa do Mundo</p> 
          <p>Fácil</p>
        </div>
      </div>
      <h2 className="text-4xl font-medium font-display mb-2">Quem venceu a copa do mundo de 2018?</h2>
      <div className="flex flex-col gap-2 w-full">
        <Button className="text-xl font-medium text-left px-6 bg-gradient-right-answer border-surface-2 text-text-primary" onClick={() => {}}>França</Button>
        <Button className="text-xl font-medium text-left px-6 bg-deep border-surface-1 text-text-primary" onClick={() => {}}>Bélgica</Button>
        <Button className="text-xl font-medium text-left px-6 bg-deep border-surface-1 text-text-primary" onClick={() => {}}>Inglaterra</Button>
        <Button className="text-xl font-medium text-left px-6 bg-gradient-wrong-answer border-surface-2 text-text-primary" onClick={() => {}}>Croácia</Button>
      </div>
    </main>
  )
}

export default quiz