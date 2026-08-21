import { Alert, Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { BlockMath, InlineMath } from 'react-katex';
import { Navigate, useParams } from 'react-router-dom';
import { Derivation } from '@/components/lesson/Derivation';
import { HistoryNote } from '@/components/lesson/HistoryNote';
import { LessonScaffold, PerspectiveCard, SectionBlock } from '@/components/lesson/LessonScaffold';
import { GeometryLab } from '@/components/labs/GeometryLab';
import { MathText } from '@/components/math/MathText';
import { lessonOneSections } from '@/data/course';

export function LessonOnePage() {
  const { sectionId = '' } = useParams();
  if (!lessonOneSections.some((section) => section.id === sectionId)) return <Navigate to="/" replace />;
  if (sectionId === 'velocita') return <VelocitySection />;
  if (sectionId === 'geometria') return <GeometrySection />;
  if (sectionId === 'definizione') return <DefinitionSection />;
  if (sectionId === 'derivabilita') return <DifferentiabilitySection />;
  return <InterpretationsSection />;
}

function VelocitySection() {
  return (
    <LessonScaffold sectionId="velocita" eyebrow="Lezione 1 · 0:00–0:10" title="Una velocità in un solo istante" lead="Prima della formula viene il problema: la velocità media descrive un intervallo, ma come possiamo misurare il movimento in un istante che non ha durata?">
      <SectionBlock eyebrow="La situazione concreta" title="Un oggetto sta cadendo">
        <Typography paragraph>Immagina di osservare un oggetto che cade. Il suo spazio percorso non cresce sempre allo stesso ritmo: ogni secondo va più veloce. Conoscendo due posizioni possiamo calcolare la velocità media, ma il tachimetro mostra qualcosa di diverso: una velocità in quell’istante.</Typography>
        <Grid container spacing={2} mt={1}>
          {[
            { label: 'OSSERVO', value: 'due posizioni', body: 'La posizione al tempo t e poco dopo, al tempo t + h.' },
            { label: 'MISURO', value: 'una variazione', body: 'Quanto spazio è stato percorso durante quel piccolo intervallo.' },
            { label: 'DOMANDO', value: 'e in un istante?', body: 'Rendiamo l’intervallo sempre più piccolo, senza porlo uguale a zero.' },
          ].map((item) => <Grid item xs={12} sm={4} key={item.label}><Paper elevation={0} sx={{ p: 2.5, height: '100%', border: '1px solid', borderColor: 'divider' }}><Typography variant="caption" color="primary.main">{item.label}</Typography><Typography variant="h3" sx={{ my: 1 }}>{item.value}</Typography><Typography variant="body2">{item.body}</Typography></Paper></Grid>)}
        </Grid>
      </SectionBlock>

      <Paper elevation={0} sx={{ bgcolor: 'custom.ink', color: '#F2F5FA', p: { xs: 3, sm: 4 }, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ color: '#91A3FA', mb: 2 }}>Il ponte verso il limite</Typography>
        <Typography sx={{ color: '#C9D2E0', mb: 2 }}>Dopo aver formulato la domanda, possiamo darle un linguaggio. Se la legge oraria è <InlineMath math="s(t)=\tfrac12gt^2" />, la velocità media tra <InlineMath math="t" /> e <InlineMath math="t+h" /> è:</Typography>
        <Box sx={{ overflowX: 'auto', '& .katex': { fontSize: '1.25em' } }}><BlockMath math="v_m=\frac{s(t+h)-s(t)}{h}" /></Box>
        <Typography sx={{ color: '#C9D2E0', mt: 2 }}>La velocità istantanea emerge osservando cosa succede quando <InlineMath math="h" /> si avvicina a zero. È esattamente il tipo di domanda a cui risponde un limite.</Typography>
      </Paper>

      <HistoryNote title="Galileo e il problema della velocità" summary="Galileo descrive il moto accelerato nel 1638, ma gli manca ancora il calcolo infinitesimale." href="https://mathshistory.st-andrews.ac.uk/Biographies/Galileo/">
        Galileo comprese che nella caduta libera lo spazio cresce come il quadrato del tempo. Poteva descrivere il moto su intervalli, ma non disponeva ancora di una definizione rigorosa di velocità istantanea. Newton e Leibniz costruiranno gli strumenti necessari alcuni decenni dopo la sua morte.
      </HistoryNote>

      <Alert severity="info"><strong>Domanda da portare alla sezione successiva:</strong> se la velocità è la pendenza di un grafico spazio-tempo, come troviamo la pendenza di una curva in un punto?</Alert>
    </LessonScaffold>
  );
}

function GeometrySection() {
  return (
    <LessonScaffold sectionId="geometria" eyebrow="Lezione 1 · 0:10–0:30" title="La secante diventa tangente" lead="La derivata nasce geometricamente facendo avvicinare due punti del grafico. Muovi h e guarda la pendenza della secante convergere verso quella della tangente.">
      <GeometryLab />
      <SectionBlock eyebrow="Lettura guidata" title="Dal rapporto incrementale alla pendenza">
        <Typography paragraph>Fissiamo il punto <InlineMath math="P=(x_0,f(x_0))" /> e scegliamo un secondo punto <InlineMath math="Q=(x_0+h,f(x_0+h))" />. La retta che li attraversa è una secante.</Typography>
        <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(65,88,208,.07)', borderLeft: '3px solid', borderColor: 'primary.main', overflowX: 'auto' }}><BlockMath math="m_{\mathrm{sec}}=\frac{\Delta y}{\Delta x}=\frac{f(x_0+h)-f(x_0)}{h}" /></Paper>
        <Typography paragraph mt={2}>Quando <InlineMath math="h\to0" />, il punto Q si avvicina a P e le rette secanti tendono a una posizione limite: la retta tangente. La sua pendenza è <InlineMath math="f'(x_0)" />.</Typography>
      </SectionBlock>
      <SectionBlock eyebrow="Esempio obbligatorio" title="Per f(x) = x² nel punto x₀ = 1">
        <Stack spacing={1.25}>
          <MathLine number="1" formula="\frac{f(1+h)-f(1)}{h}=\frac{(1+h)^2-1}{h}" text="Sostituiamo la funzione nel rapporto incrementale." />
          <MathLine number="2" formula="\frac{1+2h+h^2-1}{h}=\frac{2h+h^2}{h}=2+h" text="Sviluppiamo il quadrato e semplifichiamo h, che è diverso da zero mentre calcoliamo il rapporto." />
          <MathLine number="3" formula="\lim_{h\to0}(2+h)=2" text="La pendenza della tangente in x₀ = 1 è 2." />
        </Stack>
      </SectionBlock>
      <HistoryNote title="Leibniz, gli infinitesimi e dy/dx" summary="La notazione dy/dx conserva l’intuizione geometrica di un rapporto fra variazioni." href="https://mathshistory.st-andrews.ac.uk/Biographies/Leibniz/">
        Nel 1675 Leibniz introdusse i simboli dx e dy. Li pensava come variazioni infinitamente piccole: un’idea potentissima, anche se la base rigorosa arriverà nell’Ottocento con la definizione di limite di Cauchy.
      </HistoryNote>
    </LessonScaffold>
  );
}

function DefinitionSection() {
  return (
    <LessonScaffold sectionId="definizione" eyebrow="Lezione 1 · 0:30–0:55" title="La definizione formale" lead="Ora diamo forma precisa all’intuizione geometrica e fisica. La derivata esiste quando il rapporto incrementale tende a un valore finito.">
      <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, bgcolor: 'custom.ink', color: '#F2F5FA', textAlign: 'center' }}>
        <Typography variant="h4" sx={{ color: '#91A3FA', mb: 2 }}>Definizione</Typography>
        <Typography sx={{ color: '#C9D2E0' }}>f si dice derivabile in x₀ se esiste finito il limite</Typography>
        <Box sx={{ overflowX: 'auto', my: 2, '& .katex': { fontSize: '1.35em' } }}><BlockMath math="f'(x_0)=\lim_{h\to0}\frac{f(x_0+h)-f(x_0)}{h}" /></Box>
        <Typography sx={{ color: '#C9D2E0' }}>Quel numero è la derivata di f in x₀.</Typography>
      </Paper>

      <SectionBlock title="Un numero oppure una funzione?">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><PerspectiveCard icon="•" label="IN UN PUNTO" title="f′(x₀) è un numero">Misura la pendenza o il tasso di variazione in uno specifico punto x₀.</PerspectiveCard></Grid>
          <Grid item xs={12} sm={6}><PerspectiveCard icon="ƒ" label="PER OGNI PUNTO" title="f′(x) è una funzione">Ripetendo il limite per ogni x otteniamo una nuova funzione: la funzione derivata.</PerspectiveCard></Grid>
        </Grid>
        <Stack direction="row" gap={1} flexWrap="wrap" useFlexGap mt={2}>{["f'(x)\\;\\text{(Lagrange)}", '\\frac{dy}{dx}\\;\\text{(Leibniz)}', 'Df\\;\\text{(operatoriale)}', '\\dot{x}\\;\\text{(Newton, nel tempo)}'].map((math) => <Paper key={math} elevation={0} sx={{ py: 1, px: 1.5, border: '1px solid', borderColor: 'divider' }}><InlineMath math={math} /></Paper>)}</Stack>
      </SectionBlock>

      <SectionBlock eyebrow="Tre derivazioni obbligatorie" title="Le formule nascono dal limite">
        <Stack spacing={2}>
          <Derivation title="Derivata di x²" formula="(x^2)'=2x" meaning="Dice che la pendenza della parabola \(y=x^2\), in ogni punto \(x\), vale \(2x\). A destra dell’origine è positiva, a sinistra è negativa e in zero vale zero." defaultExpanded steps={[
            { label: 'Rapporto incrementale', formula: "\\frac{(x+h)^2-x^2}{h}", explanation: 'Partiamo dalla definizione con \\(f(x)=x^2\\).' },
            { label: 'Sviluppa il quadrato', formula: "\\frac{x^2+2xh+h^2-x^2}{h}", explanation: 'Usiamo \\((x+h)^2=x^2+2xh+h^2\\) e cancelliamo \\(x^2\\).' },
            { label: 'Semplifica h', formula: "\\frac{h(2x+h)}{h}=2x+h", explanation: 'Per \\(h\\neq0\\) possiamo semplificare il fattore h.' },
            { label: 'Passa al limite', formula: "\\lim_{h\\to0}(2x+h)=2x", explanation: 'Quando h tende a zero rimane \\(2x\\).' },
          ]} conclusion="Quindi, per ogni x, \((x^2)'=2x\)." />
          <Derivation title="Derivata di sin x" formula="(\sin x)'=\cos x" meaning="Dice che la pendenza del grafico del seno nel punto \(x\) è il valore del coseno nello stesso punto. Quando \(\cos x=0\), il seno ha tangente orizzontale." steps={[
            { label: 'Rapporto incrementale', formula: "\\frac{\\sin(x+h)-\\sin x}{h}", explanation: 'La definizione applicata al seno.' },
            { label: 'Prostaferesi', formula: "\\sin(x+h)-\\sin x=2\\cos\\left(x+\\frac h2\\right)\\sin\\frac h2", explanation: 'Usiamo la formula per la differenza di due seni.' },
            { label: 'Riorganizza', formula: "\\cos\\left(x+\\frac h2\\right)\\frac{\\sin(h/2)}{h/2}", explanation: 'Compare il limite notevole \\(\\sin t/t\\) con \\(t=h/2\\).' },
            { label: 'Passa al limite', formula: "\\cos(x+0)\\cdot1=\\cos x", explanation: 'Il coseno è continuo e il limite notevole vale 1.' },
          ]} conclusion="Il seno diventa coseno: \((\sin x)'=\cos x\)." />
          <Derivation title="Derivata di eˣ" formula="(e^x)'=e^x" meaning="Dice che l’esponenziale cresce, in ogni punto, con una velocità uguale al proprio valore. Per esempio, quando \(e^x=3\), anche la sua pendenza vale 3." steps={[
            { label: 'Rapporto incrementale', formula: "\\frac{e^{x+h}-e^x}{h}", explanation: 'Applichiamo la definizione.' },
            { label: 'Raccogli eˣ', formula: "e^x\\frac{e^h-1}{h}", explanation: 'Poiché \\(e^{x+h}=e^xe^h\\), il fattore \\(e^x\\) esce dal rapporto.' },
            { label: 'Limite notevole', formula: "e^x\\lim_{h\\to0}\\frac{e^h-1}{h}=e^x\\cdot1", explanation: 'Usiamo il limite notevole dell’esponenziale.' },
          ]} conclusion="L’esponenziale è uguale alla propria derivata: \((e^x)'=e^x\)." />
        </Stack>
      </SectionBlock>

      <HistoryNote title="Newton e Leibniz: due linguaggi per il cambiamento" summary="Due scoperte indipendenti, una disputa accesa e notazioni che usiamo ancora oggi." href="https://mathshistory.st-andrews.ac.uk/HistTopics/Newton_Leibniz/">
        Newton sviluppò il metodo delle flussioni pensando a grandezze che scorrono nel tempo; Leibniz costruì un linguaggio di differenziali più adatto al calcolo simbolico. Oggi usiamo entrambe le intuizioni, rese rigorose dalla teoria dei limiti.
      </HistoryNote>
    </LessonScaffold>
  );
}

