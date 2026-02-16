import './global.css';

export const metadata = {
  title: 'ICP Regression Manager',
  description: 'QA Regression Testing Management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="cerberus">
      <body>{children}</body>
    </html>
  );
}
