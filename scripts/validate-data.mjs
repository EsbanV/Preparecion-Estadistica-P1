import fs from 'node:fs'
import assert from 'node:assert/strict'
import katex from 'katex'
const load = name => JSON.parse(fs.readFileSync(`src/data/${name}.ts`, 'utf8').split(' = ')[1])
const questions = [...load('oficiales'), ...load('seguimiento')]
const results = fs.readFileSync('docs/04_resultados.md','utf8')
const rubric = fs.readFileSync('docs/Rubrica_INFO1165_Prueba_2_Practica.md','utf8')
const sourceText = results + '\n' + rubric
assert.equal(new Set(questions.map(q=>q.id)).size, questions.length)
const report = []
const counts = {}
for (const q of questions) {
  assert(q.evidence.length && q.source && q.category)
  counts[q.category] ??= {multiple:0,open:0,evidence:0}
  counts[q.category][q.type]++
  if(q.type==='open') assert(q.points.length>=3 && q.points.length<=6)
  else {
    assert.equal(q.options.length,4)
    assert.equal(new Set(q.options).size,4)
    assert(q.correctOption>=0 && q.correctOption<q.options.length)
    assert.equal(q.optionExplanations.length,q.options.length)
  }
  const texts=[q.prompt,q.explanation,q.keyFigure,...(q.options||[]),...(q.points||[]),...(q.optionExplanations||[])]
  for (const text of texts) {
    for(const formula of text.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g)) katex.renderToString(formula[1]??formula[2],{throwOnError:true,strict:'error'})
    // Filenames are evidence identifiers, not statistical quantities.
    const prose=text.replace(/(?:R|output)\/[\w/._-]+/g,'').replace(/\b12th\b/g,'')
    for(const match of prose.matchAll(/[−+]?\d+(?:[ .]\d{3})*(?:,\d+)?/g)) {
      const value=match[0]
      const found=sourceText.includes(value)
      report.push({question:q.id,value,found,context:text,source:results.includes(value)?'04_resultados.md':'Rubrica_INFO1165_Prueba_2_Practica.md'})
      assert(found,`${q.id}: cifra sin fuente ${value}`)
    }
  }
}
for(let n=1;n<=10;n++) for(const type of ['multiple','open','evidence']) assert(questions.some(q=>q.category.startsWith(`P${n} `)&&q.type===type))
fs.mkdirSync('reports',{recursive:true})
fs.writeFileSync('reports/verificacion.json',JSON.stringify({total:questions.length,counts,numbers:report,excluded:['Datos marcados FALTA DATO','Cálculos adicionales fuera del pipeline','Reportes históricos de commits'],checks:'IDs, opciones, pautas, evidencia, cobertura, LaTeX y coincidencia textual de cifras: OK'},null,2))
console.log(JSON.stringify({total:questions.length,counts,numericOccurrences:report.length,missing:report.filter(r=>!r.found)},null,2))