function DifferentiabilitySection() {
  return (
    <LessonScaffold sectionId="derivabilita" eyebrow="Lezione 1 · 1:05–1:30" title="Continua non significa derivabile" lead="Una funzione derivabile è sempre continua. Il contrario, però, può fallire: un grafico può non spezzarsi e avere comunque uno spigolo o una tangente verticale.">
      <SectionBlock eyebrow="Teorema" title="Derivabilità ⇒ continuità">
        <Typography paragraph>Se f è derivabile in x₀, allora è continua in x₀. La dimostrazione usa lo stesso rapporto incrementale:</Typography>
        <Paper elevation={0} sx={{ bgcolor: 'custom.ink', color: '#F2F5FA', px: 2, py: 1, overflowX: 'auto' }}><BlockMath math="f(x_0+h)-f(x_0)=\frac{f(x_0+h)-f(x_0)}{h}\cdot h\longrightarrow f'(x_0)\cdot0=0" /></Paper>
        <Typography mt={2}>Quindi <InlineMath math="f(x_0+h)\to f(x_0)" />. Il viceversa non vale: <InlineMath math="f(x)=|x|" /> è continua in 0 ma le pendenze laterali sono −1 e +1.</Typography>
      </SectionBlock>
      <SectionBlock eyebrow="Laboratorio dei casi limite" title="Che cosa fa la secante nel punto singolare?">
        <Typography paragraph>Seleziona i tre casi e porta x₀ a zero. Nel punto angoloso le due pendenze laterali non coincidono; nella cuspide e nella tangente verticale la pendenza non resta finita.</Typography>
        <GeometryLab singularMode />
      </SectionBlock>
      <Grid container spacing={2}>
        {[
          { title: 'Punto angoloso', math: '|x|', body: 'Le derivate laterali esistono e sono finite, ma hanno valori diversi.' },
          { title: 'Cuspide', math: 'x^{2/3}', body: 'Le pendenze laterali diventano infinite con segni opposti: il grafico forma una punta.' },
          { title: 'Tangente verticale', math: '\\sqrt[3]{x}', body: 'Le pendenze crescono senza limite con lo stesso segno: la tangente è verticale.' },
        ].map((item) => <Grid item xs={12} sm={4} key={item.title}><Paper elevation={0} sx={{ p: 2.5, height: '100%', border: '1px solid', borderColor: 'divider' }}><Typography variant="h3" sx={{ fontSize: '1.3rem' }}>{item.title}</Typography><Box sx={{ my: 1.5, color: 'primary.main' }}><InlineMath math={`f(x)=${item.math}`} /></Box><Typography variant="body2">{item.body}</Typography></Paper></Grid>)}
      </Grid>
    </LessonScaffold>
  );
}

