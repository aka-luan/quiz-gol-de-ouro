import Header from "@/components/Header";
import "./globals.css";
import PageTransitionEffect from "@/app/PageTransitionEffect";

const PageTransitionLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="pt-br">
      <body className="bg-gradient-app!">
        <Header />
        <PageTransitionEffect>{children}</PageTransitionEffect>
      </body>
    </html>
  );
};

export default PageTransitionLayout;
