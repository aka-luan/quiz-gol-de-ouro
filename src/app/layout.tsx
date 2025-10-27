import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-br'>
      <body>
        <div>
          <nav className='flex font-bold w-full px-10 py-4'>
            <p className='font-bold text-lg'>⚽ Quiz Bola de Ouro</p>
            <ul className='flex gap-4 ml-auto'>
              <li>
                <a href='/'>Início</a>
              </li>
              <li>
                <a href='/quiz'>Jogar</a>
              </li>
              <li>
                <a href='/ranking'>Ranking</a>
              </li>
              <li>
                <a href='/conquistas'>Conquistas</a>
              </li>
            </ul>
          </nav>
          <div className='max-w-3xl mx-auto p-4'>{children}</div>
        </div>
      </body>
    </html>
  );
}
