// app/layout.tsx

import Header from "./components/Header";
import "./globals.css";

export const metadata = {
  title: "냉장고 재고 관리",
  description: "냉장고 재고 관리 앱",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
