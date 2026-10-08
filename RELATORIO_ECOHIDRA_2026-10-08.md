# Relatório — novo website focado em água e ambiente (ECOHIDRA)

Data: 2026-10-08 · Pasta: `C:\Users\inaci\Desktop\Freelancing\website_hydro` · Live: https://ecohidra.vercel.app

## 1. Resumo

- O site SIGHA (`website_sigha`, https://sigha-kappa.vercel.app) **não foi alterado** e continua no ar. Verificado depois do deploy.
- Foi criada uma cópia (`website_hydro`), reescrita só para **hidrologia, hidráulica, hidrogeologia e ambiente**, com identidade visual própria, e publicada num **projecto Vercel novo** (`ecohidra`, id `prj_9hwRft2G…`, distinto do `sigha`, id `prj_fJIpNQd8…`).
- Nome escolhido: **ECOHIDRA** (proposta sua). Texto sem "Lda.", sem geotecnia, sem referências ao registo da empresa. Apresenta-se como **consultoria independente**.
- GitHub: https://github.com/Minacio14/ECOHIDRA (ver §7). O deploy foi feito pela Vercel CLI, que já estava autenticada.

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

## 4. Segunda fase (mesmo dia): o que mudou depois das suas instruções

- **Estudos reintroduzidos (6):** N1, condomínio (drenagem), aqueduto Al_B, risco de cheia do Rovubué, ruptura de barragem (Cahora Bassa, cenário hipotético) e águas subterrâneas (mina a céu aberto). Convertidos para o novo design, com URLs `/estudos/...`, links entre estudos corrigidos e o "SIGHA, Lda." apagado das 10 folhas PNG (PT/EN). O retrabalho científico dos estudos fica na outra sessão; aqui só se actualizam os ficheiros quando estiverem prontos.
- **Correcções feitas na N1** (verificadas contra os dados do dashboard): tabela por classe de caudal estava trocada (34 em 5–20 m³/s; 41 em 1–5), método racional só para 82 travessias (< 2 km²) e SCS-CN para 7, "pontes necessárias" passou a "diâmetro equivalente > 2,0 m", removida a frase "validado em campo", removidos do dashboard os nomes internos do motor e os tempos de cálculo.
- **Página Sobre redesenhada** em torno de si: retrato, nome, título, factos (4+ anos, PT/EN, Tete, HEC/MODFLOW), "como trabalho" em primeira pessoa, experiência representativa anonimizada (retirada do seu perfil Freelancer, sem mencionar a camada de automação) e dados de facturação. Inclui dados estruturados `Person` para pesquisa.
- **WhatsApp +258 84 553 3050** activo: botão flutuante em todas as páginas, botões na página Sobre e no formulário, e linha no rodapé e no contacto.
- **NUIT 125937586** e o seu nome aparecem no rodapé, no contacto e em Sobre.
- **Rodapé e contacto:** e-mail, WhatsApp, localização, nome e NUIT.

### Pontos a confirmar
1. **Nome completo.** Usei "Marcos Inácio" (nome do perfil Freelancer + e-mail/GitHub). Se for outro, alterar `owner` em `site.config.json`.
2. **Foto.** Usei o recorte da sua foto de perfil do Freelancer (`src/img/marcos.jpg`, 500 px). Para trocar, substituir o ficheiro. Não usei a imagem `Images\FreeL.jpeg` porque é a fotografia de verificação de identidade (mostra o BI e um código).
3. **LinkedIn.** Sem URL; o botão fica escondido até preencher `linkedin` em `site.config.json`.
4. **NUIT público.** O NUIT pessoal está visível no site. Quando tiver o enquadramento definitivo, mudar ou remover `nuit` no config.
5. **Dados dos estudos.** As folhas e páginas incluem nomes e locais (Botswana/falha Zoetfontein e coordenadas UTM na folha de águas subterrâneas, condomínio Vale dos Embondeiros, acesso ao Alojamento B). Isto é igual ao site SIGHA. Se o repositório GitHub for público, esses ficheiros ficam públicos também.

## 5. Pendências técnicas (sessão de retrabalho dos estudos)

Itens da auditoria de 2026-10-07 que continuam por refazer: revalidação da N1 (só 7 de 89 cruzamentos comparados com HMS/RAS; declive em graus tratado como %), declive e controlo do aqueduto Al_B, Q fixos do CVE, extensão de inundação do Rovubué quase invariável com o caudal, volume do reservatório e equações de brecha de Cahora Bassa, e anonimização do estudo MODFLOW. As páginas "Ruptura de barragem" e "Água subterrânea" ainda trazem frases como "PAEBM" que a auditoria sugeria rever.

Questões não técnicas: nome ECOHIDRA (verificar marca/domínio), domínio próprio, e-mail com domínio próprio, e enquadramento fiscal.

## 6. Deploy

- Projecto Vercel novo: `ecohidra` (equipa `inaciomrcs-3685s-projects`).
- Produção: https://ecohidra.vercel.app (alias automático); deployment `dpl_Gik5gmhj…`, estado *Ready*.
- O site SIGHA (`https://sigha-kappa.vercel.app`) foi reaberto depois do deploy e continua activo, com o mesmo título.
- Para republicar depois de editar: `node build.mjs` (para testar) e `vercel deploy --prod --yes` dentro de `website_hydro`.

## 7. GitHub

Repositório: https://github.com/Minacio14/ECOHIDRA (remote `origin` já configurado, branch `main`). O `git push` abre o login do GitHub no navegador (Git Credential Manager); após autenticar, o push conclui. Depois, para publicar automaticamente em cada push:

```bash
vercel git connect https://github.com/Minacio14/ECOHIDRA.git
```

## 8. Estrutura da pasta

```
website_hydro/
  site.config.json      marca, e-mail, WhatsApp, URL
  build.mjs             gerador estático (sem dependências)
  vercel.json           buildCommand + outputDirectory
  src/pages/            index, servicos, sobre, estudos, contacto, estudos/*
  src/partials/         head, nav, footer, cta, logo
  src/css|js|img        estilo, comportamento, SVGs
  src/estudos-assets/   folhas e figuras dos 6 estudos (PT/EN)
  src/img/marcos.jpg    retrato (página Sobre)
```
