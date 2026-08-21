import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Chip,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { BlockMath, InlineMath } from 'react-katex';
import { Navigate, useParams } from 'react-router-dom';
import { ChainRuleLayers } from '@/components/lesson/ChainRuleLayers';
import { Derivation } from '@/components/lesson/Derivation';
import { DerivativeTheoremsAppendix } from '@/components/lesson/DerivativeTheoremsAppendix';
import { HistoryNote } from '@/components/lesson/HistoryNote';
import { LessonScaffold, PerspectiveCard, SectionBlock } from '@/components/lesson/LessonScaffold';
import { TaylorLab } from '@/components/labs/TaylorLab';
import { ConcavityExamples, SecondDerivativeLab } from '@/components/labs/SecondDerivativeLab';
import { MathText } from '@/components/math/MathText';
import { lessonTwoSections } from '@/data/course';
import { GlossaryTerm } from '@/components/lesson/GlossaryTerm';

export function LessonTwoPage() {
  const { sectionId = '' } = useParams();
  if (!lessonTwoSections.some((section) => section.id === sectionId)) return <Navigate to="/" replace />;
  if (sectionId === 'warmup') return <WarmupSection />;
  if (sectionId === 'fondamentali') return <FundamentalsSection />;
  if (sectionId === 'regole') return <RulesSection />;
  if (sectionId === 'derivata-seconda') return <SecondDerivativeSection />;
  if (sectionId === 'taylor') return <TaylorSection />;
  return <TheoremsSection />;
}

function WarmupSection() {
  const questions = [
    { q: 'Quali sono le tre letture della derivata?', a: 'Geometrica: pendenza della tangente. Analitica: limite del rapporto incrementale. Fisica: tasso di variazione istantaneo.' },
    { q: 'Che differenza c’è tra f′(x₀) e f′(x)?', a: 'f′(x₀) è un numero riferito a un punto; f′(x) è la funzione che associa a ogni x la pendenza in quel punto.' },
    { q: 'Continuità implica derivabilità?', a: 'No. |x| è continua in zero ma ha derivate laterali −1 e +1, quindi non è derivabile in zero.' },
  ];
  return (
    <LessonScaffold sectionId="warmup" eyebrow="Lezione 2 · 0:00–0:10" title="Tre domande per ripartire" lead="Prima di costruire le regole operative, recuperiamo le idee della prima lezione. Rispondi a voce o su carta, poi apri la correzione.">
      <Stack spacing={1.5}>
        {questions.map((item, index) => <Accordion key={item.q} sx={{ border: '1px solid', borderColor: 'divider' }}><AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}><Stack direction="row" gap={2} alignItems="center"><Chip label={`0${index + 1}`} color="primary" variant="outlined" /><Typography fontWeight={750}>{item.q}</Typography></Stack></AccordionSummary><AccordionDetails><Alert severity="success">{item.a}</Alert></AccordionDetails></Accordion>)}
      </Stack>
      <Paper elevation={0} sx={{ p: 3, bgcolor: 'custom.ink', color: '#F2F5FA' }}>
        <Typography variant="h4" sx={{ color: '#91A3FA', mb: 1 }}>Obiettivo dell’ora</Typography>
        <Typography variant="h2" sx={{ fontSize: '2.25rem', mb: 1 }}>Costruire, non ricevere, la tabella.</Typography>
        <Typography sx={{ color: '#C9D2E0' }}>Ogni formula fondamentale e ogni regola verrà ricavata da ciò che già sappiamo sui limiti.</Typography>
      </Paper>
      <SectionBlock eyebrow="Prerequisiti riattivati" title="I due limiti notevoli che useremo">
        <Typography paragraph>Non li stiamo dimostrando qui: li richiamiamo numericamente e li dichiariamo come risultati già noti. Sono il ponte necessario per derivare seno ed esponenziale senza passaggi nascosti.</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', overflowX: 'auto' }}><BlockMath math="\lim_{t\to0}\frac{\sin t}{t}=1" /><Typography variant="body2" color="text.secondary">Per t = 0,1 il rapporto vale circa 0,9983; per t = 0,01 vale circa 0,99998.</Typography></Paper></Grid>
          <Grid item xs={12} sm={6}><Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', overflowX: 'auto' }}><BlockMath math="\lim_{t\to0}\frac{e^t-1}{t}=1" /><Typography variant="body2" color="text.secondary">Per t = 0,1 il rapporto vale circa 1,0517; per t = 0,01 vale circa 1,0050.</Typography></Paper></Grid>
        </Grid>
      </SectionBlock>
    </LessonScaffold>
  );
}

