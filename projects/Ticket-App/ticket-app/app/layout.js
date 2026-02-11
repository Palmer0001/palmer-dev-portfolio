import "./globals.css";

export const metadata = {
  title: "Ticket SaaS - Modern Support Platform",
  description: "Enterprise-grade ticket management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}