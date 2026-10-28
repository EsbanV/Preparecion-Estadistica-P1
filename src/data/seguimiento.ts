import type { DefenseQuestion } from '../types/quiz'

export const seguimiento: DefenseQuestion[] = [
  {
    "id": "seguimiento-1",
    "type": "open",
    "category": "Decisiones de diseño",
    "prompt": "¿Por qué se utilizan logaritmos en el puntaje?",
    "points": [
      "Evitan multiplicar directamente cantidades muy pequeñas.",
      "Convierten productos en sumas manteniendo el orden de comparación.",
      "La diferencia de puntajes conserva las contribuciones de los predictores."
    ],
    "evidence": [
      "R/03_modelo.R"
    ],
    "source": "defensa.md · 1",
    "explanation": "Evitan multiplicar directamente cantidades muy pequeñas. Convierten productos en sumas manteniendo el orden de comparación. La diferencia de puntajes conserva las contribuciones de los predictores.",
    "keyFigure": "No se requiere una cifra: justifica el mecanismo y localiza la evidencia."
  },
  {
    "id": "seguimiento-2",
    "type": "open",
    "category": "Decisiones de diseño",
    "prompt": "¿Por qué se modela sexo y grupo como una categoría conjunta?",
    "points": [
      "La combinación se estima como un solo predictor categórico.",
      "Evita suponer independencia entre sexo y grupo dada la clase.",
      "Aún se supone independencia condicional entre esa categoría y los demás predictores."
    ],
    "evidence": [
      "R/03_modelo.R"
    ],
    "source": "defensa.md · 1",
    "explanation": "La combinación se estima como un solo predictor categórico. Evita suponer independencia entre sexo y grupo dada la clase. Aún se supone independencia condicional entre esa categoría y los demás predictores.",
    "keyFigure": "No se requiere una cifra: justifica el mecanismo y localiza la evidencia."
  },
  {
    "id": "seguimiento-3",
    "type": "open",
    "category": "Decisiones de diseño",
    "prompt": "¿Los ceros del cruce educación por grupo justifican directamente Laplace?",
    "points": [
      "Ese cruce es un diagnóstico de independencia.",
      "No es el conteo categórico que usa el modelo para sus probabilidades.",
      "Laplace es obligatorio y protege frente a categorías ausentes en cualquier sorteo."
    ],
    "evidence": [
      "output/tablas/educacion_g_replica1.csv"
    ],
    "source": "defensa.md · 1",
    "explanation": "Ese cruce es un diagnóstico de independencia. No es el conteo categórico que usa el modelo para sus probabilidades. Laplace es obligatorio y protege frente a categorías ausentes en cualquier sorteo.",
    "keyFigure": "No se requiere una cifra: justifica el mecanismo y localiza la evidencia."
  },
  {
    "id": "seguimiento-4",
    "type": "open",
    "category": "Supuestos",
    "prompt": "¿Qué observarías en el diagnóstico de normalidad?",
    "points": [
      "Revisar los Q–Q por clase y predictor.",
      "Las horas discretas y concentradas se apartan de la normal.",
      "La normal es una aproximación exigida; el diagnóstico documenta su limitación."
    ],
    "evidence": [
      "output/figuras/qq_replica1.png"
    ],
    "source": "defensa.md · 2",
    "explanation": "Revisar los Q–Q por clase y predictor. Las horas discretas y concentradas se apartan de la normal. La normal es una aproximación exigida; el diagnóstico documenta su limitación.",
    "keyFigure": "No se requiere una cifra: justifica el mecanismo y localiza la evidencia."
  },
  {
    "id": "seguimiento-5",
    "type": "open",
    "category": "Supuestos",
    "prompt": "¿Una correlación lineal débil prueba independencia condicional?",
    "points": [
      "La correlación se analiza dentro de cada clase.",
      "Una asociación lineal débil no descarta dependencias no lineales.",
      "El supuesto requiere más que una correlación pequeña."
    ],
    "evidence": [
      "output/figuras/edad_horas_replica1.png"
    ],
    "source": "05_evaluacion_resultados.md · 4",
    "explanation": "La correlación se analiza dentro de cada clase. Una asociación lineal débil no descarta dependencias no lineales. El supuesto requiere más que una correlación pequeña.",
    "keyFigure": "No se requiere una cifra: justifica el mecanismo y localiza la evidencia."
  },
  {
    "id": "seguimiento-6",
    "type": "open",
    "category": "Supuestos",
    "prompt": "¿Qué alternativas mencionarías ante el mal ajuste normal de horas?",
    "points": [
      "Se podría discretizar el predictor.",
      "También estudiar una transformación o una densidad kernel.",
      "Son alternativas propuestas: el modelo actual conserva la normal exigida."
    ],
    "evidence": [
      "output/figuras/qq_replica1.png"
    ],
    "source": "defensa.md · 2",
    "explanation": "Se podría discretizar el predictor. También estudiar una transformación o una densidad kernel. Son alternativas propuestas: el modelo actual conserva la normal exigida.",
    "keyFigure": "No se requiere una cifra: justifica el mecanismo y localiza la evidencia."
  },
  {
    "id": "seguimiento-7",
    "type": "open",
    "category": "Interpretación",
    "prompt": "¿Por qué puede haber sensibilidad alta y PPV bajo?",
    "points": [
      "TPR condiciona por positivos reales; PPV por positivos predichos.",
      "Una clase negativa numerosa puede generar muchos falsos positivos.",
      "Comparar verdaderos y falsos positivos junto con la prevalencia."
    ],
    "evidence": [
      "output/tablas/replicas_indicadores.csv"
    ],
    "source": "05_evaluacion_resultados.md · 1",
    "explanation": "TPR condiciona por positivos reales; PPV por positivos predichos. Una clase negativa numerosa puede generar muchos falsos positivos. Comparar verdaderos y falsos positivos junto con la prevalencia.",
    "keyFigure": "No se requiere una cifra: justifica el mecanismo y localiza la evidencia."
  },
  {
    "id": "seguimiento-8",
    "type": "open",
    "category": "Interpretación",
    "prompt": "¿Las disparidades entre grupos prueban causas o discriminación?",
    "points": [
      "Describen errores de este clasificador en estos datos.",
      "El análisis no identifica mecanismos causales.",
      "Tampoco constituye una evaluación formal de equidad."
    ],
    "evidence": [
      "output/tablas/marginales_sexo_replica1.csv"
    ],
    "source": "05_evaluacion_resultados.md · 3",
    "explanation": "Describen errores de este clasificador en estos datos. El análisis no identifica mecanismos causales. Tampoco constituye una evaluación formal de equidad.",
    "keyFigure": "No se requiere una cifra: justifica el mecanismo y localiza la evidencia."
  },
  {
    "id": "seguimiento-9",
    "type": "open",
    "category": "Interpretación",
    "prompt": "¿Cómo se obtienen correctamente las tasas marginales por sexo?",
    "points": [
      "Sumar primero los conteos de las matrices correspondientes.",
      "Calcular después cada tasa usando su denominador agregado.",
      "No promediar tasas de grupos sin considerar sus denominadores."
    ],
    "evidence": [
      "output/tablas/marginales_sexo_replica1.csv"
    ],
    "source": "03_documentacion_tecnica.md · 8",
    "explanation": "Sumar primero los conteos de las matrices correspondientes. Calcular después cada tasa usando su denominador agregado. No promediar tasas de grupos sin considerar sus denominadores.",
    "keyFigure": "No se requiere una cifra: justifica el mecanismo y localiza la evidencia."
  },
  {
    "id": "seguimiento-10",
    "type": "open",
    "category": "Hipotéticos",
    "prompt": "¿Qué pasaría al aumentar el parámetro de Laplace?",
    "points": [
      "Las probabilidades se acercan a una distribución uniforme.",
      "Los conteos observados pesan relativamente menos.",
      "Esto modifica el modelo y requiere volver a evaluarlo; no es un resultado observado del pipeline."
    ],
    "evidence": [
      "R/03_modelo.R"
    ],
    "source": "defensa.md · 5",
    "explanation": "Las probabilidades se acercan a una distribución uniforme. Los conteos observados pesan relativamente menos. Esto modifica el modelo y requiere volver a evaluarlo; no es un resultado observado del pipeline.",
    "keyFigure": "No se requiere una cifra: justifica el mecanismo y localiza la evidencia."
  },
  {
    "id": "seguimiento-11",
    "type": "open",
    "category": "Hipotéticos",
    "prompt": "¿Cómo responde el ajuste ante una desviación nula?",
    "points": [
      "El ajuste se detiene con stop().",
      "No se continúa evaluando una densidad normal con escala nula.",
      "Se registra y revisa el caso con el docente, según la rúbrica."
    ],
    "evidence": [
      "R/03_modelo.R"
    ],
    "source": "defensa.md · 5",
    "explanation": "El ajuste se detiene con stop(). No se continúa evaluando una densidad normal con escala nula. Se registra y revisa el caso con el docente, según la rúbrica.",
    "keyFigure": "No se requiere una cifra: justifica el mecanismo y localiza la evidencia."
  },
  {
    "id": "seguimiento-12",
    "type": "open",
    "category": "Datos y alcance",
    "prompt": "¿Por qué estas tasas no representan la población actual de Estados Unidos?",
    "points": [
      "La fuente corresponde a datos históricos.",
      "La tabla está restringida por el filtro educativo.",
      "No se utiliza fnlwgt para ponderar; el alcance es descriptivo de la tabla."
    ],
    "evidence": [
      "R/01_datos.R"
    ],
    "source": "defensa.md · 6",
    "explanation": "La fuente corresponde a datos históricos. La tabla está restringida por el filtro educativo. No se utiliza fnlwgt para ponderar; el alcance es descriptivo de la tabla.",
    "keyFigure": "No se requiere una cifra: justifica el mecanismo y localiza la evidencia."
  },
  {
    "id": "seguimiento-13",
    "type": "open",
    "category": "Datos y alcance",
    "prompt": "¿Identificadores disjuntos garantizan perfiles distintos?",
    "points": [
      "La disjunción evita compartir la misma fila entre destinos.",
      "Filas con identificadores diferentes pueden tener los mismos valores.",
      "La trazabilidad revisa duplicados y coincidencias entre destinos."
    ],
    "evidence": [
      "output/tablas/trazabilidad.csv"
    ],
    "source": "defensa.md · 6",
    "explanation": "La disjunción evita compartir la misma fila entre destinos. Filas con identificadores diferentes pueden tener los mismos valores. La trazabilidad revisa duplicados y coincidencias entre destinos.",
    "keyFigure": "No se requiere una cifra: justifica el mecanismo y localiza la evidencia."
  },
  {
    "id": "seguimiento-14",
    "type": "open",
    "category": "Reproducibilidad",
    "prompt": "¿Cómo defenderías la reproducibilidad de cada sorteo?",
    "points": [
      "La semilla de cada réplica sigue una regla explícita.",
      "El generador aleatorio y su configuración están fijados.",
      "Se conservan índices y resultados para reconstruir y comparar la réplica."
    ],
    "evidence": [
      "R/02_particion.R"
    ],
    "source": "defensa.md · 7",
    "explanation": "La semilla de cada réplica sigue una regla explícita. El generador aleatorio y su configuración están fijados. Se conservan índices y resultados para reconstruir y comparar la réplica.",
    "keyFigure": "No se requiere una cifra: justifica el mecanismo y localiza la evidencia."
  },
  {
    "id": "seguimiento-15",
    "type": "open",
    "category": "Reproducibilidad",
    "prompt": "¿Por qué se conserva precisión en los CSV y se redondea al presentar?",
    "points": [
      "Los archivos permiten reconstruir los cálculos.",
      "Redondear antes de calcular puede cambiar sumas y comparaciones.",
      "La escritura preserva precisión; las comprobaciones numéricas contemplan error de punto flotante."
    ],
    "evidence": [
      "R/00_utilidades.R"
    ],
    "source": "defensa.md · 7",
    "explanation": "Los archivos permiten reconstruir los cálculos. Redondear antes de calcular puede cambiar sumas y comparaciones. La escritura preserva precisión; las comprobaciones numéricas contemplan error de punto flotante.",
    "keyFigure": "No se requiere una cifra: justifica el mecanismo y localiza la evidencia."
  }
]
