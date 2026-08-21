# Analisi critica narrativa — sito didattico sulle derivate

## Metodo e perimetro

Analisi svolta il 21 agosto 2026 navigando la SPA pubblicata con Playwright e Chromium, non tramite fetch dell'HTML. Ho percorso le 11 sezioni nell'ordine dichiarato, aperto dimostrazioni, correzioni, schede e soluzioni, manipolato slider e grafici, usato i fogli digitali, completato tutte le 27 domande adattive e confrontato un ramo corretto con uno volutamente errato. Ho inoltre verificato ritorno indietro, refresh, risposta non confermata, import malformato e persistenza del progresso, su viewport 1440×1000 e 390×844.

Le acquisizioni sono in [`screenshots/`](screenshots/) e i dump in [`contenuti/`](contenuti/). I conteggi testuali sono approssimativi e riferiti al contenuto principale visibile; quando si aprono accordion e soluzioni aumentano sensibilmente. Nei dump testuali le formule KaTeX compaiono talvolta due volte per via del testo accessibile, mentre negli screenshot sono renderizzate una sola volta.

Limite dichiarato: il comando di stampa è stato attivato e verificato, ma non ho valutato il foglio fisico prodotto dal dialogo di sistema, perché non rilevante per la narrativa didattica.

## Mappa del percorso

### Corso guidato

| Ordine | Sezione | Concetto e funzione narrativa | Interazione | Testo approssimativo |
|---:|---|---|---|---:|
| 1 | Velocità istantanea | Problema-innesco della caduta; dalla velocità media alla domanda sull'istante | Approfondimento storico, completamento manuale | ~286 parole |
| 2 | Geometria | Secante che converge alla tangente; rapporto incrementale come pendenza | 4 funzioni, slider `x₀` e `h`, animazione `h → 0`, approfondimento | ~398 parole |
| 3 | Definizione formale | Definizione in un punto, distinzione `f′(x₀)`/`f′(x)`, notazioni, prime tre derivate | 3 dimostrazioni ad accordion, approfondimento | ~563 parole chiuse; ~923 aperte |
| 4 | Derivabilità | Derivabilità ⇒ continuità; punto angoloso, cuspide, tangente verticale | 7 funzioni, slider `x₀` e `h`, animazione | ~391 parole |
| 5 | Interpretazione fisica | Ricomposizione delle letture geometrica, analitica e fisica | Approfondimento, domanda orale finale | ~270 parole |
| 6 | Warm-up | Recupero della lezione 1 prima delle regole | 3 domande con correzione apribile | ~94 parole chiuse; ~228 aperte |
| 7 | Derivate fondamentali | Tabella di costante, potenza, esponenziale, logaritmo, seno e coseno | 3 dimostrazioni ad accordion, approfondimento | ~423 parole chiuse; ~915 aperte |
| 8 | Regole di derivazione | Linearità, prodotto, quoziente e catena | 4 dimostrazioni, 2 approfondimenti | ~573 parole chiuse; ~1.133 aperte |
| 9 | Derivata seconda | Concavità, accelerazione, flessi, curvatura locale | 4 funzioni, slider, animazione, cerchio osculatore | ~726 parole |
| 10 | Taylor · opzionale | Polinomio locale, centro, ordine ed errore | 3 funzioni, pan/zoom/reset, slider centro e ordine 0–7 | ~911 parole |
| 11 | Teoremi · appendice | Fermat, Rolle, Lagrange, monotonia, convessità e strumenti avanzati | 10 schede, laboratorio Rolle/Lagrange, 2 slider, 5 approfondimenti | ~832 parole chiuse; ~1.903 aperte |

### Materiali e ramo adattivo

| Materiale | Contenuto | Interazione | Testo approssimativo |
|---|---|---|---:|
| Scheda §1 | 5 esercizi su definizione, tangenti e derivabilità | Soluzioni guidate, fogli digitali, stampa | ~304 parole; ~1.028 con soluzioni |
| Scheda §2 | 6 esercizi su formule, prodotto, quoziente, catena e seconda derivata | Soluzioni guidate, fogli digitali, stampa | ~355 parole; ~1.340 con soluzioni |
| Verifica finale | 4 problemi, 30 punti, 45 minuti | Fogli digitali, soluzioni, stampa | ~311 parole; ~1.507 con soluzioni |
| Esercizi adattivi | 7 classi: rapporto incrementale, potenze, funzioni elementari, prodotto, quoziente, catena, applicazioni | 27 quiz a scelta multipla, suggerimenti, tentativi, dimostrazioni e punteggio | 27 schermate individuali |

