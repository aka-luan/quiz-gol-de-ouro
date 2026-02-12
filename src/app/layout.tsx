import Header from "@/components/Header";
import "./globals.css";
import PageTransitionEffect from "@/app/PageTransitionEffect";
import { Toaster } from "sonner";

const PageTransitionLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="pt-br">
      <body className="bg-gradient-app! p-4">
        <Header />
        <PageTransitionEffect>{children}</PageTransitionEffect>
        <Toaster />
      </body>
    </html>
  );
};

export default PageTransitionLayout;
