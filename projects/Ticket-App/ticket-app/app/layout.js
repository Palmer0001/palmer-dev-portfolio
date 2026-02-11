import "./globals.css";

export const metadata = {
  title: "Ticket App",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