Il percorso adattivo corretto ha sbloccato potenze e funzioni elementari dopo la prima classe. Il percorso completamente errato ha prodotto lo stesso sblocco: la differenza percepibile è stata il punteggio, la percentuale “corretti al primo colpo” e il messaggio “Ripasso consigliato”, non il blocco del percorso.

## 1. Aggancio ai prerequisiti

### Rilievo 1 — Il ponte limite–derivata è esplicito e narrativamente leggibile

- **Evidenza**: la prima sezione formula la velocità media come `(s(t+h)−s(t))/h`, precisa “Rendiamo l'intervallo sempre più piccolo, senza porlo uguale a zero” e conclude: “È esattamente il tipo di domanda a cui risponde un limite”. La sezione seguente trasforma lo stesso rapporto nella pendenza della secante. Vedi [velocità](screenshots/desktop/01-velocita.png) e [geometria](screenshots/desktop/02-geometria.png).
- **Problema**: nessun problema didattico rilevante in questo raccordo; il rapporto incrementale non è dato per scontato e il passaggio da intervallo a istante è dichiarato.
- **Impatto**: basso.
- **Direzione di miglioramento**: preservare questa catena verbale e simbolica come asse dell'intero corso, soprattutto quando si introducono le regole operative.

### Rilievo 2 — Il prerequisito “limite” viene richiamato, ma non riattivato

- **Evidenza**: nella sezione iniziale il sito passa direttamente dalla formula della velocità media alla frase “quando `h` si avvicina a zero”; non propone una tabella numerica, un confronto `h=1, 0,1, 0,01` o una domanda diagnostica prima della geometria. Il primo esercizio numerico di questo tipo compare solo come quinto elemento della classe adattiva (“Rapporto incrementale — calcolo numerico”).
- **Problema**: uno studente che “ha appena finito i limiti” può riconoscere la notazione senza aver riattivato il significato operativo di convergenza. La narrativa afferma il ponte invece di farlo attraversare allo studente.
- **Impatto**: medio.
- **Direzione di miglioramento**: inserire nel problema iniziale una breve previsione e una tabella di velocità medie su intervalli decrescenti, prima di nominare la derivata; chiedere che cosa sembra stabilizzarsi e perché `h=0` resta escluso.

### Rilievo 3 — I limiti notevoli sono usati come scatole nere proprio quando dovrebbero sostenere la continuità narrativa

- **Evidenza**: le dimostrazioni di seno ed esponenziale terminano con “Il limite notevole vale 1” e “Usiamo il limite notevole dell'esponenziale”; la potenza usa il binomio di Newton e il seno introduce “PROSTAFERESI”. Vedi [dimostrazioni della definizione](screenshots/interazioni/03-definizione-dimostrazioni.png) e il [dump completo](contenuti/interazioni/03-definizione-dimostrazioni.txt).
- **Problema**: il sito promette di costruire “senza saltare i passaggi”, ma non verifica che questi limiti notevoli e identità trigonometriche siano disponibili. Per il target il salto non è solo formale: cambia contemporaneamente tecnica algebrica, identità trigonometrica e nuovo concetto.
- **Impatto**: alto.
- **Direzione di miglioramento**: anteporre una micro-sezione di riattivazione dei due limiti notevoli e indicare esplicitamente quali risultati sono prerequisiti accettati e quali vengono dimostrati nel corso.

## 2. Motivazione prima del formalismo

### Rilievo 1 — Il problema-innesco è credibile, ma resta raccontato invece di essere vissuto

- **Evidenza**: il corso apre con “come possiamo misurare il movimento in un istante che non ha durata?” e usa caduta libera e tachimetro; tuttavia la prima schermata non contiene dati, slider o una scelta dello studente. L'unica interazione è l'approfondimento storico su Galileo. Vedi [sezione 1](screenshots/desktop/01-velocita.png).
- **Problema**: la domanda è autentica, ma lo studente non sperimenta il fallimento della velocità media né sente la necessità di un nuovo oggetto prima di riceverne la formula.
- **Impatto**: medio.
- **Direzione di miglioramento**: trasformare l'innesco in una piccola indagine: dare posizioni a tempi vicini, far scegliere l'intervallo e chiedere se il risultato possa essere “la” velocità nell'istante.

### Rilievo 2 — La panoramica anticipa subito tutte e tre le risposte

- **Evidenza**: prima di iniziare, la dashboard risponde già a “Cos'è la derivata?” con “Una pendenza”, “Un limite” e “Un tasso istantaneo”. Vedi [panoramica](screenshots/desktop/00-panoramica.png).
- **Problema**: non è un errore matematico, ma riduce la tensione narrativa: la domanda iniziale diventa una spiegazione da confermare, non una scoperta da costruire.
- **Impatto**: basso.
- **Direzione di miglioramento**: mantenere le tre carte come mappa, ma presentarle inizialmente come tre domande o tre prospettive da conquistare, completandole progressivamente.