function FundamentalsSection() {
  const rows = [
    ['c', 'Δy = 0', '0'],
    ['x^n', 'binomio di Newton', 'nx^{n-1}'],
    ['e^x', '\\lim (e^h-1)/h=1', 'e^x'],
    ['\\sin x', '\\lim \\sin h/h=1', '\\cos x'],
    ['\\cos x', 'formule di addizione', '-\\sin x'],
  ];
  return (
    <LessonScaffold sectionId="fondamentali" eyebrow="Lezione 2 · 0:10–0:40" title="La tabella, costruita insieme" lead="La colonna centrale è la più importante: ricorda quale idea produce la formula, così puoi ricostruirla quando la memoria non basta.">
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <Table><TableHead><TableRow><TableCell>Funzione</TableCell><TableCell>Strumento</TableCell><TableCell>Derivata</TableCell></TableRow></TableHead><TableBody>{rows.map((row) => <TableRow key={row[0]}><TableCell><InlineMath math={row[0]} /></TableCell><TableCell><MathText text={`\\(${row[1]}\\)`} /></TableCell><TableCell sx={{ color: 'primary.main', fontWeight: 800 }}><InlineMath math={row[2]} /></TableCell></TableRow>)}</TableBody></Table>
      </TableContainer>

      <SectionBlock eyebrow="Versione dimostrativa" title="Tre idee da saper ricostruire">
        <Stack spacing={2}>
          <Derivation title="Potenza intera" formula="(x^n)'=nx^{n-1}" meaning="Serve a derivare una potenza di \(x\): l’esponente \(n\) scende davanti come moltiplicatore e poi diminuisce di uno. Per esempio, \((x^3)'=3x^2\)." steps={[
            { label: 'Definizione', formula: "\\frac{(x+h)^n-x^n}{h}", explanation: 'Partiamo dal rapporto incrementale.' },
            { label: 'Binomio di Newton', formula: "(x+h)^n=x^n+nx^{n-1}h+\\binom n2x^{n-2}h^2+\\cdots+h^n", explanation: 'Il primo termine cancella \\(x^n\\); tutti gli altri contengono h.' },
            { label: 'Dividi per h', formula: "nx^{n-1}+\\binom n2x^{n-2}h+\\cdots+h^{n-1}", explanation: 'Dopo la semplificazione solo il primo termine non conserva un fattore h.' },
            { label: 'Limite', formula: "\\lim_{h\\to0}(nx^{n-1}+h\\cdot\\ldots)=nx^{n-1}", explanation: 'I termini che contengono h tendono a zero.' },
          ]} conclusion="La regola della potenza non è un trucco: è il primo coefficiente del binomio di Newton che sopravvive al limite." />
          <Derivation title="Seno · dimostrazione guidata" formula="(\sin x)'=\cos x" meaning="Il coseno misura la pendenza del seno nello stesso punto." defaultExpanded conceptId="proof-sine" checkpoint={{ question: 'Quale prerequisito rende possibile l’ultimo passaggio?', choices: ['Il limite di sin(t)/t vale 1', 'sin(0) vale 1', 'Il coseno è sempre costante'], correctIndex: 0, explanation: 'Esatto: compare il limite notevole richiamato nel warm-up.' }} steps={[
            { label: 'Rapporto incrementale', formula: "\\frac{\\sin(x+h)-\\sin x}{h}", explanation: 'Partiamo dalla definizione.' },
            { label: 'Formula di prostaferesi', formula: "\\sin(x+h)-\\sin x=2\\cos(x+h/2)\\sin(h/2)", explanation: 'La prostaferesi trasforma la differenza in un prodotto; trovi il termine nel glossario.' },
            { label: 'Limite notevole', formula: "\\cos(x+h/2)\\frac{\\sin(h/2)}{h/2}\\to\\cos x", explanation: 'Il secondo fattore tende a 1, come richiamato nel warm-up.' },
          ]} conclusion="Quindi \((\sin x)'=\cos x\)." />
          <Derivation title="Coseno" formula="(\cos x)'=-\sin x" meaning="Dice che la pendenza del coseno nel punto \(x\) è l’opposto del valore del seno nello stesso punto. Il segno meno indica che il coseno inizialmente scende." steps={[
            { label: 'Formula di addizione', formula: "\\cos(x+h)=\\cos x\\cos h-\\sin x\\sin h", explanation: 'Sostituiamo nel rapporto incrementale.' },
            { label: 'Separa', formula: "\\cos x\\frac{\\cos h-1}{h}-\\sin x\\frac{\\sin h}{h}", explanation: 'Compaiono due limiti notevoli.' },
            { label: 'Limiti notevoli', formula: "\\cos x\\cdot0-\\sin x\\cdot1=-\\sin x", explanation: '\\((\\cos h-1)/h\\to0\\) e \\(\\sin h/h\\to1\\).' },
          ]} conclusion="Il coseno deriva nel seno con segno negativo." />
        </Stack>
      </SectionBlock>

      <Paper elevation={0} sx={{ p: 3, bgcolor: 'custom.goldLight', borderLeft: '4px solid', borderColor: 'custom.gold' }}>
        <Typography variant="h3" mb={1}>Perché <InlineMath math="(e^x)'=e^x" /> è straordinario</Typography>
        <Typography>È l’unica funzione la cui velocità di crescita coincide sempre con il suo valore. Per questo appare in crescita batterica, decadimento radioattivo e interesse composto continuo.</Typography>
      </Paper>
      <HistoryNote title="L’esponenziale e i sistemi che crescono da sé" summary="Quando il tasso di crescita è proporzionale alla quantità presente, compare eˣ." href="https://www.khanacademy.org/math/differential-calculus/dc-chain/dc-exponential-functions/v/exponential-functions-differentiation-intro">
        Se una popolazione cresce a una velocità proporzionale alla popolazione stessa, l’equazione è N′ = kN. Le sue soluzioni sono esponenziali: la funzione eˣ è il modello naturale dei processi con feedback proporzionale.
      </HistoryNote>
    </LessonScaffold>
  );
}

