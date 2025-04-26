import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import Template from "./template";
import ClientLayout from "./clientlayout";
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const interR = Inter({import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import Template from "./template";
import ClientLayout from "./clientlayout";
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const interR = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: '400',
});

export const metadata: Metadata = {
  title: "Cimahpar Quail Farm",
  description: "Application by AR3",
  themeColor: "#000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${interR.variable} antialiased`}>
        <Template>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Template>
        <ToastContainer
          autoClose={3000}
          pauseOnFocusLoss
          hideProgressBar
          newestOnTop
          closeOnClick
          transition={Slide}
          position="top-right"
          className={`mt-20 rounded-sm`}
          stacked
        />
      </body>
    </html>
  );
}
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: "Cimahpar Quail Farm",
  description: "Application by AR3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${interR.className} antialiased`}>
        <Template>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Template>
        <ToastContainer
          autoClose={3000}
          pauseOnFocusLoss
          hideProgressBar
          newestOnTop
          closeOnClick
          transition={Slide}
          position="top-right"
          className={`mt-20 rounded-sm  `}
          stacked
        />
      </body>
    </html>
  );
}