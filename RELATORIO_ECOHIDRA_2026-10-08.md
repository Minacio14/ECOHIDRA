# Relatório — novo website focado em água e ambiente (ECOHIDRA)

Data: 2026-10-08 · Pasta: `C:\Users\inaci\Desktop\Freelancing\website_hydro` · Live: https://ecohidra.vercel.app

## 1. Resumo

- O site SIGHA (`website_sigha`, https://sigha-kappa.vercel.app) **não foi alterado** e continua no ar. Verificado depois do deploy.
- Foi criada uma cópia (`website_hydro`), reescrita só para **hidrologia, hidráulica, hidrogeologia e ambiente**, com identidade visual própria, e publicada num **projecto Vercel novo** (`ecohidra`, id `prj_9hwRft2G…`, distinto do `sigha`, id `prj_fJIpNQd8…`).
- Nome escolhido: **ECOHIDRA** (proposta sua). Texto sem "Lda.", sem geotecnia, sem referências ao registo da empresa. Apresenta-se como **consultoria independente**.
- Estado do GitHub: **pendente** (ver §7). O deploy foi feito pela Vercel CLI, que já estava autenticada.

## 2. Sugestões de nome e sigla (foco água + ambiente)

| # | Nome | Sigla / significado | Pontos fortes | Pontos de atenção |
|---|---|---|---|---|
| 1 | **HIDRA** | **Hi**drologia, **Dr**áulica e **R**ecursos **A**mbientais | curto, memorável, funciona em PT/EN | nome comum, mais difícil de registar/pesquisar |
| 2 | **ZAMHYDRO** | **Zam**beze **Hydro** & Environment (ZHE) | identidade regional (Tete/Zambeze), distintivo | liga a marca a uma geografia |
| 3 | **AQUAMBI** | **AQUA** + **AMBI**ente + Integrado | invulgar, fácil de pesquisar, soa a marca | menos óbvio para quem não lê "aqua" |
| ★ | **ECOHIDRA** (escolhido) | **ECO**logia + **HIDRA**ulica/Hidrologia | diz logo "água + ambiente" | ver nota abaixo |

Nota sobre ECOHIDRA: uma pesquisa web rápida não encontrou empresa com este nome em Moçambique, Brasil ou Portugal. Existem nomes parecidos (Ecohidráulica S.L., em Espanha; EcoHydro Consulting LLC, nos EUA). **Isto não é uma verificação de marca.** Antes de gastar em cartões, domínio `.co.mz` ou logótipo, confirmar disponibilidade (domínio, redes sociais e, se vier a registar, o IPI/Registo de marcas).

Para mudar de nome: editar `site.config.json` (`brand`, `brandFullPt`, `brandFullEn`, `siteUrl`) e correr `node build.mjs`. O URL Vercel só muda criando outro projecto ou renomeando o actual.

## 3. O que foi feito

1. **Clonagem** de `website_sigha` para `website_hydro`, **sem** `.vercel` (evita ligar ao projecto `sigha` por engano) e **sem** `studies/dam-break-analysis` (2,7 GB de DEMs e GeoPackages; já estava excluído do deploy original). O site gerado (`dist/`) pesa ~3 MB.
2. **Nova arquitectura** (sem dependências): `site.config.json` + `build.mjs` + `src/` (páginas, partials, CSS, JS) → `dist/`. A Vercel corre `node build.mjs`.
3. **Novo design** (ligeiramente diferente do SIGHA):

| | SIGHA | ECOHIDRA |
|---|---|---|
| Fundo | branco | papel creme (#f7f3ea) |
| Cores | azul-marinho + ciano | verde-azulado profundo + aqua + terracota |
| Tipografia | Inter | Fraunces (títulos serifados) + Manrope |
| Hero | foto de fundo com overlay | grelha em duas colunas com ilustração SVG de bacia hidrográfica animada |
| Serviços | separadores + cartões | lista numerada em linhas |
| Extras | — | faixa de ferramentas, "como decorre um projecto", bloco Água & Ambiente, botões em pílula |

4. **Conteúdo só de água/ambiente**: 6 áreas (hidrologia e cheias; drenagem e estruturas hidráulicas; hidrogeologia; água na mineração e indústria; ambiente e qualidade da água; dados, revisão e formação). Geotecnia, geofísica e transporte removidos. Bilingue PT/EN mantido.
5. **Formulário de contacto corrigido**: no site SIGHA o formulário era falso (mostrava "mensagem recebida" sem enviar nada). No novo, abre o e-mail do visitante já preenchido (e WhatsApp, se configurado).
6. Melhorias técnicas: URLs limpos, `sitemap.xml`, `robots.txt`, favicon, meta/OG, skip-link, menu mobile, `prefers-reduced-motion`.
7. **Verificação**: desktop e mobile (375 px) sem scroll horizontal; PT/EN; menu mobile; 13 URLs do live com HTTP 200; pesquisa por termos proibidos no `dist/` sem resultados.

## 4. Decisões de conteúdo (importante)

Aplicaram-se as correcções que a sua própria auditoria (`HANDOFF_CLAUDE_CODE_2026-10-07.md`, §5.6) previa para o site, e manteve-se o tom impessoal e a protecção do método do `AGENTS.md` (sem flopy, ras-commander, "via Python", etc.).

**Publicado: apenas 1 estudo (N1).** Ficaram de fora, de propósito:

| Estudo | Motivo |
|---|---|
| Cahora Bassa (ruptura) | a auditoria recomenda retirar até refazer; volume do reservatório e equações de brecha inadequadas |
| Mookane / MODFLOW | página e folha mostram "Botswana", falha "Zoetfontein", coordenadas UTM (confidencialidade, auditoria §3.4) |
| Rovubué (risco de cheia) | extensão quase não varia com o caudal (+4% com Q×2); página cita HEC-RAS/HMS que não foram usados |
| Al_B (aqueduto) | declive 1,7% vs 0,4% no talvegue; com 0,4% o Ø requerido sobe a ~1,8 m, e a folha recomenda Ø1,50 m; "controlo à entrada" não calculado |
| CVE (condomínio) | nome de cliente na folha; Q fixos vindos de um PPTX; declive abaixo do erro vertical do DEM |

As páginas e imagens destes estudos **continuam em `website_sigha`**; não foram copiadas para o novo repositório (assim os nomes de clientes não vão parar a um GitHub público).

**Correcções feitas no N1** (verificadas contra os dados embebidos no dashboard):
- A tabela por classe de caudal estava **trocada** na página antiga (dizia 41 em 5–20 m³/s e 34 em 1–5). Os dados mostram **34 em 5–20 e 41 em 1–5**. Corrigido.
- "Método racional" para tudo → agora: racional para 82 travessias (< 2 km²) e SCS-CN para 7.
- "13 pontes necessárias" → "13 travessias com diâmetro equivalente > 2,0 m (gama de ponte ou aqueduto de caixa)" (o D_req é um diâmetro circular equivalente, não um calado).
- "Validado em campo" removido; "gaps" explicado como inventário simulado.
- Removidos do dashboard: nomes internos do motor/dimensionamento, e a linha de tempos de cálculo.
- Rodapé "SIGHA, Lda." apagado das duas folhas PNG (PT/EN).

## 5. Pendências antes de promover o site (por ordem de importância)

1. **Revalidação do N1.** A auditoria mostra que só 7 dos 89 cruzamentos foram comparados com HMS/RAS; o declive em graus é tratado como %. A página usa a redacção "estudo demonstrativo / rastreamento", mas os números continuam sujeitos à revalidação.
2. **Folha N1 e dashboard ainda têm o rótulo "Crítico/Alto" em inglês/mistura e "CRITICAL/HIGH"** no painel; foi só rebrandizado, não redesenhado.
3. **Texto "Eu/nós":** o site fala em 3.ª pessoa ("A ECOHIDRA…"). Falta uma **pessoa visível** (nome, perfil, foto ou LinkedIn) na página Sobre, que num freelancer aumenta a confiança. Não o adicionei por não saber como quer aparecer.
4. **WhatsApp:** botão preparado, desactivado até indicar o número (`site.config.json` → `whatsapp`).
5. **E-mail público:** `inacio.mrcs@gmail.com` está visível no site (confirmado por si). Um e-mail com o domínio próprio (quando existir) fica mais profissional.
6. **Domínio próprio** (ex. `ecohidra.co.mz`/`.com`): não registado.
7. **Enquadramento fiscal/legal:** prestar serviços sem empresa funciona bem em plataformas internacionais, mas clientes mineiros e de infraestrutura em Moçambique normalmente pedem NUIT e facturação. O site já evita "Lda." e "empresa registada"; convém confirmar com um contabilista o enquadramento aplicável (ex. contribuinte singular) antes de assinar contratos locais.
8. **Novos estudos:** quando os restantes forem revalidados, reintroduzir copiando de `website_sigha` e anonimizando nomes (ver §4).

## 6. Deploy

- Projecto Vercel novo: `ecohidra` (equipa `inaciomrcs-3685s-projects`).
- Produção: https://ecohidra.vercel.app (alias automático); deployment `dpl_Gik5gmhj…`, estado *Ready*.
- O site SIGHA (`https://sigha-kappa.vercel.app`) foi reaberto depois do deploy e continua activo, com o mesmo título.
- Para republicar depois de editar: `node build.mjs` (para testar) e `vercel deploy --prod --yes` dentro de `website_hydro`.

## 7. GitHub (por fazer)

Não há `gh` instalado nem credenciais GitHub neste PC; a Vercel CLI usa um token próprio e por isso funcionou. O repositório git local já existe (branch `main`, autor configurado só neste repo como `Inaciomrcs <inacio.mrcs@gmail.com>`). Para publicar:

1. Criar um repositório **vazio** (de preferência privado) em https://github.com/new, sem README.
2. Executar na pasta `website_hydro`:

```bash
git remote add origin https://github.com/SEU_UTILIZADOR/ecohidra.git
git push -u origin main
vercel git connect https://github.com/SEU_UTILIZADOR/ecohidra.git
```

A partir daí, cada `git push` publica automaticamente.

## 8. Estrutura da pasta

```
website_hydro/
  site.config.json      marca, e-mail, WhatsApp, URL
  build.mjs             gerador estático (sem dependências)
  vercel.json           buildCommand + outputDirectory
  src/pages/            index, servicos, sobre, estudos, contacto, estudos/n1-*
  src/partials/         head, nav, footer, cta, logo
  src/css|js|img        estilo, comportamento, SVGs
  src/estudos-assets/   folhas do N1 (PT/EN)
```
