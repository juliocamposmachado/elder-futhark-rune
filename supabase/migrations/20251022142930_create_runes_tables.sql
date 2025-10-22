/*
  # Tabelas para Sistema de Leitura de Runas Elder Futhark

  1. Novas Tabelas
    - `runes`
      - `id` (int, chave primária)
      - `symbol` (texto, símbolo rúnico)
      - `name` (texto, nome da runa)
      - `translit` (texto, transliteração)
      - `keywords` (texto[], palavras-chave)
      - `meaning_short` (texto, significado curto)
      - `meaning_past` (texto, interpretação para passado)
      - `meaning_present` (texto, interpretação para presente)
      - `meaning_future` (texto, interpretação para futuro)
      - `poetic_text` (texto, texto em modo poético/arcaico)
      - `created_at` (timestamp)
    
    - `readings`
      - `id` (uuid, chave primária)
      - `user_id` (uuid, referência opcional ao usuário)
      - `method` (texto, método de leitura)
      - `runes_drawn` (jsonb, runas sorteadas com posições)
      - `created_at` (timestamp)
  
  2. Segurança
    - RLS habilitado em ambas tabelas
    - Leituras públicas para visualização
    - Apenas admin pode modificar runas base
*/

-- Tabela de runas Elder Futhark
CREATE TABLE IF NOT EXISTS runes (
  id int PRIMARY KEY,
  symbol text NOT NULL,
  name text NOT NULL,
  translit text NOT NULL,
  keywords text[] DEFAULT '{}',
  meaning_short text NOT NULL,
  meaning_past text NOT NULL,
  meaning_present text NOT NULL,
  meaning_future text NOT NULL,
  poetic_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Tabela de leituras salvas
CREATE TABLE IF NOT EXISTS readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  method text NOT NULL,
  runes_drawn jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_readings_created ON readings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_readings_user ON readings(user_id);

-- RLS
ALTER TABLE runes ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;

-- Políticas: runas são públicas para leitura
CREATE POLICY "Runas são visíveis para todos"
  ON runes FOR SELECT
  TO public
  USING (true);

-- Políticas: leituras são públicas para leitura
CREATE POLICY "Leituras são visíveis para todos"
  ON readings FOR SELECT
  TO public
  USING (true);

-- Políticas: qualquer um pode inserir leituras
CREATE POLICY "Qualquer um pode criar leituras"
  ON readings FOR INSERT
  TO public
  WITH CHECK (true);

-- Popular com as 24 runas Elder Futhark
INSERT INTO runes (id, symbol, name, translit, keywords, meaning_short, meaning_past, meaning_present, meaning_future, poetic_text) VALUES
(1, 'ᚠ', 'Fehu', 'F', ARRAY['riqueza', 'prosperidade', 'posse'], 
  'Riqueza, prosperidade, posse material.',
  'Tuas posses passadas moldaram teu caminho; recursos acumulados dão-te força.',
  'O fluxo de riqueza move-se em tua vida; administra com sabedoria o que tens.',
  'Abundância aproxima-se; novos recursos virão se trabalhares com diligência.',
  'Fehu: o gado dos ancestrais — fortuna que vem e vai. Toma e oferece, pois a riqueza flui como rio.'),

(2, 'ᚢ', 'Uruz', 'U', ARRAY['força', 'vigor', 'saúde'],
  'Força bruta, vigor físico, saúde robusta.',
  'Força primordial susteve-te; teu corpo e espírito superaram provas antigas.',
  'Vigor pulsa em tuas veias; tempo de ação física e determinação inabalável.',
  'Resistência crescerá; desafios exigirão tua força interior e coragem.',
  'Uruz: o auroque selvagem — força bruta que não se doma. Ergue-te com o poder da terra.'),

(3, 'ᚦ', 'Thurisaz', 'Th', ARRAY['desafio', 'defesa', 'força'],
  'Desafio, defesa contra adversários, força destrutiva.',
  'Espinhos protegeram-te; conflitos passados forjaram tua defesa atual.',
  'Guardas tuas fronteiras; é tempo de defesa ativa ou confronto necessário.',
  'Obstáculo surgirá; prepara-te para defender o que é teu com força controlada.',
  'Thurisaz: o espinho de Thor — protege e fere. Que tua defesa seja martelo e escudo.'),

(4, 'ᚨ', 'Ansuz', 'A', ARRAY['inspiração', 'comunicação', 'mensagem'],
  'Inspiração divina, comunicação clara, mensagens importantes.',
  'Palavras sábias guiaram-te; mensagens passadas revelaram verdades ocultas.',
  'Inspiração desce sobre ti; escuta atento, pois sinais falam-te agora.',
  'Mensagem chegará; conhecimento novo iluminará teu caminho vindouro.',
  'Ansuz: a boca de Odin — sopro divino que fala pelos ventos. Ouve o que os deuses sussurram.'),

(5, 'ᚱ', 'Raidho', 'R', ARRAY['viagem', 'movimento', 'jornada'],
  'Viagem física ou espiritual, movimento, jornada controlada.',
  'Tua jornada trouxe-te aqui; caminhos percorridos ensinaram-te lições vitais.',
  'Estás em movimento; mantém ritmo constante e direção clara em tua senda.',
  'Nova jornada inicia; prepara-te para viajar — física ou espiritualmente.',
  'Raidho: a roda do carro — movimento ordenado sob rédeas firmes. Cavalga com propósito.'),

(6, 'ᚲ', 'Kenaz', 'K', ARRAY['visão', 'conhecimento', 'fogo'],
  'Visão interior, conhecimento iluminador, fogo criativo.',
  'Chama interior guiou-te; iluminação passada ainda clareia tua mente.',
  'Vês além do véu; criatividade e conhecimento ardem vivos em ti agora.',
  'Revelação virá; nova luz dissipará sombras e mostrará verdade escondida.',
  'Kenaz: a tocha na escuridão — fogo que revela e transforma. Que tua visão seja clara como chama.'),

(7, 'ᚷ', 'Gebo', 'G', ARRAY['presente', 'troca', 'parceria'],
  'Presente, troca equilibrada, parceria harmônica.',
  'Trocas passadas teceram laços; generosidade recebida e dada moldou alianças.',
  'Equilíbrio nas relações; dá e recebe em medida justa — parceria floresce.',
  'União aproxima-se; nova parceria ou presente selará laço importante.',
  'Gebo: o presente sagrado — nada sem retorno. Troca honrada entre iguais traz bênção mútua.'),

(8, 'ᚹ', 'Wunjo', 'W', ARRAY['alegria', 'harmonia', 'sucesso'],
  'Alegria, harmonia, sucesso merecido.',
  'Alegria colhida no passado; momentos de harmonia nutriram tua alma.',
  'Harmonia reina; desfruta o presente com coração leve e gratidão sincera.',
  'Felicidade vem; sucesso e contentamento coroarão teus esforços futuros.',
  'Wunjo: a bandeira da alegria — contentamento que dança sob céu claro. Celebra o que é bom.'),

(9, 'ᚺ', 'Hagalaz', 'H', ARRAY['ruptura', 'mudança', 'teste'],
  'Ruptura súbita, mudança disruptiva, teste pelo caos.',
  'Tempestade passada transformou-te; destruição anterior limpou terreno para novo crescimento.',
  'Caos atinge-te; aceita a ruptura — forças além do controle reestruturam tua vida.',
  'Mudança abrupta virá; prepara-te para o inesperado — granizo que purifica.',
  'Hagalaz: o granizo destruidor — semente de caos necessário. Do rompimento nasce o novo.'),

(10, 'ᚾ', 'Nauthiz', 'N', ARRAY['necessidade', 'restrição', 'lição'],
  'Necessidade urgente, restrição forçada, lição através da dificuldade.',
  'Necessidade moldou-te; privação passada ensinou-te valor e resistência.',
  'Restrições pesam; enfrenta o que falta com criatividade — escassez ensina.',
  'Prova chegará; limitação futura exigirá adaptação e força de vontade.',
  'Nauthiz: o fogo de fricção — nascido da necessidade severa. Forja tua força no atrito.'),

(11, 'ᛁ', 'Isa', 'I', ARRAY['pausa', 'estase', 'concentração'],
  'Pausa necessária, estase, concentração fria.',
  'Gelo preservou o que foi; pausa passada protegeu e consolidou conquistas.',
  'Tudo está imóvel; tempo de espera paciente — movimento retornará no degelo.',
  'Paralisia temporária vem; usa o congelamento para reflexão profunda.',
  'Isa: o gelo imóvel — água cristalizada em pausa absoluta. Na quietude, encontra clareza.'),

(12, 'ᛃ', 'Jera', 'J', ARRAY['colheita', 'ciclo', 'recompensa'],
  'Colheita, ciclo completo, recompensa pelo esforço.',
  'Sementes plantadas germinaram; esforços passados amadureceram em frutos colhidos.',
  'Ciclo completa-se; colhe agora o que semeaste — tempo de recompensa justa.',
  'Abundância virá; paciência será premiada — o ano roda em teu favor.',
  'Jera: a roda do ano — plantio e colheita em eterno ciclo. O que semeias, colherás.'),

(13, 'ᛇ', 'Eihwaz', 'Ei', ARRAY['resistência', 'transformação', 'morte-renascimento'],
  'Resistência profunda, transformação através da morte, conexão entre mundos.',
  'Atravessaste mundos; transformações passadas ligaram morte e renascimento em ti.',
  'Suportas o insuportável; tua resistência é como o teixo — eterno e profundo.',
  'Grande transformação vem; atravessarás portais — emerge renovado do outro lado.',
  'Eihwaz: o teixo de Yggdrasil — raiz e galho entre os nove mundos. Resiste e transcende.'),

(14, 'ᛈ', 'Perthro', 'P', ARRAY['mistério', 'sorte', 'segredo'],
  'Mistério oculto, sorte revelada, segredo do destino.',
  'Mistérios guardados influenciaram tua trajetória; o acaso passado tinha propósito.',
  'O véu é fino; segredos revelam-se — sorte e destino entrelaçam-se agora.',
  'Revelação misteriosa vem; o desconhecido mostrará face — aceita o enigma.',
  'Perthro: o copo de dados — lance dos Norns sobre tua wyrd. O que está oculto será revelado.'),

(15, 'ᛉ', 'Algiz', 'Z', ARRAY['proteção', 'alerta', 'espiritual'],
  'Proteção espiritual, alerta vigilante, conexão com o divino.',
  'Guardas sagrados protegeram-te; defesas antigas ainda veiam por tua alma.',
  'Estás protegido; mantém vigilância — escudo espiritual ergue-se ao teu redor.',
  'Proteção virá; aliados invisíveis guardarão tua jornada — permanece alerta.',
  'Algiz: os chifres do alce — antenas para o divino, defesa sagrada. Ergue tuas mãos aos céus.'),

(16, 'ᛊ', 'Sowilo', 'S', ARRAY['vitória', 'claridade', 'sol'],
  'Vitória conquistada, claridade solar, energia radiante.',
  'Luz iluminou teu caminho; vitórias passadas brilham como sol em tua história.',
  'Triunfo é teu; clareza total dissipa dúvidas — poder solar fortalece-te.',
  'Sucesso radiante vem; vitória inevitável aproxima-se como amanhecer dourado.',
  'Sowilo: a roda solar — luz invencível que nunca falha. Brilha com certeza absoluta.'),

(17, 'ᛏ', 'Tiwaz', 'T', ARRAY['justiça', 'honra', 'sacrifício'],
  'Justiça equilibrada, honra guerreira, sacrifício necessário.',
  'Sacrifícios fizeste; honra passada cimentou teu caráter com justiça.',
  'Tua causa é justa; luta com honra — vitória virá através de retidão.',
  'Sacrifício será exigido; justiça pedirá preço — paga-o com coragem.',
  'Tiwaz: a lança de Tyr — justiça que custa mão. Sacrifica pelo que é certo.'),

(18, 'ᛒ', 'Berkano', 'B', ARRAY['crescimento', 'nascimento', 'renascimento'],
  'Crescimento orgânico, nascimento, renascimento cíclico.',
  'Semente antiga germinou; nascimentos passados iniciaram ciclos ainda vivos.',
  'Cresces e floresces; energia de nascimento pulsa — nutre o que brota.',
  'Novo início vem; renascimento espera-te — vida nova emergirá.',
  'Berkano: a bétula da primavera — crescimento tenro após inverno longo. Renasce em verde.'),

(19, 'ᛖ', 'Ehwaz', 'E', ARRAY['parceria', 'movimento', 'progresso'],
  'Movimento conjunto, parceria leal, progresso harmonioso.',
  'Caminhaste acompanhado; parcerias passadas aceleraram tua jornada.',
  'Moves-te com outro; confiança mútua impulsiona progresso — cavalo e cavaleiro unidos.',
  'Colaboração virá; nova aliança levará-te mais longe e mais rápido.',
  'Ehwaz: o cavalo gêmeo — dois que se movem como um. Avança em parceria confiada.'),

(20, 'ᛗ', 'Mannaz', 'M', ARRAY['humanidade', 'ego', 'sociedade'],
  'Humanidade compartilhada, ego individual, sociedade coletiva.',
  'Tua humanidade foi forjada; interações sociais passadas definiram teu lugar.',
  'Conhece-te a ti mesmo; tua identidade manifesta-se em relação aos outros.',
  'Consciência social expande; compreenderás melhor teu papel na teia humana.',
  'Mannaz: a medida do homem — ser individual dentro da tribo. És parte do todo.'),

(21, 'ᛚ', 'Laguz', 'L', ARRAY['intuição', 'fluxo', 'emocional'],
  'Intuição profunda, fluxo emocional, águas do inconsciente.',
  'Águas passadas moldaram-te; intuições anteriores revelaram verdades emocionais.',
  'Flui com a corrente; emoções e instintos guiam-te — confia no fluxo.',
  'Onda emocional vem; deixa intuição navegar-te por águas profundas.',
  'Laguz: o lago profundo — águas que ocultam mistérios. Mergulha em tua intuição.'),

(22, 'ᛜ', 'Ingwaz', 'Ng', ARRAY['potencial', 'semente', 'gestação'],
  'Potencial oculto, semente plantada, gestação silenciosa.',
  'Semente foi plantada; potencial acumulado espera germinação desde então.',
  'Gestação em curso; algo cresce em segredo — paciência até o nascimento.',
  'Potencial manifestará; o que está oculto brotará em tempo certo.',
  'Ingwaz: a semente do deus — potencial completo em forma diminuta. O que espera explodirá.'),

(23, 'ᛞ', 'Dagaz', 'D', ARRAY['transformação', 'ruptura-dia', 'despertar'],
  'Ruptura do dia, transformação súbita positiva, despertar.',
  'Amanhecer rompeu trevas; transformações passadas trouxeram claridade radical.',
  'Despertas agora; luz rompe escuridão — mudança positiva instantânea.',
  'Grande despertar vem; dia romperá noite — transformação iluminadora súbita.',
  'Dagaz: o limiar do dia — noite que vira luz em instante. Atravessa para claridade total.'),

(24, 'ᛟ', 'Othala', 'O', ARRAY['herança', 'lar', 'tradição'],
  'Herança ancestral, lar sagrado, tradição preservada.',
  'Herança moldou-te; tradições ancestrais deram-te fundação sólida.',
  'Teu lar é sagrado; honra tradições — raízes nutrem tua árvore.',
  'Retorno ao lar vem; herança será recebida ou reconhecida — raízes chamam.',
  'Othala: a propriedade sagrada — terra dos ancestrais que não se vende. Tuas raízes são eternas.')
ON CONFLICT (id) DO NOTHING;