### Rilievo 3 — Le applicazioni reali arrivano come esempi nominali, non come problemi risolti

- **Evidenza**: la chiusura della lezione 1 elenca velocità, corrente, crescita e costo marginale con una riga ciascuno; nessuno viene ripreso con dati o decisioni. Vedi [interpretazioni](screenshots/desktop/05-interpretazioni.png).
- **Problema**: il “perché serve” resta forte per il moto ma debole per gli altri contesti. Lo studente può ricordare quattro etichette senza sviluppare la capacità di riconoscere una grandezza e il suo tasso.
- **Impatto**: medio.
- **Direzione di miglioramento**: scegliere una seconda situazione non cinematica e far interpretare segno, unità di misura e valore della derivata, invece di moltiplicare esempi solo nominali.

## 3. Progressione concettuale

### Rilievo 1 — La prima macro-sequenza è coerente

- **Evidenza**: l'ordine è problema fisico → secante/tangente → definizione → non derivabilità → ricomposizione delle tre letture. Ogni sezione termina con un ponte esplicito alla successiva; la prima chiede “come troviamo la pendenza di una curva in un punto?”.
- **Problema**: nessun problema sostanziale nell'ordine della lezione 1.
- **Impatto**: basso.
- **Direzione di miglioramento**: conservare questa sequenza e usarla come criterio per ridurre i contenuti che non servono ancora alla domanda guida.

### Rilievo 2 — La definizione formale concentra troppi nuovi oggetti in 25 minuti

- **Evidenza**: la stessa sezione introduce definizione puntuale, differenza tra numero e funzione, quattro notazioni e tre derivazioni “obbligatorie”; passando da accordion chiusi ad aperti il testo cresce da circa 563 a 923 parole. Le dimostrazioni del seno e di `eˣ` richiedono identità e limiti notevoli. Vedi [schermata estesa](screenshots/interazioni/03-definizione-dimostrazioni.png).
- **Problema**: il carico cognitivo esplode proprio quando lo studente deve stabilizzare la differenza tra `f′(x₀)` e `f′(x)`. Notazioni storiche e tecniche di prova competono con il concetto centrale.
- **Impatto**: alto.
- **Direzione di miglioramento**: limitare questa sezione a definizione, significato e derivata di `x²`; spostare notazioni alternative e prove di seno/esponenziale nella lezione 2, dopo un recupero mirato dei prerequisiti.

### Rilievo 3 — La derivata del logaritmo usa strumenti introdotti dopo

- **Evidenza**: nella sezione “Derivate fondamentali” il logaritmo viene derivato scrivendo `y=ln x ⇔ x=eʸ`, poi “Deriva implicitamente”; il testo afferma che “la catena produce dy/dx”. La regola della catena viene però introdotta nella sezione successiva. Vedi [dimostrazioni fondamentali](contenuti/interazioni/07-fondamentali-dimostrazioni.txt).
- **Problema**: è una dipendenza circolare nella narrativa. Lo studente deve accettare differenziazione implicita e catena per giustificare una formula prima che entrambe siano costruite.
- **Impatto**: alto.
- **Direzione di miglioramento**: posticipare la derivata di `ln x` dopo la catena e la derivata dell'inversa, oppure dichiararla provvisoriamente come formula e dimostrarla in un ritorno successivo ben segnalato.

### Rilievo 4 — “Opzionale” e “verifica di base” si contraddicono

- **Evidenza**: Taylor è marcato “Approfondimento avanzato. Questa sezione non fa parte della verifica di base”; nella verifica finale, però, il problema 4 assegna 8 punti e chiede di “costruire il polinomio di Taylor di ordine 3”. La stessa verifica chiede la retta normale, concetto non sviluppato nelle 11 sezioni principali. Vedi [Taylor](screenshots/desktop/10-taylor.png) e [verifica](screenshots/desktop/14-verifica.png).
- **Problema**: lo studente non può fidarsi dei segnali di priorità. Un contenuto dichiarato escluso pesa oltre un quarto della prova, mentre un altro compare direttamente in verifica senza una tappa didattica dedicata.
- **Impatto**: alto.
- **Direzione di miglioramento**: rendere la verifica aderente al nucleo obbligatorio; spostare Taylor e normale in una sezione avanzata separata oppure insegnarli esplicitamente prima e rimuovere l'etichetta “non fa parte della verifica”.

