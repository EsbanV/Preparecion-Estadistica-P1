# Quiz de defensa INFO-1165

React + TypeScript + Vite. Banco de 45 preguntas: 30 oficiales y 15 de seguimiento.

- `npm install`: instalar dependencias.
- `npm run dev`: abrir la práctica local.
- `npm run build`: comprobar TypeScript y compilar.
- `npm run validate:data`: validar el banco y escribir `reports/verificacion.json` con todas las apariciones numéricas auditadas.

## Archivos

- `src/types/quiz.ts`: unión de tipos, con compatibilidad para alternativas anteriores.
- `src/data/oficiales.ts`, `src/data/seguimiento.ts`: preguntas y pautas con fuente y evidencia.
- `src/App.tsx`: selección de modo, respuestas, autoevaluación y resultado por categoría.
- `src/session.ts`: sorteo sin duplicados y barajado sincronizado de opciones, correcta y explicaciones.
- `src/MathText.tsx`: LaTeX mediante KaTeX, sin habilitar comandos de confianza.
- `src/styles.css`: diseño y adaptación a celular.
- `scripts/validate-data.mjs`: verificaciones del banco, cobertura, cifras y fórmulas.

## Contenido y evaluación

Cada pregunta oficial tiene una alternativa, una respuesta oral y una pregunta de evidencia. Los seguimientos son orales: Decisiones de diseño, Supuestos e Interpretación tienen tres cada una; Hipotéticos, Datos y alcance y Reproducibilidad tienen dos cada una.

Cada alternativa vale un punto; cada respuesta oral vale la proporción de puntos cubiertos de su pauta. El resultado general y por categoría promedia esas puntuaciones. El simulacro contiene diez preguntas sin duplicados y al menos cuatro orales.

Las cifras proceden de `docs/04_resultados.md`; las definiciones metodológicas respetan la rúbrica. El informe numérico incluye el texto donde aparece cada cifra. La comprobación automática es textual; la revisión de contexto se hizo contrastando las secciones citadas. No se incluyeron datos pendientes ni cálculos adicionales fuera del pipeline. Las rutas de evidencia son referencias al proyecto R, no enlaces a archivos que esta web aloje.

## Verificación realizada

- Compilación TypeScript y Vite: correcta.
- Banco: 45 IDs únicos; cuatro opciones por pregunta cerrada; índices, pautas y evidencias válidos.
- Cifras: 35 apariciones auditadas, ninguna sin coincidencia textual en resultados o rúbrica.
- Navegador: recorrido completo de todas las preguntas, categoría P1, tipo alternativas y simulacro (siete orales en el sorteo probado).
- Pantalla de inicio a 390 px: sin desbordamiento horizontal.

La versión preparada se conserva localmente para revisión; no se realizó commit, push ni despliegue de estos cambios.