function RulesSection() {
  return (
    <LessonScaffold sectionId="regole" eyebrow="Lezione 2 · 0:40–1:10" title="Quattro regole, quattro idee" lead="Per ogni regola teniamo insieme formula operativa, dimostrazione dal limite e lettura verbale. La regola è pronta all’uso solo dopo aver capito da dove viene.">
      <Stack spacing={2}>
        <Derivation title="Linearità" formula="(\alpha f+\beta g)'=\alpha f'+\beta g'" meaning="Serve per somme e multipli: \(f\) e \(g\) sono funzioni, mentre \(\alpha\) e \(\beta\) sono numeri costanti. Si deriva ogni funzione separatamente e si mantengono le costanti." defaultExpanded steps={[
          { label: 'Rapporto incrementale', formula: "\\frac{\\alpha[f(x+h)-f(x)]+\\beta[g(x+h)-g(x)]}{h}", explanation: 'Raggruppiamo separatamente le variazioni di f e g.' },
          { label: 'Separa e passa al limite', formula: "\\alpha\\lim_{h\\to0}\\frac{f(x+h)-f(x)}h+\\beta\\lim_{h\\to0}\\frac{g(x+h)-g(x)}h", explanation: 'Il limite della somma è la somma dei limiti; le costanti escono.' },
        ]} conclusion="Derivare è un’operazione lineare." />
        <Derivation title="Regola del prodotto" formula="(fg)'=f'g+fg'" meaning="Serve quando \(f(x)\) e \(g(x)\) sono moltiplicate. Si deriva prima \(f\) lasciando ferma \(g\), poi si lascia ferma \(f\) e si deriva \(g\); infine si sommano i due contributi." conceptId="proof-product" checkpoint={{ question: 'Perché nella formula compaiono due addendi?', choices: ['Ogni addendo misura la variazione di un fattore mentre l’altro resta fermo', 'Perché si moltiplicano semplicemente le due derivate', 'Perché il prodotto diventa sempre una somma'], correctIndex: 0, explanation: 'Esatto: i due addendi separano i contributi dei due fattori.' }} steps={[
          { label: 'Definizione', formula: "\\frac{f(x+h)g(x+h)-f(x)g(x)}h", explanation: 'Il numeratore non si separa direttamente.' },
          { label: 'Aggiungi zero', formula: "\\frac{f(x+h)g(x+h)-f(x)g(x+h)+f(x)g(x+h)-f(x)g(x)}h", explanation: 'Aggiungiamo e sottraiamo \\(f(x)g(x+h)\\): è il trucco di Leibniz.' },
          { label: 'Raccogli', formula: "g(x+h)\\frac{f(x+h)-f(x)}h+f(x)\\frac{g(x+h)-g(x)}h", explanation: 'Ora riconosciamo i due rapporti incrementali.' },
          { label: 'Limite', formula: "g(x)f'(x)+f(x)g'(x)", explanation: 'La derivabilità implica continuità, quindi \\(g(x+h)\\to g(x)\\).' },
        ]} conclusion="Si deriva un fattore alla volta, lasciando fermo l’altro, e si sommano i contributi." />
        <Derivation title="Regola del quoziente" formula="\left(\frac fg\right)'=\frac{f'g-fg'}{g^2}" meaning="Serve quando una funzione \(f\) è divisa per una funzione \(g\), con \(g(x)\neq0\). Al numeratore l’ordine è importante: derivata del sopra per sotto, meno sopra per derivata del sotto." steps={[
          { label: 'Riscrivi come prodotto', formula: "f=\\frac fg\\cdot g", explanation: 'La ricaviamo dalla regola del prodotto, con \\(g\\neq0\\).' },
          { label: 'Deriva', formula: "f'=\\left(\\frac fg\\right)'g+\\frac fg\\,g'", explanation: 'Applichiamo la regola del prodotto al membro destro.' },
          { label: 'Isola la derivata', formula: "\\left(\\frac fg\\right)'=\\frac{f'g-fg'}{g^2}", explanation: 'Portiamo il secondo termine a sinistra e dividiamo per g.' },
        ]} conclusion="Nel numeratore l’ordine conta: derivata del sopra per sotto meno sopra per derivata del sotto." />
        <Derivation title="Regola della catena" formula="(f\circ g)'=f'(g)\,g'" meaning="Serve quando una funzione è dentro un’altra: \(f\circ g\) significa \(f(g(x))\). Si deriva la funzione esterna, la si valuta nell’interno e si moltiplica per la derivata della funzione interna." steps={[
          { label: 'Rapporto della composta', formula: "\\frac{f(g(x+h))-f(g(x))}{h}", explanation: 'La variazione esterna dipende dalla variazione della funzione interna.' },
          { label: 'Introduci k senza dividere per zero', formula: "\\varphi(k)\\frac{g(x+h)-g(x)}h,\\quad k=g(x+h)-g(x)", explanation: "Poniamo φ(k)=[f(g(x)+k)-f(g(x))]/k per k≠0 e φ(0)=f′(g(x)). Così l'identità resta valida anche quando la variazione interna è zero." },
          { label: 'Passa al limite', formula: "f'(g(x))\\cdot g'(x)", explanation: 'Per continuità di g, \\(h\\to0\\) implica \\(k\\to0\\).' },
        ]} conclusion="Deriva l’esterno valutato nell’interno, poi moltiplica per la derivata dell’interno." />
      </Stack>

      <SectionBlock eyebrow="Esempio canonico" title="sin(x²): leggere gli strati">
        <ChainRuleLayers />
      </SectionBlock>
      <SectionBlock eyebrow="Dopo la catena" title="Ora possiamo giustificare il logaritmo">
        <Derivation title="Logaritmo naturale · approfondimento" formula="(\ln x)'=1/x" meaning="La dimostrazione usa la catena, quindi viene presentata solo adesso." steps={[
          { label: 'Funzioni inverse', formula: "y=\\ln x\\iff e^y=x", explanation: 'Il logaritmo è l’inversa dell’esponenziale.' },
          { label: 'Deriva con la catena', formula: "e^y\\frac{dy}{dx}=1", explanation: 'Derivando e^y rispetto a x compare dy/dx.' },
          { label: 'Risolvi', formula: "\\frac{dy}{dx}=\\frac1{e^y}=\\frac1x", explanation: 'Sostituiamo e^y=x, con x>0.' },
        ]} conclusion="La prova non è più circolare: la regola della catena è già stata costruita." />
      </SectionBlock>

      <HistoryNote title="Il trucco nella regola del prodotto" summary="Aggiungere e sottrarre lo stesso termine trasforma un’espressione opaca in due rapporti incrementali." href="https://en.wikipedia.org/wiki/Product_rule">
        Il passaggio decisivo è inserire zero nella forma f(x)g(x+h) − f(x)g(x+h). Non cambia il valore, ma permette di isolare la variazione di ciascun fattore. È un esempio classico di come una dimostrazione suggerisca anche il modo migliore di ricordare una formula.
      </HistoryNote>
      <HistoryNote title="Chain rule: intuizione e rigore" summary="dy/dx = dy/du · du/dx è un’intuizione eccellente, ma il limite spiega perché funziona." href="https://www.3blue1brown.com/lessons/chain-rule-and-product-rule">
        La notazione di Leibniz fa sembrare i differenziali frazioni che si semplificano. La dimostrazione rigorosa sostituisce questa cancellazione con due rapporti incrementali e usa la continuità della funzione interna.
      </HistoryNote>
    </LessonScaffold>
  );
}

