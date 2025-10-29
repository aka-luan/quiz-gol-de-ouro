import Header from '@/components/Header';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-br'>
      <body className='bg-gradient-app !important'>
        <div>
          <Header />
          <div className='mx-auto p-4'>{children}</div>
        </div>
      </body>
    </html>
  );
}
