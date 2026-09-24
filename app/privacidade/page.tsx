"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAssetPath } from "@/lib/utils/asset";

export default function PoliticaPrivacidadePage() {
  const router = useRouter();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "sec-1": true,
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] antialiased flex flex-col font-sans">
      {/* Header Fixo Idêntico ao Stitch */}
      <header className="fixed top-0 w-full z-50 pt-safe bg-[#131313]/85 backdrop-blur-xl border-b border-[#201f1f] shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
        <div className="h-16 max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              aria-label="Voltar"
              className="w-10 h-10 flex items-center justify-center rounded-lg text-white hover:text-[#e50914] hover:bg-[#201f1f] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <Link href="/" className="flex items-center gap-2 select-none">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#e50914]/40 bg-black shrink-0 shadow-sm">
                <img src={getAssetPath("/branding/logo.jpg")} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-[19px] font-extrabold tracking-tight text-[#e50914] leading-none">
                COMIX<span className="text-white">FLIX</span>
              </span>
            </Link>
          </div>

          <div className="flex-1 min-w-0 px-3 text-right">
            <h1 className="text-sm sm:text-base font-semibold text-[#e5e2e1] truncate">
              Política De Privacidade
            </h1>
          </div>

          <div className="w-8 h-8 rounded-full bg-[#ffb4aa] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#690003] text-[18px]">verified_user</span>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col relative w-full pt-20 pb-safe bg-[#131313]">
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pb-16 space-y-6">
          {/* Header Card com Blindagem LGPD */}
          <section className="p-4 sm:p-6 rounded-xl bg-[#201f1f] border border-[#2a2a2a] shadow-md relative overflow-hidden flex flex-col gap-3">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#4DA3FF]/10 blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-[#2a2a2a] border border-[#404040]/30 flex items-center justify-center text-[#4DA3FF] shadow-sm">
                <span className="material-symbols-outlined text-[28px]">verified_user</span>
              </div>
              <span className="rounded-full px-3 py-1 bg-[#4DA3FF]/20 text-[#4DA3FF] text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 border border-[#4DA3FF]/30">
                <span className="material-symbols-outlined text-[14px]">gavel</span>
                Conformidade LGPD
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Transparência Total</h2>
              <p className="text-xs sm:text-sm text-[#B3B3B3] leading-relaxed">
                Sua estante, seus tesouros, seus dados. Entenda como blindamos sua privacidade enquanto você cataloga e expande seus quadrinhos.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-[#8C8C8C] text-xs mt-1">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              <span>Última revisão: 24 de Outubro de 2024 (Válida em 2026)</span>
            </div>
          </section>

          {/* Bento: Resumo em 3 Minutos */}
          <section className="space-y-3">
            <div className="flex flex-col gap-1">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#e50914] text-[20px]">bolt</span>
                Resumo em 3 Minutos
              </h3>
              <p className="text-xs text-[#B3B3B3]">Os pilares centrais de confiança do ComixFlix.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Card 1 */}
              <div className="p-4 rounded-xl bg-[#201f1f] border border-[#2a2a2a] shadow-sm flex flex-col gap-2">
                <div className="w-10 h-10 rounded-lg bg-[#2a2a2a] flex items-center justify-center shrink-0 text-[#4DA3FF]">
                  <span className="material-symbols-outlined text-[22px]">auto_stories</span>
                </div>
                <h4 className="text-sm font-bold text-white">O que coletamos</h4>
                <p className="text-xs text-[#B3B3B3] leading-relaxed">
                  Apenas seu perfil básico (nome, e-mail) e o status das suas edições físicas (Quero, Tenho, Li, notas e estimativas de compra).
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-4 rounded-xl bg-[#201f1f] border border-[#2a2a2a] shadow-sm flex flex-col gap-2">
                <div className="w-10 h-10 rounded-lg bg-[#2a2a2a] flex items-center justify-center shrink-0 text-[#FFB400]">
                  <span className="material-symbols-outlined text-[22px]">interests</span>
                </div>
                <h4 className="text-sm font-bold text-white">Como usamos</h4>
                <p className="text-xs text-[#B3B3B3] leading-relaxed">
                  Exclusivamente para calibrar sua estante, mapear checklist de séries e notificar ofertas de volumes que faltam no seu acervo.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-4 rounded-xl bg-[#201f1f] border border-[#2a2a2a] shadow-sm flex flex-col gap-2">
                <div className="w-10 h-10 rounded-lg bg-[#2a2a2a] flex items-center justify-center shrink-0 text-[#46D369]">
                  <span className="material-symbols-outlined text-[22px]">lock</span>
                </div>
                <h4 className="text-sm font-bold text-white">O controle é seu</h4>
                <p className="text-xs text-[#B3B3B3] leading-relaxed">
                  Sua coleção é 100% privada por padrão. Valores pagos e perfil público só são visíveis se você ativar propositalmente.
                </p>
              </div>
            </div>
          </section>

          {/* Acordeões com Diretrizes Detalhadas */}
          <section className="space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4DA3FF] text-[20px]">policy</span>
              Diretrizes Legais Detalhadas
            </h3>

            <div className="flex flex-col gap-2">
              {/* Accordion 1 */}
              <div className="rounded-xl bg-[#201f1f] border border-[#2a2a2a] overflow-hidden transition-all duration-200">
                <button
                  type="button"
                  onClick={() => toggleSection("sec-1")}
                  className="w-full p-4 flex items-center justify-between text-left focus:outline-none hover:bg-[#2a2a2a]/60 transition-colors"
                >
                  <span className="text-sm font-bold text-white flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#B3B3B3] text-[20px]">business</span>
                    <span>1. Controladora e DPO</span>
                  </span>
                  <span
                    className={`material-symbols-outlined text-[#B3B3B3] text-[20px] transition-transform duration-200 ${
                      openSections["sec-1"] ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {openSections["sec-1"] && (
                  <div className="px-4 pb-4 text-[#B3B3B3] text-xs sm:text-sm flex flex-col gap-2 border-t border-[#2a2a2a] pt-3 leading-relaxed">
                    <p>
                      A plataforma ComixFlix é mantida pela ComixFlix Tecnologia e Entretenimento Ltda. Nosso Encarregado de Proteção de Dados (DPO) atende formalmente dúvidas, solicitações ou relatórios de incidentes.
                    </p>
                    <div className="p-3 rounded-lg bg-[#2a2a2a] border border-[#404040]/30 flex items-center gap-2 text-white font-semibold text-xs">
                      <span className="material-symbols-outlined text-[#4DA3FF] text-[18px]">mail</span>
                      <span>dpo@comixflix.com.br</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2 */}
              <div className="rounded-xl bg-[#201f1f] border border-[#2a2a2a] overflow-hidden transition-all duration-200">
                <button
                  type="button"
                  onClick={() => toggleSection("sec-2")}
                  className="w-full p-4 flex items-center justify-between text-left focus:outline-none hover:bg-[#2a2a2a]/60 transition-colors"
                >
                  <span className="text-sm font-bold text-white flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#B3B3B3] text-[20px]">inventory_2</span>
                    <span>2. Dados Coletados & Finalidades</span>
                  </span>
                  <span
                    className={`material-symbols-outlined text-[#B3B3B3] text-[20px] transition-transform duration-200 ${
                      openSections["sec-2"] ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {openSections["sec-2"] && (
                  <div className="px-4 pb-4 text-[#B3B3B3] text-xs sm:text-sm flex flex-col gap-2 border-t border-[#2a2a2a] pt-3 leading-relaxed">
                    <p>Tratamos estritamente os seguintes dados:</p>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#B3B3B3]">
                      <li>
                        <strong className="text-white">Cadastrais:</strong> Nome de colecionador, apelido público e endereço de e-mail único.
                      </li>
                      <li>
                        <strong className="text-white">Acervo:</strong> ISBNs cadastrados, variantes de capa, estado de conservação física, notas pessoais e preços de compra (opcional).
                      </li>
                      <li>
                        <strong className="text-white">Sessão:</strong> Endereço IP e identificadores de aparelho para autenticação segura e prevenção de fraudes.
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 3 */}
              <div className="rounded-xl bg-[#201f1f] border border-[#2a2a2a] overflow-hidden transition-all duration-200">
                <button
                  type="button"
                  onClick={() => toggleSection("sec-3")}
                  className="w-full p-4 flex items-center justify-between text-left focus:outline-none hover:bg-[#2a2a2a]/60 transition-colors"
                >
                  <span className="text-sm font-bold text-white flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#B3B3B3] text-[20px]">share</span>
                    <span>3. Compartilhamento e Afiliados</span>
                  </span>
                  <span
                    className={`material-symbols-outlined text-[#B3B3B3] text-[20px] transition-transform duration-200 ${
                      openSections["sec-3"] ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {openSections["sec-3"] && (
                  <div className="px-4 pb-4 text-[#B3B3B3] text-xs sm:text-sm flex flex-col gap-2 border-t border-[#2a2a2a] pt-3 leading-relaxed">
                    <p>
                      <strong className="text-white">Nós nunca vendemos seus dados.</strong> O ecossistema ComixFlix atua sem comércio paralelo de banco de dados.
                    </p>
                    <p>
                      Quando você acessa links para editoras parceiras (Panini Comics, Pipoca & Nanquim, Mythos Editora), transferimos apenas parâmetros de campanha impessoais para computação de cashback ou redirecionamento seguro para a loja.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 4 */}
              <div className="rounded-xl bg-[#201f1f] border border-[#2a2a2a] overflow-hidden transition-all duration-200">
                <button
                  type="button"
                  onClick={() => toggleSection("sec-4")}
                  className="w-full p-4 flex items-center justify-between text-left focus:outline-none hover:bg-[#2a2a2a]/60 transition-colors"
                >
                  <span className="text-sm font-bold text-white flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#B3B3B3] text-[20px]">key</span>
                    <span>4. Criptografia & Armazenamento</span>
                  </span>
                  <span
                    className={`material-symbols-outlined text-[#B3B3B3] text-[20px] transition-transform duration-200 ${
                      openSections["sec-4"] ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {openSections["sec-4"] && (
                  <div className="px-4 pb-4 text-[#B3B3B3] text-xs sm:text-sm flex flex-col gap-2 border-t border-[#2a2a2a] pt-3 leading-relaxed">
                    <p>
                      Suas credenciais são protegidas com algoritmos modernos de hashing (Bcrypt/Argon2) através da infraestrutura certificada do Firebase e Google Cloud. Nenhuma senha trafega em texto puro.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 5 */}
              <div className="rounded-xl bg-[#201f1f] border border-[#2a2a2a] overflow-hidden transition-all duration-200">
                <button
                  type="button"
                  onClick={() => toggleSection("sec-5")}
                  className="w-full p-4 flex items-center justify-between text-left focus:outline-none hover:bg-[#2a2a2a]/60 transition-colors"
                >
                  <span className="text-sm font-bold text-white flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#B3B3B3] text-[20px]">manage_accounts</span>
                    <span>5. Seus Direitos (LGPD)</span>
                  </span>
                  <span
                    className={`material-symbols-outlined text-[#B3B3B3] text-[20px] transition-transform duration-200 ${
                      openSections["sec-5"] ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {openSections["sec-5"] && (
                  <div className="px-4 pb-4 text-[#B3B3B3] text-xs sm:text-sm flex flex-col gap-2 border-t border-[#2a2a2a] pt-3 leading-relaxed">
                    <p>
                      Você possui direito total a: (i) confirmação da existência de tratamento; (ii) acesso aos dados; (iii) correção de dados incompletos; (iv) exclusão definitiva da sua conta e de todos os quadrinhos vinculados a qualquer momento pelas configurações do app.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Rodapé Institucional com Desenvolvedora */}
          <div className="pt-6 border-t border-[#2a2a2a] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8C8C8C]">
            <p>© {new Date().getFullYear()} ComixFlix HQ • Todos os direitos reservados.</p>
            <div className="flex items-center gap-2 group">
              <span className="text-[11px] text-[#7A7A7A]">Engenharia por</span>
              <Link
                href="/sobre"
                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#201f1f] border border-[#2a2a2a] hover:border-[#e50914]/50 transition-colors cursor-pointer"
                title="Conheça a Milkfed Devs&&Reqs Lords - Sobre Nós"
              >
                <img
                  src={getAssetPath("/branding/logo-milkfed.png")}
                  alt="Milkfed Devs&&Reqs Lords"
                  className="w-3.5 h-3.5 object-contain"
                />
                <span className="text-xs font-semibold text-[#B3B3B3] group-hover:text-white transition-colors">
                  Milkfed Devs&&Reqs Lords
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