### Rilievo 5 — Derivata seconda, curvatura e teoremi superano l'obiettivo introduttivo

- **Evidenza**: la derivata seconda introduce cerchio osculatore, curvatura `κ=f″/(1+(f′)²)^(3/2)` e raggio; l'appendice arriva a dieci teoremi e circa 1.903 parole con tutte le schede aperte. Vedi [derivata seconda](screenshots/desktop/09-derivata-seconda.png) e [teoremi estesi](screenshots/interazioni/11-teoremi-tutte-schede-rolle.png).
- **Problema**: per studenti appena usciti dai limiti, questi oggetti avanzati diluiscono il nucleo “derivata come tasso/pendenza” e anticipano molto materiale da quinta senza tempo di consolidamento.
- **Impatto**: medio.
- **Direzione di miglioramento**: fermare il percorso obbligatorio a concavità e accelerazione; collocare curvatura, Taylor e teoremi in moduli realmente facoltativi, non necessari al 100% del corso.

## 4. Registro linguistico e microcopy

### Rilievo 1 — Il registro guida spesso bene la lettura

- **Evidenza**: segnali come “Prima guarda, poi calcola”, “Un numero oppure una funzione?”, “Come si legge e quando si usa” e “Non devi memorizzare subito la sommatoria” rendono esplicita l'azione cognitiva richiesta. Le frasi introduttive sono per lo più brevi e concrete.
- **Problema**: nessun ostacolo rilevante in questa microcopy; è una parte che funziona.
- **Impatto**: basso.
- **Direzione di miglioramento**: preservare queste istruzioni e usarle anche nei quiz, dove il feedback è molto meno esplicativo.

### Rilievo 2 — Il lessico specialistico cresce senza un sistema stabile di definizioni

- **Evidenza**: compaiono “prostàferesi”, “operatoriale”, “cerchio osculatore”, `κ`, “MacLaurin”, “adeguaglianza”, Darboux e Cauchy. Alcuni termini hanno una riga esplicativa, altri sono soltanto nominati. La schermata Taylor supera 900 parole prima degli approfondimenti. Vedi [Taylor interattivo](screenshots/interazioni/10-taylor-ordine-7-centro-1-5.png).
- **Problema**: non è una preferenza di stile: il lessico introduce oggetti che richiedono nuovi schemi concettuali. Il tono resta amichevole, ma la densità simbolica non corrisponde più a un'introduzione per quarta.
- **Impatto**: medio.
- **Direzione di miglioramento**: distinguere termini necessari, opzionali e storici; definire ogni termine necessario al primo uso e relegare gli altri in glossari o approfondimenti chiusi.

### Rilievo 3 — Alcune promesse microtestuali sono più forti di ciò che segue

- **Evidenza**: la dashboard promette “senza saltare i passaggi”; la sezione 2 promette “Costruire, non ricevere, la tabella”; il ramo adattivo dichiara “Gli argomenti da consolidare tornano per primi”. In pratica, diversi limiti notevoli sono assunti, la tabella contiene una dimostrazione anticipata della catena e il ramo errato sblocca le stesse classi del ramo corretto.
- **Problema**: la microcopy crea un contratto pedagogico che l'architettura non mantiene. Questo incide sulla fiducia dello studente, non sul gusto stilistico.
- **Impatto**: alto.
- **Direzione di miglioramento**: formulare promesse verificabili e allineare etichette, prerequisiti, gating e verifica alle promesse usate.

## 5. Ruolo dell'interattività

### Rilievo 1 — Il laboratorio secante–tangente costruisce davvero intuizione

- **Evidenza**: variando `h`, il grafico muove il secondo punto, mostra secante e tangente insieme e aggiorna `Δy/Δx` accanto a `f′(x₀)`; l'animazione rende visibile la convergenza. Quattro funzioni permettono di non legare l'idea alla sola parabola. Vedi [stato iniziale](screenshots/desktop/02-geometria.png) e [`h` minimo](screenshots/interazioni/02-geometria-slider-h-min.png).
- **Problema**: nessun problema nella funzione narrativa di base: qui la manipolazione è parte della spiegazione, non decorazione.
- **Impatto**: basso.
- **Direzione di miglioramento**: mantenere questo laboratorio come modello per gli altri: previsione, manipolazione, confronto numerico e verbalizzazione.

### Rilievo 2 — `h` è solo positivo, quindi il limite bilaterale non è osservabile

