<p align="center">
  <strong>🇳🇴 Bokmål</strong> ·
  <a href="README-en.md">🇬🇧 English</a> ·
  <a href="README-tr.md">🇹🇷 Türkçe</a>
</p>

# Urd

Dette repoet ER nettsiden din: en avhengighetsfri, statisk side der `/admin` er den visuelle editoren. Ingen bygging, ingen npm - det som ligger her, er det som serveres.

## Kom i gang

1. **Lag ditt eget repo** fra denne malen («Use this template» på GitHub).
2. **Koble repoet til en host** (Cloudflare Pages anbefales) og sett opp publisering: følg [oppsettsguiden](https://github.com/Artiscow/Urd/blob/main/docs/OPPSETT-PUBLISERING.md) ([English](https://github.com/Artiscow/Urd/blob/main/docs/languages/setup-publication/SETUP-en-GB.md)).
3. **Åpne `/admin`** på den deployerte siden og logg inn med GitHub: oppsettsveiviseren hjelper deg med navn og farger, og alt du publiserer committes i ditt eget repo.

Lokal titt uten host: kjør en statisk server fra denne mappen (f.eks. `python3 -m http.server`) og åpne `http://localhost:8000/`. Publisering krever host-funksjonene, men editoren og forhåndsvisningen virker lokalt.

## Oppdatere Urd

Åpne **Oppdatering**-panelet i admin: det sjekker mot malrepoet, viser hva som endres (håndredigerte filer varsles), og skriver den nye versjonen som én samlet commit. `_headers` oppdateres aldri automatisk; panelet viser hva som eventuelt skal føres inn for hånd.

## Innhold og struktur

- `content/` er innholdet ditt (sider, tema, samlinger) - alt admin skriver, ligger her og i `media/`.
- `plugins/` er utvidelser: legg inn en plugin-mappe og aktiver den i Plugins-panelet. Se [plugins/README.md](plugins/README.md); flere finnes via GitHub-topicen `urd-plugin`.
- `assets/engine/` og `admin/` er Urd selv og oppdateres av Oppdatering-panelet; rør dem ikke for hånd.

## Dokumentasjon

[Brukerveiledning](https://github.com/Artiscow/Urd/blob/main/docs/BRUKERVEILEDNING.md) og full dokumentasjon i [hovedrepoet](https://github.com/Artiscow/Urd), med oversettelser under [docs/languages/](https://github.com/Artiscow/Urd/tree/main/docs/languages).