function SecondDerivativeSection() {
  return (
    <LessonScaffold sectionId="derivata-seconda" eyebrow="Lezione 2 · 1:20–1:50" title="La derivata della derivata" lead="f″ misura come cambia la pendenza. Sul grafico descrive la concavità; nel moto descrive l’accelerazione.">
      <Paper elevation={0} sx={{ bgcolor: 'custom.ink', color: '#F2F5FA', p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ color: '#91A3FA', mb: 1 }}>Derivata seconda</Typography>
        <Box sx={{ overflowX: 'auto', '& .katex': { fontSize: '1.35em' } }}><BlockMath math="f''(x)=(f'(x))'=\frac{d^2y}{dx^2}=D^2f(x)" /></Box>
      </Paper>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}><PerspectiveCard icon="⌣" label="f″ > 0" title="Concava verso l’alto">Le pendenze aumentano: il grafico ha la forma di una coppa.</PerspectiveCard></Grid>
        <Grid item xs={12} md={4}><PerspectiveCard icon="⌢" label="f″ < 0" title="Concava verso il basso">Le pendenze diminuiscono: il grafico ha la forma di una cupola.</PerspectiveCard></Grid>
        <Grid item xs={12} md={4}><PerspectiveCard icon="a" label="FISICA" title="Accelerazione"><MathText text={"Se \\(s(t)\\) è la posizione, \\(v(t)=s'(t)\\) e \\(a(t)=s''(t)\\)."} /></PerspectiveCard></Grid>
      </Grid>
      <SectionBlock eyebrow="Prima guarda, poi calcola" title="La derivata seconda è il verso in cui piega il grafico">
        <Typography paragraph>
          Non basta ricordare “coppa” e “cupola”. La derivata seconda confronta le pendenze di tangenti vicine: se aumentano, <InlineMath math="f''>0" />; se diminuiscono, <InlineMath math="f''<0" />. Le linee gialle nei grafici rendono visibile proprio questa variazione.
        </Typography>
        <ConcavityExamples />
      </SectionBlock>
      <SectionBlock eyebrow="Laboratorio interattivo" title="Muovi il punto e osserva cambiare la curvatura">
        <Typography paragraph>
          Sposta il punto lungo la funzione e confronta tangente e segno di <InlineMath math="f''" />. Se apri l’approfondimento, il <GlossaryTerm term="Cerchio osculatore" /> aggiunge l’informazione su quanto e verso dove la curva sta piegando.
        </Typography>
        <SecondDerivativeLab />
      </SectionBlock>
      <SectionBlock eyebrow="Anteprima dello studio di funzione" title="Punti stazionari e flessi">
        <Typography paragraph>Un punto è stazionario quando <InlineMath math="f'(x_0)=0" />: la tangente è orizzontale. Può essere un massimo, un minimo o un flesso; per distinguerli servirà studiare il segno di f′ e f″.</Typography>
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', overflowX: 'auto' }}><BlockMath math="f(x)=x^3-3x\quad\Rightarrow\quad f'(x)=3x^2-3\quad\Rightarrow\quad x=\pm1" /><Typography variant="body2" color="text.secondary">I due punti hanno tangente orizzontale. La derivata seconda <InlineMath math="f''(x)=6x" /> aiuta a capire che uno è un massimo e l’altro un minimo.</Typography></Paper>
      </SectionBlock>
      <Alert severity="info">Questo è solo un ponte: lo studio completo di massimi, minimi e flessi verrà più avanti. Nell’appendice dopo Taylor troverai invece Rolle, Lagrange e gli altri teoremi letti in modo grafico e pratico.</Alert>
    </LessonScaffold>
  );
}