- **Evidenza**: in geometria e derivabilità lo slider “Incremento h” ha minimo `0,05` e massimo `3`; non accetta valori negativi. Nella sezione sui punti singolari il testo invita a osservare “le due pendenze laterali”, ma su `|x|` in zero la manipolazione mostra soltanto il lato destro. Vedi [casi limite](screenshots/interazioni/04-derivabilita-casi-limite.png).
- **Problema**: è una lacuna didattica, non un dettaglio di interfaccia. Il sito definisce la derivata con `h→0`, poi offre un'esperienza che equivale a `h→0⁺`; questo indebolisce proprio la comprensione di angoli, cuspidi e derivate laterali.
- **Impatto**: alto.
- **Direzione di miglioramento**: consentire `h<0`, mostrare separatamente pendenza sinistra e destra e chiedere allo studente di prevedere se convergono allo stesso valore.

### Rilievo 3 — I laboratori avanzati mostrano molto, ma chiedono poco

- **Evidenza**: derivata seconda e Taylor aggiornano pendenza, `f″`, curvatura, raggio, centro, ordine ed errore; però non contengono una previsione, una consegna o un criterio di riuscita. L'utente può muovere slider e osservare. Vedi [derivata seconda](screenshots/interazioni/09-derivata-seconda-flesso.png) e [Taylor](screenshots/interazioni/10-taylor-ordine-7-centro-1-5.png).
- **Problema**: l'interazione rischia di diventare dimostrativa anziché generativa. Un diciassettenne può far scorrere i controlli senza formulare la relazione fra segno di `f″`, concavità, ordine ed errore.
- **Impatto**: medio.
- **Direzione di miglioramento**: aggiungere micro-compiti: prevedi il segno, trova un punto dove cambia, scegli l'ordine minimo per ottenere un errore dato, poi confronta la previsione.

### Rilievo 4 — I fogli digitali supportano il lavoro, non la comprensione adattiva

- **Evidenza**: schede e verifica offrono penna, evidenziatore, gomma, spostamento e spazio aggiuntivo; i tratti restano locali e non vengono interpretati. Le soluzioni sono accordion separati. Vedi [scheda §1 aperta](screenshots/interazioni/12-scheda-1-foglio-5.png) e [verifica](screenshots/interazioni/14-verifica-tutte-soluzioni-e-fogli.png).
- **Problema**: non è un difetto del canvas, ma va distinto dall'interattività didattica: il foglio non produce diagnosi né feedback e non rende il percorso più adattivo.
- **Impatto**: basso.
- **Direzione di miglioramento**: presentarlo chiaramente come spazio di lavoro; affiancargli checklist di autovalutazione sui passaggi essenziali, senza fingere che il disegno venga corretto.

## 6. Sistema adattivo e feedback sull'errore

### Rilievo 1 — L'adattività è percepibile, ma molto limitata

- **Evidenza**: dopo un errore l'esercizio viene riposizionato alla fine della classe; dopo la classe 1 si sbloccano potenze e funzioni elementari. La dashboard dichiara che “gli argomenti da consolidare tornano per primi”. Vedi [panoramica adattiva](screenshots/desktop/15-esercizi-adattivi.png) e [classe](screenshots/interazioni/19-classe-1-panoramica.png).
- **Problema**: nei due passaggi la sequenza di contenuti e gli sblocchi sono sostanzialmente gli stessi. Cambiano ordine interno, punteggio e messaggio, non il tipo di spiegazione o l'attività proposta.
- **Impatto**: medio.
- **Direzione di miglioramento**: legare gli errori a micro-percorsi differenti: richiamo concettuale, esempio contrastivo, esercizio più semplice e nuova verifica dello stesso nodo.

### Rilievo 2 — La classe si considera completata anche con zero risposte corrette

- **Evidenza**: nel ramo volutamente errato il riepilogo mostra `0 punti su 21`, `0% risultato` e “Ripasso consigliato”, ma la dashboard registra `7/27 esercizi completati`, classe `100% ✓ completata` e rende disponibili le classi 2 e 3. Le 7 letture di dimostrazione assegnano comunque 7 punti bonus. Vedi [riepilogo errato](screenshots/interazioni/15-adattivo-errato-riepilogo-classe.png) e [dashboard errata](screenshots/interazioni/15-adattivo-errato-dashboard.png).
- **Problema**: il sistema confonde esposizione con padronanza. Lo studente può fallire ogni domanda e avanzare esattamente ai prerequisiti successivi; l'adattività non protegge la progressione concettuale.
- **Impatto**: alto.
- **Direzione di miglioramento**: separare “visto” da “padroneggiato”; richiedere una soglia o una prova di recupero prima di sbloccare dipendenze, senza impedire l'accesso volontario ai contenuti di consultazione.

### Rilievo 3 — Il feedback immediato non spiega l'errore

