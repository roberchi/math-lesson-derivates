import type { Exercise, ExerciseDB } from '@/types/exercise';

const exercises: Record<string, Exercise[]> = {
  rapporto_incrementale: [
    {
      id: 'concept_point_function', title: 'Numero o funzione?', difficulty: 1, tags: ['concetto', 'notazione'],
      problem: { text: 'Quale affermazione distingue correttamente \\(f\'(2)\\) da \\(f\'(x)\\)?', hint: 'Pensa a che cosa resta libero nell’espressione.' },
      answer: { latex: "f'(2)\\text{ è un numero; }f'(x)\\text{ è una funzione}", text: 'Nel primo caso il punto è fissato; nel secondo x può variare.' },
      distractors: [
        { latex: "f'(2)\\text{ e }f'(x)\\text{ sono sempre numeri}", feedback: 'In f′(x), x resta variabile: il risultato è una funzione.', misconceptionId: 'point-vs-function' },
        { latex: "f'(2)\\text{ è una funzione; }f'(x)\\text{ è un numero}", feedback: 'Hai invertito i ruoli: sostituire x=2 produce un numero.', misconceptionId: 'point-vs-function-reversed' },
        { latex: "f'(2)=f(2)\\text{ per ogni funzione}", feedback: 'Valore della funzione e valore della derivata misurano grandezze diverse.', misconceptionId: 'value-vs-derivative' },
      ], proof_from_limit: null,
      solution_steps: [{ label: 'Osserva la variabile', latex: "f'(2)\\in\\mathbb R,\\quad f':x\\mapsto f'(x)", explanation: 'Fissare il punto restituisce un valore; lasciare x libero definisce una nuova funzione.' }],
    },
    {
      id: 'concept_abs_lateral', title: 'Le due parti di |x|', difficulty: 2, tags: ['concetto', 'derivate laterali'],
      problem: { text: 'Perché \\(f(x)=|x|\\) non è derivabile in zero?' },
      answer: { latex: "f'_-(0)=-1\\neq 1=f'_+(0)", text: 'Le pendenze laterali non coincidono.' },
      distractors: [
        { latex: "f(0)\\text{ non esiste}", feedback: '|x| è definita e continua in zero.', misconceptionId: 'continuity-confusion' },
        { latex: "f'_-(0)=f'_+(0)=0", feedback: 'Il grafico arriva con pendenza −1 e riparte con pendenza +1.', misconceptionId: 'corner-flat' },
        { latex: "|x|\\text{ è discontinua in }0", feedback: 'Essere continua non basta per essere derivabile.', misconceptionId: 'continuity-implies-derivative' },
      ], proof_from_limit: null,
      solution_steps: [{ label: 'Confronta i lati', latex: "\\lim_{h\\to0^-}\\frac{|h|}{h}=-1,\\quad\\lim_{h\\to0^+}\\frac{|h|}{h}=1", explanation: 'Il limite bilaterale del rapporto incrementale non esiste.' }],
    },
    {
      id: 'concept_tangent_cross', title: 'La tangente può tornare sul grafico?', difficulty: 2, tags: ['concetto', 'tangente'],
      problem: { text: 'Una retta tangente può incontrare di nuovo il grafico lontano dal punto di tangenza?' },
      answer: { latex: "\\text{Sì: la tangenza è una proprietà locale}", text: 'La tangente descrive la direzione nel punto, non tutto il grafico.' },
      distractors: [
        { latex: "\\text{No, mai}", feedback: 'Questa idea confonde una proprietà locale con una separazione globale.', misconceptionId: 'tangent-never-crosses' },
        { latex: "\\text{Solo se }f'(x_0)=0", feedback: 'La possibilità non dipende dall’essere orizzontale.', misconceptionId: 'horizontal-only' },
        { latex: "\\text{Solo per le rette}", feedback: 'Per una retta la tangente coincide con il grafico; curve come le cubiche possono reincontrarla.', misconceptionId: 'line-only' },
      ], proof_from_limit: null,
      solution_steps: [{ label: 'Distingui locale e globale', latex: "f(x)=x^3-x,\\quad t_0:y=-x", explanation: 'La tangente in zero può avere altre intersezioni con la curva.' }],
    },
  ],
  regola_catena: [{
    id: 'concept_chain_factor', title: 'Il fattore nascosto', difficulty: 2, tags: ['catena', 'concetto'],
    problem: { text: 'Qual è l’errore in \\((\\sin(x^2))\'=\\cos(x^2)\\)?' },
    answer: { latex: "\\text{Manca }(x^2)'=2x", text: 'Bisogna moltiplicare per la derivata dello strato interno.' },
    distractors: [
      { latex: "\\text{Manca un segno meno}", feedback: 'Il seno deriva in coseno senza segno meno.', misconceptionId: 'trig-sign' },
      { latex: "\\text{Bisogna sostituire }x^2\\text{ con }x", feedback: 'L’interno resta dentro la derivata esterna.', misconceptionId: 'chain-remove-inner' },
      { latex: "\\text{La formula è corretta}", feedback: 'Controlla lo strato interno: anche x² varia.', misconceptionId: 'chain-inner-missing' },
    ], proof_from_limit: null,
    solution_steps: [{ label: 'Esterno poi interno', latex: "(\\sin(x^2))'=\\cos(x^2)\\cdot2x", explanation: 'Deriva il seno, conserva x², poi moltiplica per 2x.' }],
  }],
  applicazioni: [{
    id: 'concept_units_sign', title: 'Segno e unità del costo marginale', difficulty: 2, tags: ['applicazioni', 'concetto'],
    problem: { text: 'Se \\(C\'(100)=12\\) e C è misurato in euro mentre q in pezzi, che cosa significa?' },
    answer: { latex: "\\text{Il costo aumenta di circa 12 euro per ogni pezzo aggiuntivo}", text: 'Il segno indica aumento e l’unità è euro/pezzo.' },
    distractors: [
      { latex: "\\text{Il costo totale è 12 euro}", feedback: 'Hai confuso il valore del costo con il suo tasso marginale.', misconceptionId: 'value-vs-rate' },
      { latex: "\\text{Il costo diminuisce di 12 euro/pezzo}", feedback: 'Il valore della derivata è positivo, quindi indica aumento.', misconceptionId: 'derivative-sign' },
      { latex: "\\text{Si producono 12 pezzi}", feedback: '12 misura euro per pezzo, non una quantità prodotta.', misconceptionId: 'derivative-units' },
    ], proof_from_limit: null,
    solution_steps: [{ label: 'Leggi il rapporto tra unità', latex: "[C']=[C]/[q]=\\text{euro/pezzo}", explanation: 'La derivata eredita un’unità composta e il segno ne indica la direzione.' }],
  }],
};

export function addConceptExercises(db: ExerciseDB): ExerciseDB {
  return { ...db, meta: { ...db.meta, version: '2.0' }, classes: db.classes.map((cls) => ({ ...cls, exercises: [...cls.exercises, ...(exercises[cls.id] ?? [])] })) };
}
