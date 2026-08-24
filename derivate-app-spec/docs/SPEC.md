# SPEC.md — Specifiche Funzionali

## 1. Obiettivo del prodotto

App web di apprendimento adattivo delle derivate per studenti di **fine quarta superiore scientifico** (16–17 anni). L'app:

- Organizza gli esercizi in **classi di problemi** con prerequisiti
- Adatta la difficoltà e l'ordine degli esercizi in base ai risultati dello studente
- Mostra per ogni regola la **dimostrazione completa dal limite del rapporto incrementale** (non solo la formula)
- Renderizza tutte le formule matematiche in **KaTeX**
- Persiste il progresso in **localStorage** (nessun backend, nessun login)
- Si deploya su **Vercel** come SPA statica

---

## 2. Utenti target

**Primario:** studente di fine quarta scientifico, 16–17 anni, che ha già studiato i limiti.

**Secondario:** docente che vuole assegnare il percorso come attività autonoma.

---

## 3. Feature list

### F-01 — Dashboard (Home)
- Griglia di card, una per classe di problemi
- Ogni card mostra: titolo classe, icona, numero esercizi, punti ottenuti, barra di progresso
- Classi bloccate mostrate con overlay `🔒` e tooltip "Completa prima: [prerequisito]"
- Classe in progress evidenziata con badge "In corso"
- Pannello laterale con statistiche globali: totale punti ⭐, esercizi completati/totali, percentuale successo
- Pulsante "Continua da dove hai lasciato" che porta all'ultimo esercizio non completato

### F-02 — Vista classe
- Header con titolo, descrizione, prerequisiti soddisfatti
- Lista esercizi in ordine adattivo (non completati prima, poi per difficoltà)
- Ogni esercizio: titolo, chip difficoltà colorato, stato (○ non fatto / ✓ corretto / ~ parziale / ✗ sbagliato), punti ottenuti
- Badge dorato 📐 su esercizi che hanno la dimostrazione dal limite
- Pulsante "Inizia classe" / "Continua" / "Riprova"
- Chip prerequisiti in alto: verde se soddisfatti

### F-03 — Vista esercizio
- **Header**: breadcrumb Classe > Esercizio N/Totale, chip difficoltà, tag
- **Pannello problema** (sfondo scuro `#1C1C2E`): testo con KaTeX, pulsante "💡 Suggerimento" (collassabile)
- **Tentativo-counter**: 3 pallini colorati (grigio→verde/rosso), label "N tentativi rimasti"
- **Risposta a scelta multipla**: 4 opzioni (A B C D), ognuna in un `Card` MUI. La risposta corretta viene generata dal JSON, le 3 sbagliate pescate da un pool di distrattori (vedi DATA.md)
- **Azioni**: pulsante "Conferma risposta" (disabilitato finché non si seleziona), pulsante "Mostra soluzione" (penalizza −1 pt)
- **Feedback immediato**: `Alert` MUI verde/rosso con messaggio, animazione
- **Sezione dimostrazione** (collapsable `Accordion` MUI, sfondo amber chiaro): passaggi numerati, ogni passo ha label + formula KaTeX in card scura + spiegazione. Badge "+1 pt bonus" per aprirla dopo aver risposto
- **Sezione soluzione** (collapsable `Accordion`): steps numerati con formula e spiegazione
- **Navigazione**: ← Precedente / N di M / Successivo → in basso

### F-04 — Schermata risultati classe
- Emoji + titolo motivazionale basato su score %
- Score totale grande, max ottenibile, percentuale
- Tabella riepilogativa per ogni esercizio: titolo, score, tentativi usati, badge dimostrazione vista
- Messaggi adattativi: eccellente (≥80%), buono (≥55%), da ripassare (<55%)
- Azioni: "Prossima classe →", "Ripeti classe", "Dashboard"

### F-05 — Progressione adattiva
- Vedi `docs/ADAPTIVE.md` per l'algoritmo completo
- La classe si sblocca quando tutti i prerequisiti sono completati
- L'ordine degli esercizi nella classe è: non completati prima (per difficoltà crescente), poi completati (per score crescente — ripeti quelli con score basso)

### F-06 — Persistenza localStorage
- Tutto il progresso salvato in `localStorage` con chiave `deriv_progress_v3`
- Struttura: vedi `docs/DATA.md`
- Pulsante "Reset progresso" in Settings con confirm dialog
- Export/Import JSON del progresso (bonus feature)

