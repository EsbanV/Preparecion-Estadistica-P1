import katex from 'katex'
import 'katex/dist/katex.min.css'

export function MathText({ text }: { text: string }) {
  return <>{text.split(/(\$\$[\s\S]*?\$\$|\$[^$]+\$)/g).map((part, index) => {
    if (!part.startsWith('$')) return <span key={index}>{part}</span>
    const displayMode = part.startsWith('$$')
    const offset = displayMode ? 2 : 1
    return <span key={index} dangerouslySetInnerHTML={{ __html: katex.renderToString(part.slice(offset, -offset), { displayMode, throwOnError: true, trust: false, strict: 'error' }) }} />
  })}</>
}
