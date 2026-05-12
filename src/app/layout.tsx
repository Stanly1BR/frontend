import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Sistema de Gestão de Vendas",
  description: "Cadastro automático de produtos, clientes e pedidos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