function TaylorSection() {
  const developments = [
    ['e^x', '1+x+\\frac{x^2}{2!}+\\frac{x^3}{3!}+\\cdots'],
    ['\\sin x', 'x-\\frac{x^3}{3!}+\\frac{x^5}{5!}-\\cdots'],
    ['\\cos x', '1-\\frac{x^2}{2!}+\\frac{x^4}{4!}-\\cdots'],
  ];
  return (
    <LessonScaffold sectionId="taylor" eyebrow="Lezione 2 · 1:50–2:05 · Opzionale" title="Il DNA locale di una funzione" lead="Taylor risponde a una domanda concreta: possiamo sostituire, vicino a un punto scelto, una funzione difficile con un polinomio più semplice che le assomigli molto?">
      <Alert severity="warning" icon="★"><strong>Approfondimento avanzato.</strong> Questa sezione non fa parte della verifica di base.</Alert>
      <SectionBlock eyebrow="Prima della formula" title="Che cosa stiamo cercando di ottenere?">
        <Typography paragraph>
          Funzioni come <InlineMath math="e^x" />, <InlineMath math="\sin x" /> o <InlineMath math="\cos x" /> non sono polinomi. Taylor costruisce però un <strong>sostituto locale</strong>, chiamato polinomio approssimante: una formula fatta soltanto di somme, prodotti e potenze, quindi facile da calcolare e da disegnare.
        </Typography>
        <Typography paragraph>
          “Approssimare” non significa trovare una copia esatta. Significa scegliere un punto <InlineMath math="x_0" /> e costruire un polinomio che lì abbia lo stesso valore e, aggiungendo termini, la stessa pendenza, la stessa curvatura e così via. Vicino a <InlineMath math="x_0" /> le due curve quasi si sovrappongono; allontanandosi possono separarsi.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 2.5, height: '100%', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="overline" color="primary.main">L’obiettivo</Typography>
              <Typography variant="h3" mb={1}>Una funzione più maneggevole</Typography>
              <Typography variant="body2" color="text.secondary">Usare un polinomio semplice al posto della funzione originale, ma soltanto nella zona in cui la somiglianza è abbastanza buona.</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 2.5, height: '100%', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="overline" color="primary.main">Il centro x₀</Typography>
              <Typography variant="h3" mb={1}>Il punto di massima fedeltà</Typography>
              <Typography variant="body2" color="text.secondary">È il punto attorno al quale costruiamo l’approssimazione. Cambiare centro significa chiedere al polinomio di essere preciso in un’altra zona.</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 2.5, height: '100%', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="overline" color="primary.main">L’errore</Typography>
              <Typography variant="h3" mb={1}>Quanto siamo lontani</Typography>
              <Typography variant="body2" color="text.secondary">In un punto x è la distanza verticale tra i due grafici: <InlineMath math="|f(x)-P_n(x)|" />. Errore piccolo significa approssimazione buona.</Typography>
            </Paper>
          </Grid>
        </Grid>
        <Paper elevation={0} sx={{ mt: 2, p: 3, bgcolor: 'custom.goldLight', borderLeft: '4px solid', borderColor: 'custom.gold' }}>
          <Typography variant="h3" mb={1}>Un esempio senza tecnicismi</Typography>
          <Typography>
            Vicino a zero, <InlineMath math="e^x" /> assomiglia alla retta <InlineMath math="1+x" />. Per <InlineMath math="x=0{,}1" /> otteniamo <InlineMath math="1+0{,}1=1{,}1" />, mentre il valore reale è circa <InlineMath math="1{,}10517" />. L’errore è circa <InlineMath math="0{,}00517" />: non è zero, ma sappiamo esattamente che cosa stiamo perdendo usando la formula più semplice.
          </Typography>
        </Paper>
      </SectionBlock>
      <SectionBlock eyebrow="Costruzione in tre passi" title="Quante informazioni vogliamo conservare?">
        <Stack spacing={1.5}>
          <TaylorStep number="0" title="Stesso valore" formula="P_0(x)=f(x_0)" text="Il polinomio costante sa soltanto a quale altezza si trova la funzione nel centro scelto." />
          <TaylorStep number="1" title="Stesso valore e stessa pendenza" formula="P_1(x)=f(x_0)+f'(x_0)(x-x_0)" text="Aggiungiamo la retta tangente: nel centro le due curve hanno anche la stessa direzione." />
          <TaylorStep number="2" title="Aggiungiamo la curvatura" formula="P_2(x)=f(x_0)+f'(x_0)(x-x_0)+\frac{f''(x_0)}{2!}(x-x_0)^2" text="La derivata seconda fa coincidere anche il modo in cui la curva si piega." />
        </Stack>
        <Paper elevation={0} sx={{ mt: 2, p: 3, bgcolor: 'custom.ink', color: '#F2F5FA', overflowX: 'auto' }}><BlockMath math="P_n(x)=\sum_{k=0}^{n}\frac{f^{(k)}(x_0)}{k!}(x-x_0)^k" /></Paper>
        <Typography variant="body2" color="text.secondary" mt={1.5}>Non devi memorizzare subito la sommatoria: dice soltanto “prendi le informazioni della funzione in <InlineMath math="x_0" /> e aggiungile una alla volta, dalla posizione fino alle variazioni più fini”.</Typography>
      </SectionBlock>
      <SectionBlock eyebrow="Laboratorio" title="Sposta il centro e osserva dove il polinomio funziona">
        <TaylorLab />
      </SectionBlock>
      <SectionBlock title="Tre sviluppi fondamentali centrati in zero">
        <Stack spacing={1}>{developments.map(([fn, series]) => <Paper key={fn} elevation={0} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '120px 1fr' }, gap: 2, p: 2, border: '1px solid', borderColor: 'divider', overflowX: 'auto' }}><Box color="primary.main"><InlineMath math={fn} /></Box><InlineMath math={series} /></Paper>)}</Stack>
        <Typography variant="body2" color="text.secondary" mt={2}>Quando il centro è zero si parla anche di sviluppo di MacLaurin. Per queste tre funzioni la serie completa converge su tutto ℝ, ma con un numero finito di termini l’approssimazione è generalmente migliore vicino al centro.</Typography>
      </SectionBlock>
      <Paper elevation={0} sx={{ p: 3, bgcolor: 'custom.goldLight', borderLeft: '4px solid', borderColor: 'custom.gold' }}><Typography variant="h3" mb={1}>Insight centrale</Typography><Typography>Ogni termine usa una derivata di ordine k nel centro scelto. La derivata è il DNA locale della funzione: contiene l’informazione su valore, direzione, curvatura e variazioni di ordine superiore. L’errore ci ricorda però che informazione locale non significa uguaglianza ovunque.</Typography></Paper>
      <HistoryNote title="Taylor, MacLaurin e Cauchy" summary="La formula nasce nel Settecento; capire quando rappresenta davvero la funzione richiederà un altro secolo." href="https://mathshistory.st-andrews.ac.uk/Biographies/Taylor/">
        Brook Taylor pubblicò la formula nel 1715. Colin MacLaurin studiò sistematicamente il caso centrato in zero. Nell’Ottocento Cauchy chiarì che possedere derivate di ogni ordine non garantisce automaticamente che la serie converga alla funzione.
      </HistoryNote>
    </LessonScaffold>
  );
}

function TheoremsSection() {
  return (
    <LessonScaffold
      sectionId="teoremi"
      eyebrow="Appendice · Approfondimento facoltativo"
      title="I teoremi che fanno lavorare la derivata"
      lead="Non è ancora uno studio di funzione: è una cassetta degli attrezzi. Ogni teorema parte da una figura, risponde a una domanda concreta e dichiara chiaramente quando può essere usato."
    >
      <DerivativeTheoremsAppendix />
    </LessonScaffold>
  );
}

function TaylorStep({ number, title, formula, text }: { number: string; title: string; formula: string; text: string }) {
  return <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider' }}><Stack direction={{ xs: 'column', sm: 'row' }} gap={2} alignItems={{ sm: 'center' }}><Box sx={{ width: 42, height: 42, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 800 }}>P{number}</Box><Box sx={{ flex: 1 }}><Typography variant="h3" sx={{ fontSize: '1.25rem' }}>{title}</Typography><Typography variant="body2" color="text.secondary">{text}</Typography></Box><Box color="primary.main"><InlineMath math={formula} /></Box></Stack></Paper>;
}
