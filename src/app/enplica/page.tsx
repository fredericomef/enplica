import type { Metadata } from "next";
import EnplicaHome from "@/components/EnplicaHome";

export const metadata: Metadata = {
  title: "Faça o Raio-X do seu Negócio | Método ENPLICA",
  description:
    "Descubra como está a saúde do seu negócio em sete áreas fundamentais.",
  openGraph: {
    title: "Faça o Raio-X do seu Negócio | Método ENPLICA",
    description:
      "Descubra como está a saúde do seu negócio em sete áreas fundamentais.",
    url: "https://planejamentocriativo.com/enplica",
    siteName: "ENPLICA",
    images: [
      {
        url: "https://planejamentocriativo.com/logos/favaconenplica.jpeg",
        width: 1080,
        height: 1080,
        alt: "Faça o Raio-X do seu Negócio | Método ENPLICA",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

export default function EnplicaPage() {
  return <EnplicaHome />;
}
