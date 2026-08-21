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
import { Derivation } from '@/components/lesson/Derivation';
import { HistoryNote } from '@/components/lesson/HistoryNote';
import { LessonScaffold, PerspectiveCard, SectionBlock } from '@/components/lesson/LessonScaffold';
import { TaylorLab } from '@/components/labs/TaylorLab';
import { ConcavityExamples, SecondDerivativeLab } from '@/components/labs/SecondDerivativeLab';
import { MathText } from '@/components/math/MathText';
import { lessonTwoSections } from '@/data/course';

export function LessonTwoPage() {
  const { sectionId = '' } = useParams();
  if (!lessonTwoSections.some((section) => section.id === sectionId)) return <Navigate to="/" replace />;
  if (sectionId === 'warmup') return <WarmupSection />;
  if (sectionId === 'fondamentali') return <FundamentalsSection />;
  if (sectionId === 'regole') return <RulesSection />;
  if (sectionId === 'derivata-seconda') return <SecondDerivativeSection />;
  return <TaylorSection />;
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
    </LessonScaffold>
  );
}

function FundamentalsSection() {
  const rows = [
    ['c', 'Δy = 0', '0'],
    ['x^n', 'binomio di Newton', 'nx^{n-1}'],
    ['e^x', '\\lim (e^h-1)/h=1', 'e^x'],
    ['\\ln x', 'inversa di e^x', '\\frac1x'],
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
          <Derivation title="Potenza intera" formula="(x^n)'=nx^{n-1}" steps={[
            { label: 'Definizione', formula: "\\frac{(x+h)^n-x^n}{h}", explanation: 'Partiamo dal rapporto incrementale.' },
            { label: 'Binomio di Newton', formula: "(x+h)^n=x^n+nx^{n-1}h+\\binom n2x^{n-2}h^2+\\cdots+h^n", explanation: 'Il primo termine cancella \\(x^n\\); tutti gli altri contengono h.' },
            { label: 'Dividi per h', formula: "nx^{n-1}+\\binom n2x^{n-2}h+\\cdots+h^{n-1}", explanation: 'Dopo la semplificazione solo il primo termine non conserva un fattore h.' },
            { label: 'Limite', formula: "\\lim_{h\\to0}(nx^{n-1}+h\\cdot\\ldots)=nx^{n-1}", explanation: 'I termini che contengono h tendono a zero.' },
          ]} conclusion="La regola della potenza non è un trucco: è il primo coefficiente del binomio di Newton che sopravvive al limite." />
          <Derivation title="Logaritmo naturale" formula="(\ln x)'=1/x" steps={[
            { label: 'Funzioni inverse', formula: "y=\\ln x\\iff x=e^y", explanation: 'Il logaritmo naturale è l’inversa dell’esponenziale.' },
            { label: 'Deriva implicitamente', formula: "1=e^y\\frac{dy}{dx}", explanation: 'Deriviamo entrambi i membri rispetto a x; la catena produce dy/dx.' },
            { label: 'Sostituisci e risolvi', formula: "\\frac{dy}{dx}=\\frac1{e^y}=\\frac1x", explanation: 'Poiché \\(e^y=x\\), otteniamo il reciproco di x.' },
          ]} conclusion="Per x > 0, \((\ln x)'=1/x\)." />
          <Derivation title="Coseno" formula="(\cos x)'=-\sin x" steps={[
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
        <Derivation title="Linearità" formula="(\alpha f+\beta g)'=\alpha f'+\beta g'" defaultExpanded steps={[
          { label: 'Rapporto incrementale', formula: "\\frac{\\alpha[f(x+h)-f(x)]+\\beta[g(x+h)-g(x)]}{h}", explanation: 'Raggruppiamo separatamente le variazioni di f e g.' },
          { label: 'Separa e passa al limite', formula: "\\alpha\\lim_{h\\to0}\\frac{f(x+h)-f(x)}h+\\beta\\lim_{h\\to0}\\frac{g(x+h)-g(x)}h", explanation: 'Il limite della somma è la somma dei limiti; le costanti escono.' },
        ]} conclusion="Derivare è un’operazione lineare." />
        <Derivation title="Regola del prodotto" formula="(fg)'=f'g+fg'" steps={[
          { label: 'Definizione', formula: "\\frac{f(x+h)g(x+h)-f(x)g(x)}h", explanation: 'Il numeratore non si separa direttamente.' },
          { label: 'Aggiungi zero', formula: "\\frac{f(x+h)g(x+h)-f(x)g(x+h)+f(x)g(x+h)-f(x)g(x)}h", explanation: 'Aggiungiamo e sottraiamo \\(f(x)g(x+h)\\): è il trucco di Leibniz.' },
          { label: 'Raccogli', formula: "g(x+h)\\frac{f(x+h)-f(x)}h+f(x)\\frac{g(x+h)-g(x)}h", explanation: 'Ora riconosciamo i due rapporti incrementali.' },
          { label: 'Limite', formula: "g(x)f'(x)+f(x)g'(x)", explanation: 'La derivabilità implica continuità, quindi \\(g(x+h)\\to g(x)\\).' },
        ]} conclusion="Si deriva un fattore alla volta, lasciando fermo l’altro, e si sommano i contributi." />
        <Derivation title="Regola del quoziente" formula="\left(\frac fg\right)'=\frac{f'g-fg'}{g^2}" steps={[
          { label: 'Riscrivi come prodotto', formula: "f=\\frac fg\\cdot g", explanation: 'La ricaviamo dalla regola del prodotto, con \\(g\\neq0\\).' },
          { label: 'Deriva', formula: "f'=\\left(\\frac fg\\right)'g+\\frac fg\\,g'", explanation: 'Applichiamo la regola del prodotto al membro destro.' },
          { label: 'Isola la derivata', formula: "\\left(\\frac fg\\right)'=\\frac{f'g-fg'}{g^2}", explanation: 'Portiamo il secondo termine a sinistra e dividiamo per g.' },
        ]} conclusion="Nel numeratore l’ordine conta: derivata del sopra per sotto meno sopra per derivata del sotto." />
        <Derivation title="Regola della catena" formula="(f\circ g)'=f'(g)\,g'" steps={[
          { label: 'Rapporto della composta', formula: "\\frac{f(g(x+h))-f(g(x))}{h}", explanation: 'La variazione esterna dipende dalla variazione della funzione interna.' },
          { label: 'Introduci k', formula: "\\frac{f(g(x)+k)-f(g(x))}{k}\\cdot\\frac{g(x+h)-g(x)}h,\\quad k=g(x+h)-g(x)", explanation: 'Moltiplichiamo e dividiamo per la variazione interna k.' },
          { label: 'Passa al limite', formula: "f'(g(x))\\cdot g'(x)", explanation: 'Per continuità di g, \\(h\\to0\\) implica \\(k\\to0\\).' },
        ]} conclusion="Deriva l’esterno valutato nell’interno, poi moltiplica per la derivata dell’interno." />
      </Stack>

      <SectionBlock eyebrow="Esempio canonico" title="sin(x²): leggere gli strati">
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}><Typography variant="caption" color="primary.main">INTERNO</Typography><Box mt={1}><InlineMath math="g(x)=x^2,\quad g'(x)=2x" /></Box></Grid>
            <Grid item xs={12} sm={4}><Typography variant="caption" color="primary.main">ESTERNO</Typography><Box mt={1}><InlineMath math="f(u)=\sin u,\quad f'(u)=\cos u" /></Box></Grid>
            <Grid item xs={12} sm={4}><Typography variant="caption" color="primary.main">COMPOSIZIONE</Typography><Box mt={1}><InlineMath math="(\sin x^2)'=\cos(x^2)\,2x" /></Box></Grid>
          </Grid>
        </Paper>
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
          Sposta il punto lungo la funzione e confronta tangente, segno di <InlineMath math="f''" /> e cerchio osculatore. Il cerchio non sostituisce la tangente: aggiunge l’informazione su quanto e verso dove la curva sta piegando.
        </Typography>
        <SecondDerivativeLab />
      </SectionBlock>
      <SectionBlock eyebrow="Anteprima dello studio di funzione" title="Punti stazionari e flessi">
        <Typography paragraph>Un punto è stazionario quando <InlineMath math="f'(x_0)=0" />: la tangente è orizzontale. Può essere un massimo, un minimo o un flesso; per distinguerli servirà studiare il segno di f′ e f″.</Typography>
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', overflowX: 'auto' }}><BlockMath math="f(x)=x^3-3x\quad\Rightarrow\quad f'(x)=3x^2-3\quad\Rightarrow\quad x=\pm1" /><Typography variant="body2" color="text.secondary">I due punti hanno tangente orizzontale. La derivata seconda <InlineMath math="f''(x)=6x" /> aiuta a capire che uno è un massimo e l’altro un minimo.</Typography></Paper>
      </SectionBlock>
      <Alert severity="info">Questo è solo un ponte: massimi, minimi, flessi e teoremi di Rolle e Lagrange saranno sviluppati nel modulo sullo studio completo di funzione.</Alert>
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
    <LessonScaffold sectionId="taylor" eyebrow="Lezione 2 · 1:50–2:05 · Opzionale" title="Il DNA locale di una funzione" lead="Le derivate non servono soltanto a calcolare pendenze: raccolte tutte nello stesso punto, possono costruire polinomi che imitano una funzione.">
      <Alert severity="warning" icon="★"><strong>Approfondimento avanzato.</strong> Questa sezione non fa parte della verifica di base.</Alert>
      <SectionBlock eyebrow="Costruzione in tre passi" title="Quante informazioni vogliamo conservare?">
        <Stack spacing={1.5}>
          <TaylorStep number="0" title="Stesso valore" formula="P_0(x)=f(0)" text="Il miglior polinomio costante conosce soltanto il punto di partenza." />
          <TaylorStep number="1" title="Stesso valore e stessa pendenza" formula="P_1(x)=f(0)+f'(0)x" text="Aggiungiamo la retta tangente: vicino a zero la funzione e il polinomio si muovono nello stesso modo." />
          <TaylorStep number="2" title="Aggiungiamo la curvatura" formula="P_2(x)=f(0)+f'(0)x+\frac{f''(0)}{2!}x^2" text="La derivata seconda fa coincidere anche la concavità locale." />
        </Stack>
        <Paper elevation={0} sx={{ mt: 2, p: 3, bgcolor: 'custom.ink', color: '#F2F5FA', overflowX: 'auto' }}><BlockMath math="P_n(x)=\sum_{k=0}^{n}\frac{f^{(k)}(0)}{k!}x^k" /></Paper>
      </SectionBlock>
      <SectionBlock eyebrow="Laboratorio" title="Aggiungi una derivata alla volta">
        <TaylorLab />
      </SectionBlock>
      <SectionBlock title="Tre sviluppi fondamentali">
        <Stack spacing={1}>{developments.map(([fn, series]) => <Paper key={fn} elevation={0} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '120px 1fr' }, gap: 2, p: 2, border: '1px solid', borderColor: 'divider', overflowX: 'auto' }}><Box color="primary.main"><InlineMath math={fn} /></Box><InlineMath math={series} /></Paper>)}</Stack>
        <Typography variant="body2" color="text.secondary" mt={2}>Per queste tre funzioni la serie converge su tutto ℝ, ma a ordine fissato l’approssimazione è generalmente migliore vicino all’origine.</Typography>
      </SectionBlock>
      <Paper elevation={0} sx={{ p: 3, bgcolor: 'custom.goldLight', borderLeft: '4px solid', borderColor: 'custom.gold' }}><Typography variant="h3" mb={1}>Insight centrale</Typography><Typography>Ogni termine usa una derivata di ordine k in zero. La derivata è il DNA locale della funzione: contiene l’informazione su valore, direzione, curvatura e variazioni di ordine superiore.</Typography></Paper>
      <HistoryNote title="Taylor, MacLaurin e Cauchy" summary="La formula nasce nel Settecento; capire quando rappresenta davvero la funzione richiederà un altro secolo." href="https://mathshistory.st-andrews.ac.uk/Biographies/Taylor/">
        Brook Taylor pubblicò la formula nel 1715. Colin MacLaurin studiò sistematicamente il caso centrato in zero. Nell’Ottocento Cauchy chiarì che possedere derivate di ogni ordine non garantisce automaticamente che la serie converga alla funzione.
      </HistoryNote>
    </LessonScaffold>
  );
}

function TaylorStep({ number, title, formula, text }: { number: string; title: string; formula: string; text: string }) {
  return <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider' }}><Stack direction={{ xs: 'column', sm: 'row' }} gap={2} alignItems={{ sm: 'center' }}><Box sx={{ width: 42, height: 42, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 800 }}>P{number}</Box><Box sx={{ flex: 1 }}><Typography variant="h3" sx={{ fontSize: '1.25rem' }}>{title}</Typography><Typography variant="body2" color="text.secondary">{text}</Typography></Box><Box color="primary.main"><InlineMath math={formula} /></Box></Stack></Paper>;
}
