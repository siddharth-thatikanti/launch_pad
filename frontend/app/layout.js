import "./globals.css";

export const metadata = {
  title: "LaunchPad | Build something great",
  description: "A clean landing page starter application."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
