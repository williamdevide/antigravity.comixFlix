"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TermosDeUsoPage() {
  const router = useRouter();

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
                <img src="/branding/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-[19px] font-extrabold tracking-tight text-[#e50914] leading-none">
                COMIX<span className="text-white">FLIX</span>
              </span>
            </Link>
          </div>

          <div className="flex-1 min-w-0 px-3 text-right">
            <h1 className="text-sm sm:text-base font-semibold text-[#e5e2e1] truncate">
              Termos de Uso
            </h1>
          </div>

          <div className="w-8 h-8 rounded-full bg-[#ffb4aa] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#690003] text-[18px]">gavel</span>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col relative w-full pt-20 pb-safe bg-[#131313]">
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pb-16 space-y-6">
          {/* Sub-header & Badge de Versão */}
          <div className="pt-2 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2a2a2a] border border-[#404040]/40">
              <span className="w-2 h-2 rounded-full bg-[#46D369] animate-pulse"></span>
              <span className="text-[11px] uppercase tracking-wider text-[#B3B3B3] font-semibold">
                Versão 1.2 — Vigência a partir de Março/2026
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Termos de Uso do <span className="text-[#e50914]">ComixFlix</span>
            </h2>

            <p className="text-sm text-[#B3B3B3] leading-relaxed pt-1">
              Bem-vindo ao quartel-general digital da sua coleção. O ComixFlix foi forjado por e para aficionados pela nona arte, com a missão de catalogar, organizar e celebrar edições físicas de quadrinhos com a elegância cinematográfica que sua estante merece.
            </p>
          </div>

          {/* Ambient Illustration & Visual Anchor */}
          <div className="relative w-full rounded-xl overflow-hidden shadow-xl bg-[#1c1b1b] border border-[#2a2a2a] p-4 sm:p-5 flex items-center gap-4">
            <div className="w-16 h-24 shrink-0 rounded-lg overflow-hidden bg-[#201f1f] shadow-md border border-[#404040]/30">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOcJk88EmzYksG5ug_WWDdnhPG-G4Ra4mhhXwh1Tyw6PSrMRQXwr512b1B_z6dE1tVMJg_gKSxMRk-D72tAhhfAJh3cqsU54D2tYARDvh2wqfwxSPJS_7jEnz2Qi0M8nlsxUYwmme6kpehs_5wvXJLPeyEbdoJs6Qcq6I3JkjWENhu4TpJa0AJaiQuwcav9BOdDmVly5HwUJoFtGPhg71vPkZ7e9D9pbYEnb8KGRxwuw9gYuOnJFavPg"
                alt="ComixFlix Vault Shelf"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-[#FFB400] mb-1">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span className="text-xs font-bold uppercase tracking-wider">
                  Compromisso com o Colecionador
                </span>
              </div>
              <p className="text-xs text-[#B3B3B3] leading-relaxed">
                Garantimos a integridade de seus registros de estante, valores estimados e listas de desejos conforme as normas vigentes de proteção e respeito autoral.
              </p>
            </div>
          </div>

          {/* Pílulas de Navegação Rápida */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "elegibilidade", label: "1. Elegibilidade" },
              { id: "seguranca", label: "2. Segurança" },
              { id: "propriedade", label: "3. Propriedade Intelectual" },
              { id: "servicos", label: "4. Catalogação & Wishlist" },
              { id: "comunidade", label: "5. Perfis Públicos" },
              { id: "responsabilidade", label: "6. Responsabilidade" },
              { id: "contato", label: "7. Contato" },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="shrink-0 px-3 py-1.5 rounded-full bg-[#201f1f] text-[#B3B3B3] text-xs font-semibold hover:text-white hover:bg-[#2a2a2a] border border-transparent hover:border-[#404040] transition-all"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Lista de Artigos Legais */}
          <div className="space-y-4">
            {/* Seção 1 */}
            <article id="elegibilidade" className="rounded-xl bg-[#1c1b1b] border border-[#2a2a2a] p-4 sm:p-5 shadow-sm space-y-2 scroll-mt-20">
              <div className="flex items-center gap-2.5 text-[#4DA3FF]">
                <span className="material-symbols-outlined text-[22px]">badge</span>
                <h3 className="text-base sm:text-lg font-bold text-white">1. Aceitação dos Termos e Elegibilidade</h3>
              </div>
              <p className="text-xs sm:text-sm text-[#B3B3B3] leading-relaxed">
                Ao criar sua conta de colecionador ou navegar pelo ComixFlix, você concorda expressamente com as presentes diretrizes. O cadastro é destinado a indivíduos com idade igual ou superior a 13 anos. Usuários menores de 18 anos declaram estar autorizados por seus responsáveis legais para usufruir de ferramentas colaborativas e monitoramento de aquisições.
              </p>
            </article>

            {/* Seção 2 */}
            <article id="seguranca" className="rounded-xl bg-[#1c1b1b] border border-[#2a2a2a] p-4 sm:p-5 shadow-sm space-y-2 scroll-mt-20">
              <div className="flex items-center gap-2.5 text-[#FFB400]">
                <span className="material-symbols-outlined text-[22px]">lock</span>
                <h3 className="text-base sm:text-lg font-bold text-white">2. Cadastro e Segurança da Conta</h3>
              </div>
              <p className="text-xs sm:text-sm text-[#B3B3B3] leading-relaxed">
                Você é o guardião exclusivo de suas chaves de acesso. O ComixFlix emprega criptografia de ponta e tokens seguros de sessão, mas você assume total responsabilidade por manter senhas robustas e confidenciais. Qualquer indício de comprometimento deve ser reportado imediatamente aos nossos canais oficiais para blindagem preventiva da conta.
              </p>
            </article>

            {/* Seção 3 */}
            <article id="propriedade" className="rounded-xl bg-[#1c1b1b] border border-[#2a2a2a] p-4 sm:p-5 shadow-sm space-y-2 scroll-mt-20">
              <div className="flex items-center gap-2.5 text-[#e50914]">
                <span className="material-symbols-outlined text-[22px]">auto_stories</span>
                <h3 className="text-base sm:text-lg font-bold text-white">3. Licença de Uso e Propriedade Intelectual</h3>
              </div>
              <p className="text-xs sm:text-sm text-[#B3B3B3] leading-relaxed">
                O design, algoritmos de recomendação e a identidade de streaming do ComixFlix são propriedade exclusiva da plataforma. As imagens de capas, títulos, sinopses e logotipos de editoras (incluindo referências a <strong className="text-white font-semibold">Panini Comics</strong>, <strong className="text-white font-semibold">Mythos Editora</strong>, <strong className="text-white font-semibold">Pipoca & Nanquim</strong> e outras casas editoriais) são exibidos estritamente para propósitos informativos, educativos e de indexação bibliográfica de acervo por fãs, pertencendo integralmente aos seus legítimos detentores de direitos autorais.
              </p>
            </article>

            {/* Seção 4 */}
            <article id="servicos" className="rounded-xl bg-[#1c1b1b] border border-[#2a2a2a] p-4 sm:p-5 shadow-sm space-y-2 scroll-mt-20">
              <div className="flex items-center gap-2.5 text-[#4DA3FF]">
                <span className="material-symbols-outlined text-[22px]">trending_up</span>
                <h3 className="text-base sm:text-lg font-bold text-white">4. Catalogação, Wishlist e Alerta de Preços</h3>
              </div>
              <p className="text-xs sm:text-sm text-[#B3B3B3] leading-relaxed">
                Nossas ferramentas de rastreio de mercado, estimativas de raridade e alertas de descontos são baseadas em cotações públicas de mercado livreiro e e-commerce parceiro. O ComixFlix não comercializa nem entrega fisicamente os volumes listados; valores cotados possuem natureza indicativa e estão sujeitos a volatilidade de estoque de terceiros.
              </p>
            </article>

            {/* Seção 5 */}
            <article id="comunidade" className="rounded-xl bg-[#1c1b1b] border border-[#2a2a2a] p-4 sm:p-5 shadow-sm space-y-2 scroll-mt-20">
              <div className="flex items-center gap-2.5 text-[#a2c9ff]">
                <span className="material-symbols-outlined text-[22px]">public</span>
                <h3 className="text-base sm:text-lg font-bold text-white">5. Compartilhamento Social e Perfis Públicos</h3>
              </div>
              <p className="text-xs sm:text-sm text-[#B3B3B3] leading-relaxed">
                Colecionadores que habilitarem a vitrine pública <code className="px-1.5 py-0.5 rounded bg-[#201f1f] text-[#FFB400] font-mono text-xs">comixflix.com.br/u/username</code> concordam em manter uma conduta respeitosa. Banners customizados, resenhas e fotos de edições postadas na comunidade não devem violar leis de convivência ou conter materiais ofensivos, sob pena de suspensão de exibição social.
              </p>
            </article>

            {/* Seção 6 */}
            <article id="responsabilidade" className="rounded-xl bg-[#1c1b1b] border border-[#2a2a2a] p-4 sm:p-5 shadow-sm space-y-2 scroll-mt-20">
              <div className="flex items-center gap-2.5 text-[#B3B3B3]">
                <span className="material-symbols-outlined text-[22px]">gavel</span>
                <h3 className="text-base sm:text-lg font-bold text-white">6. Limitação de Responsabilidade</h3>
              </div>
              <p className="text-xs sm:text-sm text-[#B3B3B3] leading-relaxed">
                Empenhamo-nos em garantir uma experiência fluida e sem quedas através de infraestrutura em nuvem resiliente. Não obstante, o serviço é fornecido "no estado em que se encontra", não nos responsabilizando por indisponibilidades temporárias de rede móvel, falhas em APIs externas de livreiros ou erros manuais na catalogação inserida pelo usuário.
              </p>
            </article>

            {/* Seção 7 */}
            <article id="contato" className="rounded-xl bg-[#1c1b1b] border border-[#2a2a2a] p-4 sm:p-5 shadow-sm space-y-2 scroll-mt-20">
              <div className="flex items-center gap-2.5 text-[#ffb4aa]">
                <span className="material-symbols-outlined text-[22px]">support_agent</span>
                <h3 className="text-base sm:text-lg font-bold text-white">7. Alterações e Canal Direto de Suporte</h3>
              </div>
              <p className="text-xs sm:text-sm text-[#B3B3B3] leading-relaxed">
                Podemos aprimorar estes Termos para acompanhar novidades no universo de quadrinhos ou regulamentações. Notificaremos você sobre mudanças materiais. Dúvidas, solicitações de remoção ou feedback de catalogação devem ser direcionados à nossa equipe:
              </p>
              <div className="pt-2">
                <a
                  href="mailto:suporte@comixflix.com.br"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#2a2a2a] text-[#ffb4aa] hover:text-white hover:bg-[#353534] border border-[#404040]/40 text-xs font-semibold transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                  suporte@comixflix.com.br
                </a>
              </div>
            </article>
          </div>

          {/* Faixa LGPD */}
          <div className="rounded-xl bg-[#1c1b1b] border border-[#2a2a2a] p-4 sm:p-5 flex items-start gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#201f1f] flex items-center justify-center shrink-0 text-[#46D369]">
              <span className="material-symbols-outlined text-[24px]">security</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white">Privacidade e Proteção LGPD</h4>
              <p className="text-xs text-[#B3B3B3] mt-0.5 leading-relaxed">
                Suas informações de leitura e posse de títulos são tratadas sob rigoroso cumprimento da Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Nunca comercializamos seus dados com terceiros.
              </p>
            </div>
          </div>

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
                  src="/branding/logo-milkfed.png"
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
