import Header from '@/components/Header';
import './globals.css';
import AnimatedLayout from '@/components/AnimatedLayout';

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
          <AnimatedLayout>{children}</AnimatedLayout>
        </div>
      </body>
    </html>
  );
}