- **Evidenza**: dopo una scelta sbagliata compare soltanto “Non è corretto. Riprova: ti rimangono 2 tentativi”; esauriti i tentativi: “Osserva la risposta corretta e studia i passaggi della soluzione”. Non viene spiegato perché l'opzione scelta sia falsa. Vedi [errore terminale](screenshots/interazioni/15-adattivo-errato-01-ri_001.png) e il [dump](contenuti/interazioni/15-adattivo-errato-01-ri_001.txt).
- **Problema**: per il target, tre tentativi con feedback binario favoriscono il tentativo per esclusione. La spiegazione arriva solo come soluzione completa, non come intervento sul ragionamento appena espresso.
- **Impatto**: alto.
- **Direzione di miglioramento**: associare ogni distrattore a un errore plausibile e dare un feedback breve e specifico prima del nuovo tentativo.

### Rilievo 4 — I distrattori raramente rappresentano misconcetti pertinenti

- **Evidenza**: per la tangente a `x³−3x` compaiono come alternative `eˣ`, un minimo di `xeˣ`, una retta normale e la retta corretta; per `sin(x²)` compaiono `20x³−6x`, una retta, la risposta corretta e `2x`. Vedi [retta tangente](contenuti/interazioni/19-esercizio-24-retta-tangente.txt) e [catena](contenuti/interazioni/19-esercizio-19-funzione-di-funzione-semplice.txt).
- **Problema**: le alternative estranee rendono facile riconoscere la forma corretta e non diagnosticano “derivo solo l'interno”, “dimentico il fattore interno”, confusione fra `f′(x)` e `f′(x₀)` o tangente come retta che tocca una sola volta.
- **Impatto**: alto.
- **Direzione di miglioramento**: costruire distrattori a partire da errori tipici e far corrispondere ciascuno a una remediation. Inserire almeno una domanda concettuale sulla tangente che possa intersecare di nuovo il grafico.

### Rilievo 5 — Alcuni misconcetti sono nominati nelle lezioni, ma non verificati

- **Evidenza**: definizione e warm-up distinguono esplicitamente `f′(x₀)` numero da `f′(x)` funzione; la geometria definisce la tangente come limite delle secanti. Tuttavia i 27 quiz sono quasi tutti calcoli o scelte di formula e non chiedono di confutare i misconcetti indicati nel brief.
- **Problema**: l'esposizione corretta non garantisce ristrutturazione concettuale. Senza domanda contrastiva, lo studente può applicare formule e conservare l'idea errata.
- **Impatto**: medio.
- **Direzione di miglioramento**: aggiungere domande “vero/falso con spiegazione”, grafici contrastivi e richieste di interpretazione prima delle classi puramente operative.

## 7. Dimostrazioni

### Rilievo 1 — Sono raggiungibili e ben impaginate come sequenze di trasformazioni

- **Evidenza**: ogni accordion separa formula, “come si legge”, passaggi numerati e conclusione; nella classe adattiva la dimostrazione si abilita dopo la risposta e assegna un bonus di lettura. Vedi [regole aperte](screenshots/interazioni/08-regole-dimostrazioni.png).
- **Problema**: nessun problema di raggiungibilità; il formato è più leggibile di un blocco continuo.
- **Impatto**: basso.
- **Direzione di miglioramento**: conservare la struttura, aggiungendo una domanda di controllo fra i passaggi decisivi.

### Rilievo 2 — L'integrazione è incoerente: “obbligatorie”, ma collassabili e premiate come bonus

- **Evidenza**: la definizione intitola il blocco “TRE DERIVAZIONI OBBLIGATORIE”, ma seno ed esponenziale sono chiusi; negli esercizi la dimostrazione vale “+1 pt bonus” e basta aprirla per ottenere il punto.
- **Problema**: lo studente riceve tre messaggi diversi: necessario, opzionale e gamificato. Aprire un pannello misura il clic, non la comprensione della prova.
- **Impatto**: medio.
- **Direzione di miglioramento**: distinguere una prova fondamentale realmente guidata da prove facoltative; sostituire il bonus di apertura con una breve domanda sul passaggio chiave.

### Rilievo 3 — Alcune prove sono pedagogicamente premature o formalmente incomplete

- **Evidenza**: la prova del logaritmo usa catena e derivazione implicita prima della sezione sulle regole. La prova della catena moltiplica e divide per `k=g(x+h)−g(x)` dichiarando `k≠0`, ma non tratta il caso in cui `k=0` per valori di `h` arbitrariamente vicini a zero. Vedi [fondamentali](contenuti/interazioni/07-fondamentali-dimostrazioni.txt) e [catena](contenuti/interazioni/08-regole-dimostrazioni.txt).
- **Problema**: per il target una prova deve chiarire le dipendenze, non nasconderle. Il primo caso è circolare nella progressione; il secondo presenta come completa una dimostrazione che richiede un argomento aggiuntivo.
- **Impatto**: alto.
- **Direzione di miglioramento**: dichiarare esplicitamente i lemmi usati, riordinare le prove e, per la catena, usare una formulazione che gestisca anche `k=0` oppure presentarla onestamente come idea della dimostrazione.