### F-07 — Rendering matematico (KaTeX)
- Tutte le formule nel JSON sono in sintassi LaTeX
- Usare il componente `react-katex` (`<InlineMath>` e `<BlockMath>`)
- Le formule inline nel testo usano delimitatori `\(...\)` e vengono parse prima del render
- Le formule display usano `$$...$$`

### F-08 — Impostazioni
- Toggle tema chiaro/scuro (MUI `createTheme`)
- Reset progresso con confirm
- Info versione app e link GitHub (placeholder)

---

## 4. User Stories

### US-01 — Prima visita
> Come studente alla prima visita, voglio vedere immediatamente quali classi di esercizi esistono e da dove iniziare, così da non perdere tempo.

**Criteri di accettazione:**
- Dashboard visibile senza login
- Prima classe sempre sbloccata
- Call to action "Inizia da qui →" sulla prima card
- Tempo al primo esercizio < 3 click

### US-02 — Progressione lineare
> Come studente, voglio sapere quando posso passare all'argomento successivo, così da seguire un percorso strutturato.

**Criteri di accettazione:**
- Classi bloccate chiaramente indicate
- Sblocco automatico dopo completamento prerequisiti
- Notifica visiva quando si sblocca una nuova classe (Snackbar MUI)

### US-03 — Feedback immediato
> Come studente, voglio sapere subito se ho risposto bene, e capire perché nel caso sbagliassi.

**Criteri di accettazione:**
- Feedback visivo immediato dopo "Conferma risposta"
- Se sbagliato: evidenzia la risposta sbagliata in rosso, non rivela la corretta (solo dopo esaurimento tentativi)
- Dopo tutti i tentativi o soluzione mostrata: evidenzia la corretta in verde

### US-04 — Capire il perché
> Come studente, voglio vedere come si ricava una regola dal limite del rapporto incrementale, non solo memorizzarla.

**Criteri di accettazione:**
- Accordion "📐 Dimostrazione dal limite" presente su 16+ esercizi
- Passaggi numerati con formula + spiegazione in linguaggio semplice
- Bonus 1 pt per aprirla dopo aver risposto (incentivo a leggerla, non a copiarla)
- Badge "📐" visibile nella lista esercizi della classe

### US-05 — Continuità tra sessioni
> Come studente, voglio riprendere da dove ho lasciato, anche giorni dopo.

**Criteri di accettazione:**
- Progress salvato automaticamente in localStorage
- Dashboard mostra stato aggiornato al caricamento
- Pulsante "Continua" porta all'ultimo esercizio non completato
- Nessun dato perso al refresh della pagina

### US-06 — Ripasso adattivo
> Come studente con risultati bassi in una classe, voglio che l'app mi suggerisca di ripassare prima di andare avanti.

**Criteri di accettazione:**
- Se score < 55% alla fine di una classe: Alert giallo con suggerimento "Considera di ripassare..."
- Possibilità di ripetere gli esercizi con score 0 (ordine adattivo li mette per primi)

---

## 5. Flussi principali

### Flusso 1 — Prima visita
```
Landing (Dashboard) → Vede classi → Click "Inizia da qui" 
→ Vista Classe (lista esercizi) → Click esercizio 
→ Vista Esercizio → Risponde → Feedback 
→ Prossimo esercizio → ... → Fine classe 
→ Schermata Risultati → Sblocco classe successiva
```

### Flusso 2 — Ritorno utente
```
Landing (Dashboard) → Vede progresso → Click "Continua" 
→ Apre l'ultimo esercizio non completato
```

### Flusso 3 — Studio approfondito
```
Vista Esercizio → Risponde correttamente 
→ Apre "Dimostrazione dal limite" (Accordion)
→ Legge tutti i passi → Riceve +1 pt bonus
→ Apre "Soluzione passo per passo"
→ Naviga al prossimo
```

---

## 6. Requisiti non funzionali

| Requisito | Target |
|-----------|--------|
| Performance | LCP < 2.5s su connessione 3G |
| Accessibilità | WCAG 2.1 AA (aria-labels, focus management, contrasto ≥ 4.5:1) |
| Mobile | Usabile su tablet (≥768px), ottimale su desktop |
| Browser | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| Offline | Service Worker non richiesto; localStorage sufficiente |
| SEO | meta tags base + og:image (app è SPA, no SSR necessario) |

---

## 7. Out of scope (v1)

- Autenticazione / account utente
- Backend / database
- Classi di esercizi dinamiche da CMS
- Modalità docente (dashboard studenti, assegnazione)
- Gamification avanzata (badges, leaderboard)
- Audio / TTS
- Editor LaTeX per studente
