import ProtectedRoute from "./ProtectedRoute.jsx";
import Header from "./Header.jsx"; // ✅ Importar Header
import Footer from "./Footer.jsx"; // ✅ Importar Footer
import "src/styles/global.css"; // ✅ Importar Tailwind

export default function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Header /> {/* ✅ Restaurar Header */}
        <main className="flex-1 bg-[#721422] text-white p-6">{children}</main>
        <Footer /> {/* ✅ Restaurar Footer */}
      </div>
    </ProtectedRoute>
  );
}