### Rilievo 4 — Le prove dal limite diventano ripetitive nel ramo adattivo

- **Evidenza**: i tre esercizi sul prodotto ripropongono la stessa dimostrazione generale della regola; lo stesso accade per la classe della catena. Il censimento completo è in [contenuti/interazioni](contenuti/interazioni/).
- **Problema**: la ripetizione non è adattata al singolo errore e occupa spazio che potrebbe essere usato per collegare la prova all'esercizio concreto.
- **Impatto**: medio.
- **Direzione di miglioramento**: mostrare la prova completa una volta, poi richiamarne solo il passaggio pertinente o chiedere allo studente di riconoscere dove entra nell'esercizio.

## 8. Consolidamento e chiusura

### Rilievo 1 — Warm-up e ricomposizione delle tre letture sono buoni ritorni ciclici

- **Evidenza**: la lezione 2 riparte con tre domande su letture, `f′(x₀)`/`f′(x)` e continuità; le correzioni sono concise e apribili. La fine della lezione 1 chiede di spiegare la derivata “senza formule” da tre prospettive. Vedi [warm-up corretto](screenshots/interazioni/06-warmup-correzioni.png).
- **Problema**: nessun problema nella scelta dei nuclei; manca solo una registrazione della risposta.
- **Impatto**: basso.
- **Direzione di miglioramento**: preservare queste domande e riproporle alla fine con una breve autovalutazione comparativa.

### Rilievo 2 — La verifica finale non misura il percorso dichiarato in modo coerente

- **Evidenza**: Taylor, dichiarato fuori dalla verifica di base, vale 8 punti nel problema 4; la retta normale compare nel problema 2 senza una sezione didattica precedente. La prova assegna 30 punti ma non fornisce una rubrica concettuale prima dell'apertura della soluzione. Vedi [verifica completa](screenshots/interazioni/14-verifica-tutte-soluzioni-e-fogli.png).
- **Problema**: la chiusura non è una sintesi affidabile del percorso. Gli studenti più attenti alle etichette di priorità vengono penalizzati.
- **Impatto**: alto.
- **Direzione di miglioramento**: allineare prova, obiettivi e contenuti obbligatori; separare una verifica base da una sfida avanzata non conteggiata nel punteggio principale.

### Rilievo 3 — Il 100% non produce una vera conclusione narrativa

- **Evidenza**: dopo aver segnato tutte le 11 sezioni, la dashboard mostra `11/11` e `100%`, ma il pulsante principale resta “Riprendi la lezione”; non appare una sintesi personalizzata, un ritorno al problema iniziale o un ponte esplicito verso la quinta. Vedi [dashboard completa](screenshots/interazioni/17-dashboard-percorso-completo.png).
- **Problema**: il percorso chiude amministrativamente, non cognitivamente. Il titolo promette “padronanza”, ma non dice che cosa lo studente ora sa fare né quali idee resteranno da sviluppare.
- **Impatto**: alto.
- **Direzione di miglioramento**: chiudere riprendendo la velocità istantanea, far produrre una definizione personale, mostrare tre competenze acquisite e anticipare studio di funzione, ottimizzazione e teoremi della quinta.

### Rilievo 4 — “Mostra soluzione” sostituisce troppo facilmente l'autocorrezione

- **Evidenza**: nei quiz il pulsante è disponibile prima di rispondere e chiude l'esercizio a zero punti; nelle schede “Mostra tutte le soluzioni” apre in blocco tutti i passaggi. Non è richiesta una previsione, un tentativo scritto o una checklist. Vedi [esercizio con soluzione](screenshots/interazioni/19-esercizio-14-prodotto-polinomio-sin.png).
- **Problema**: per uno studente inesperto la soluzione completa può diventare il percorso di minor resistenza. Il sito registra completamento ma non consolidamento.
- **Impatto**: medio.
- **Direzione di miglioramento**: introdurre livelli di aiuto progressivi e chiedere un'autovalutazione dei passaggi prima di mostrare la soluzione integrale.

## 9. Struttura e orientamento

### Rilievo 1 — Su desktop posizione, durata e direzione sono quasi sempre chiare