function InterpretationsSection() {
  return (
    <LessonScaffold sectionId="interpretazioni" eyebrow="Lezione 1 · 1:30–2:00" title="Tre modi di dire “derivata”" lead="Lo stesso oggetto matematico descrive una pendenza, un limite e un tasso di variazione. Saper passare da una lettura all’altra è il vero obiettivo della lezione.">
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}><PerspectiveCard icon="◢" label="GEOMETRICA" title="Pendenza della tangente">Sul grafico, f′(x₀) dice quanto è inclinata la curva nel punto x₀.</PerspectiveCard></Grid>
        <Grid item xs={12} md={4}><PerspectiveCard icon="lim" label="ANALITICA" title="Limite del rapporto"><MathText text={'\\(f′(x_0)=\\lim_{h\\to0}[f(x_0+h)-f(x_0)]/h\\).'} /></PerspectiveCard></Grid>
        <Grid item xs={12} md={4}><PerspectiveCard icon="↗" label="FISICA" title="Tasso istantaneo">Se f misura una grandezza, f′ misura quanto rapidamente sta cambiando.</PerspectiveCard></Grid>
      </Grid>
      <SectionBlock eyebrow="Nel mondo reale" title="La stessa idea cambia nome">
        <Grid container spacing={2}>
          {[
            { icon: '🚗', title: 'Velocità', formula: "v(t)=s'(t)", body: 'La derivata della posizione rispetto al tempo.' },
            { icon: '⚡', title: 'Corrente', formula: 'i(t)=\\frac{dq}{dt}', body: 'La velocità con cui passa la carica elettrica.' },
            { icon: '🦠', title: 'Crescita', formula: "N'(t)", body: 'Il tasso di crescita istantaneo di una popolazione.' },
            { icon: '€', title: 'Costo marginale', formula: "C'(q)", body: 'Quanto costa produrre una piccola unità in più.' },
          ].map((item) => <Grid item xs={12} sm={6} key={item.title}><Paper elevation={0} sx={{ p: 2.5, height: '100%', border: '1px solid', borderColor: 'divider' }}><Stack direction="row" gap={2}><Typography fontSize="1.6rem">{item.icon}</Typography><Box><Typography variant="h3" sx={{ fontSize: '1.3rem' }}>{item.title}</Typography><Box my={1} color="primary.main"><InlineMath math={item.formula} /></Box><Typography variant="body2">{item.body}</Typography></Box></Stack></Paper></Grid>)}
        </Grid>
      </SectionBlock>
      <Paper elevation={0} sx={{ p: 3, bgcolor: 'custom.goldLight', borderLeft: '4px solid', borderColor: 'custom.gold' }}>
        <Typography variant="h4" sx={{ color: 'custom.gold', mb: 1 }}>Domanda di chiusura</Typography>
        <Typography variant="h3">«Cos’è la derivata?»</Typography>
        <Typography mt={1}>Prova a rispondere senza formule, una volta da geometra, una da analista e una da fisico. Poi passa alla scheda §1.</Typography>
      </Paper>
      <HistoryNote title="Dalle orbite al machine learning" summary="La derivata è diventata il linguaggio comune dei sistemi che cambiano." href="https://www.3blue1brown.com/lessons/essence-of-calculus">
        Dalla meccanica di Newton alle equazioni dell’elettromagnetismo, dal costo marginale all’ottimizzazione dei modelli di machine learning, la derivata permette di trasformare il cambiamento in un oggetto calcolabile.
      </HistoryNote>
    </LessonScaffold>
  );
}

function MathLine({ number, formula, text }: { number: string; formula: string; text: string }) {
  return (
    <Paper elevation={0} sx={{ display: 'grid', gridTemplateColumns: '32px minmax(0,1fr)', gap: 1.5, p: 2, border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', display: 'grid', placeItems: 'center', fontSize: '.75rem' }}>{number}</Box>
      <Box sx={{ minWidth: 0 }}><Box sx={{ overflowX: 'auto' }}><BlockMath math={formula} /></Box><Typography variant="body2" color="text.secondary">{text}</Typography></Box>
    </Paper>
  );
}
