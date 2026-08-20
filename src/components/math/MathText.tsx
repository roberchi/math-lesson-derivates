import { Fragment } from 'react';
import { Box } from '@mui/material';
import { BlockMath, InlineMath } from 'react-katex';

type Segment = { type: 'text' | 'inline' | 'block'; content: string };

export function parseMathText(text: string): Segment[] {
  const segments: Segment[] = [];
  const pattern = /(\$\$[\s\S]*?\$\$|\\\([\s\S]*?\\\))/g;
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > cursor) segments.push({ type: 'text', content: text.slice(cursor, index) });
    const token = match[0];
    if (token.startsWith('$$')) {
      segments.push({ type: 'block', content: token.slice(2, -2) });
    } else {
      segments.push({ type: 'inline', content: token.slice(2, -2) });
    }
    cursor = index + token.length;
  }
  if (cursor < text.length) segments.push({ type: 'text', content: text.slice(cursor) });
  return segments;
}

export function MathText({ text }: { text: string }) {
  return (
    <Box component="span" sx={{ whiteSpace: 'pre-line', '& .katex': { color: 'inherit' } }}>
      {parseMathText(text).map((segment, index) => (
        <Fragment key={`${segment.type}-${index}`}>
          {segment.type === 'inline' && <InlineMath math={segment.content} />}
          {segment.type === 'block' && (
            <Box sx={{ overflowX: 'auto', py: 1 }}><BlockMath math={segment.content} /></Box>
          )}
          {segment.type === 'text' && segment.content}
        </Fragment>
      ))}
    </Box>
  );
}

export function MathFormula({ math, block = false }: { math: string; block?: boolean }) {
  return block ? (
    <Box sx={{ overflowX: 'auto', py: 0.5 }}><BlockMath math={math} /></Box>
  ) : (
    <InlineMath math={math} />
  );
}