- **Evidenza**: la sidebar elenca le due lezioni, numera le sezioni, mostra `n di 11`, percentuale, tempi, precedente e successivo. Il refresh dopo 3 sezioni ha mantenuto `27%`, e tornando indietro geometria risultava ancora completata. Vedi [dopo refresh](screenshots/interazioni/17-percorso-3-su-11-dopo-refresh.png) e [ritorno indietro](screenshots/interazioni/17-percorso-ritorno-indietro.png).
- **Problema**: nessun problema sostanziale di orientamento desktop o persistenza delle sezioni concluse.
- **Impatto**: basso.
- **Direzione di miglioramento**: mantenere questa struttura, distinguendo però avanzamento di lettura e padronanza.

### Rilievo 2 — Le sezioni opzionali contano come obbligatorie nel progresso

- **Evidenza**: Taylor è “opzionale” e i teoremi “appendice”, ma entrambi fanno parte delle 11 sezioni; per raggiungere `100%` ho dovuto marcarli completati. Vedi [percorso 11/11](screenshots/interazioni/17-percorso-11-su-11.png).
- **Problema**: il contatore contraddice le etichette e altera il senso di progresso. Chi segue solo il nucleo obbligatorio appare incompleto.
- **Impatto**: alto.
- **Direzione di miglioramento**: separare percentuale base e approfondimenti, per esempio `9/9 nucleo` più badge facoltativi.

### Rilievo 3 — Il completamento è una dichiarazione manuale, non una traccia di apprendimento

- **Evidenza**: ogni sezione si chiude con “Segna come completata”; è possibile ottenere 11/11 senza aprire dimostrazioni, usare grafici o rispondere a domande. I punti degli esercizi restano separati dal 100% lezioni.
- **Problema**: “dove sono” è chiaro, “che cosa ho imparato” no. Il contatore misura pagine marcate, non evidenze di comprensione.
- **Impatto**: medio.
- **Direzione di miglioramento**: conservare il controllo manuale per non bloccare la lettura, ma affiancare indicatori distinti per concetti verificati, esercizi svolti e approfondimenti letti.

### Rilievo 4 — Su mobile la navigazione esiste, ma interrompe la continuità del testo

- **Evidenza**: a 390 px la sidebar diventa drawer; aperta occupa una parte ampia dello schermo e alcune etichette risultano visivamente tagliate sul margine sinistro. Durante l'animazione di geometria la barra superiore si sovrappone all'area del titolo nello screenshot. Vedi [menu mobile](screenshots/mobile/18-mobile-menu-aperto.png) e [geometria mobile](screenshots/mobile/18-mobile-geometria-interazione.png).
- **Problema**: è soprattutto un problema di orientamento, non estetico: i nomi delle tappe sono il principale strumento per ricostruire la narrativa e diventano più difficili da leggere mentre il contenuto è coperto.
- **Impatto**: medio.
- **Direzione di miglioramento**: rendere il drawer pienamente leggibile e offrire nel corpo una traccia compatta “sezione corrente / successiva”, così l'orientamento non dipende dall'apertura del menu.

## Sintesi finale — i 5 problemi narrativi più gravi

1. **La verifica smentisce la gerarchia dichiarata.** Taylor è definito opzionale e fuori dalla verifica base, ma vale 8/30; la normale è verificata senza essere insegnata nel corso principale. Questo rompe il contratto didattico.
2. **L'adattività non tutela i prerequisiti.** Con zero risposte corrette la classe è comunque `100% completata` e sblocca gli stessi rami del percorso corretto. Il sistema misura attraversamento e clic, non padronanza.
3. **La progressione delle dimostrazioni è sovraccarica e talvolta circolare.** Limiti notevoli, prostàferesi, derivazione implicita e catena entrano prima di essere riattivati o costruiti; la prova della catena non gestisce pienamente `k=0`.
4. **L'interazione centrale mostra solo `h→0⁺`.** Proprio nella sezione sulle derivate laterali, lo slider non accetta `h<0`; il testo parla di due lati ma l'esperienza ne rende manipolabile uno solo.
5. **Il corso finisce con un 100%, non con una conquista concettuale.** Non c'è un ritorno risolutivo al problema iniziale, una sintesi delle competenze o un ponte esplicito alla quinta; il comando principale resta “Riprendi la lezione”.

Nel complesso, la narrativa è più forte nel primo arco — problema fisico, secanti, definizione — che nel secondo. Quando il sito passa dalla comprensione alla “padronanza”, accumula contenuti avanzati, rende incoerenti opzionalità e verifica e usa un adattamento troppo debole per correggere davvero gli errori. Questi sono problemi didattici osservabili; non dipendono da preferenze cromatiche, tipografiche o di stile.
