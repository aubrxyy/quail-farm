import type { Metadata } from "next";
import { Poppins } from 'next/font/google';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './cart/CartContext';
import ClientLayout from "./clientlayout";
import "./globals.css";
import Template from "./template";

const poppR = Poppins({
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
      <head>
      </head>
      <body className={`${poppR.className} antialiased`}>
        <CartProvider>
          <Template>
            <ClientLayout>
              {children}
            </ClientLayout>
          </Template>
        </CartProvider>
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