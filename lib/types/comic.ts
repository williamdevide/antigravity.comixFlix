/**
 * Interfaces e tipos fundamentais do domínio ComixFlix
 * Fonte de verdade: 5.projeto.md e 5.design.md
 */

export type Editora =
  | 'Panini Comics'
  | 'Mythos Editora'
  | 'Pipoca & Nanquim'
  | 'Quadrinhos na Cia'
  | string;

export type FormatoEdicao =
  | 'Capa Dura'
  | 'Brochura'
  | 'Formato Americano'
  | 'Omnibus'
  | 'Edição de Luxo'
  | string;

export type Disponibilidade = 'em_estoque' | 'pre_venda' | 'esgotado' | 'desconhecida';

export type StatusColecao = 'quero' | 'tenho' | 'li' | 'lendo' | null;

export interface Comic {
  id: string;
  titulo: string;
  editora: Editora;
  selo?: string | null; // Selo editorial / imprint (ex: Marvel, DC, Bonelli, Vertigo, MSP, etc.)
  preco_normal: number;
  preco_promocional: number | null;
  data_lancamento: string | null;
  url_capa: string;
  imagem_base64?: string | null; // Capa física armazenada diretamente no Firestore em formato Data URI Base64
  url_backdrop?: string | null;
  personagem_principal: string | null;
  resumo_sinopse: string | null;
  isbn: string | null;
  numero_edicao: number | null;
  serie: string | null;
  autores: string[];
  paginas: number | null;
  formato: FormatoEdicao;
  disponibilidade: Disponibilidade;
  url_produto: string;
  source: 'panini' | 'mythos' | 'pipoca_nanquim' | 'quadrinhos_cia';
  source_id?: string | null;
  destaque?: boolean;
  lancamento_semana?: boolean;
  tags?: string[];
}

export interface UserComic {
  id: string;
  comic_id: string;
  status: 'quero' | 'tenho' | 'li' | 'lendo';
  nota_pessoal: number | null; // 1 a 5 estrelas
  data_aquisicao?: string | null;
  data_leitura?: string | null;
  local_aquisicao?: string | null;
  preco_pago?: number | null;
  condicao?: 'novo' | 'otimo' | 'bom' | 'regular' | 'ruim' | null;
  tags?: string[];
  data_adicao: string;
  updated_at: string;
}

export interface CollectionStats {
  totalTenho: number;
  totalQuero: number;
  totalLidos: number;
  percentualLidos: number;
  valorEstimadoTotal: number;
  distribuicaoEditoras: Record<string, number>;
}

export interface FilterOptions {
  busca: string;
  editora: string;
  selo?: string;
  formato: string;
  status: string;
  disponibilidade: string;
  ordenacao: 'relevancia' | 'recentes' | 'menor_preco' | 'maior_preco' | 'titulo_az';
  somentePromocao?: boolean;
}
