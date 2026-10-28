import type { DefenseQuestion } from '../types/quiz'

export const oficiales: DefenseQuestion[] = [
  {
    "category": "P1 Población y clases",
    "evidence": [
      "R/01_datos.R"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 1; 04_resultados.md · sección 1",
    "explanation": "La población se restringe por educación y la clase positiva corresponde al ingreso superior al corte.",
    "keyFigure": "Total de personas de la tabla analítica: 28 308.",
    "id": "p1-multiple",
    "type": "multiple",
    "prompt": "¿Qué población y clase positiva estudia el proyecto?",
    "options": [
      "Personas con secundaria completa o superior; ingreso alto como clase positiva.",
      "Toda la población actual de Estados Unidos.",
      "Solo personas sin faltantes en ninguna columna.",
      "Personas de adult.test, sin filtro educativo."
    ],
    "correctOption": 0,
    "optionExplanations": [
      "La población se restringe por educación y la clase positiva corresponde al ingreso superior al corte.",
      "El análisis es histórico y descriptivo de la tabla, sin representatividad actual.",
      "Solo cuentan los faltantes en columnas requeridas; na.omit() sobre toda la tabla excluiría personas innecesariamente.",
      "La fuente exigida es adult.data y el filtro educativo es obligatorio."
    ]
  },
  {
    "category": "P1 Población y clases",
    "evidence": [
      "R/01_datos.R"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 1; 04_resultados.md · sección 1",
    "explanation": "La población se restringe por educación y la clase positiva corresponde al ingreso superior al corte.",
    "keyFigure": "Total de personas de la tabla analítica: 28 308.",
    "id": "p1-open",
    "type": "open",
    "prompt": "Ensaya la defensa: explica población y clases y localiza su evidencia.",
    "points": [
      "Clase 1: ingreso superior a USD 50.000; clase 0: ingreso menor o igual a USD 50.000.",
      "El filtro education-num ≥ 9 conserva secundaria completa o superior; 12th queda fuera.",
      "Describir el orden: faltantes requeridos, filtro educativo y tabla final."
    ]
  },
  {
    "category": "P1 Población y clases",
    "evidence": [
      "R/01_datos.R"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 1; 04_resultados.md · sección 1",
    "explanation": "La población se restringe por educación y la clase positiva corresponde al ingreso superior al corte.",
    "keyFigure": "Total de personas de la tabla analítica: 28 308.",
    "id": "p1-evidence",
    "type": "evidence",
    "prompt": "Te piden mostrar la implementación de la limpieza y el filtro educativo. ¿Qué abres?",
    "options": [
      "R/01_datos.R",
      "output/tablas/tamanos_replica1.csv",
      "output/tablas/verificaciones_replicas.csv",
      "output/tablas/parametros_replica1.csv"
    ],
    "correctOption": 0,
    "optionExplanations": [
      "Este archivo contiene la implementación de la limpieza y el filtro educativo.",
      "Este archivo respalda los tamaños de cada destino por clase, no la implementación de la limpieza y el filtro educativo.",
      "Este archivo respalda las comprobaciones de destinos disjuntos y completos, no la implementación de la limpieza y el filtro educativo.",
      "Este archivo respalda las previas, medias y desviaciones de entrenamiento, no la implementación de la limpieza y el filtro educativo."
    ]
  },
  {
    "category": "P2 Submuestreo equilibrado",
    "evidence": [
      "output/tablas/tamanos_replica1.csv"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 2; 04_resultados.md · sección 2.1",
    "explanation": "El mínimo permite seleccionar igual cantidad por clase sin repetir personas en el sorteo.",
    "keyFigure": "Personas seleccionadas por clase para entrenar: 6 077.",
    "id": "p2-multiple",
    "type": "multiple",
    "prompt": "¿Cómo se determina el tamaño común de entrenamiento?",
    "options": [
      "Con el mínimo disponible entre clases y selección sin reemplazo.",
      "Con el tamaño de la clase mayoritaria para ambas clases.",
      "Balanceando primero validación y prueba.",
      "Reutilizando las personas de prueba en entrenamiento."
    ],
    "correctOption": 0,
    "optionExplanations": [
      "El mínimo permite seleccionar igual cantidad por clase sin repetir personas en el sorteo.",
      "La clase minoritaria no dispone de suficientes personas para igualar ese tamaño sin reemplazo.",
      "El balanceo se aplica exclusivamente al entrenamiento.",
      "Los destinos de una misma réplica deben ser disjuntos."
    ]
  },
  {
    "category": "P2 Submuestreo equilibrado",
    "evidence": [
      "output/tablas/tamanos_replica1.csv"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 2; 04_resultados.md · sección 2.1",
    "explanation": "El mínimo permite seleccionar igual cantidad por clase sin repetir personas en el sorteo.",
    "keyFigure": "Personas seleccionadas por clase para entrenar: 6 077.",
    "id": "p2-open",
    "type": "open",
    "prompt": "Ensaya la defensa: explica submuestreo equilibrado y localiza su evidencia.",
    "points": [
      "Particionar dentro de cada clase en disponibles, validación y prueba.",
      "Tomar el mínimo de los tamaños disponibles como tamaño común.",
      "Sortear sin reemplazo y registrar los disponibles sin seleccionar."
    ]
  },
  {
    "category": "P2 Submuestreo equilibrado",
    "evidence": [
      "output/tablas/tamanos_replica1.csv"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 2; 04_resultados.md · sección 2.1",
    "explanation": "El mínimo permite seleccionar igual cantidad por clase sin repetir personas en el sorteo.",
    "keyFigure": "Personas seleccionadas por clase para entrenar: 6 077.",
    "id": "p2-evidence",
    "type": "evidence",
    "prompt": "Te piden mostrar los tamaños de cada destino por clase. ¿Qué abres?",
    "options": [
      "output/tablas/tamanos_replica1.csv",
      "R/01_datos.R",
      "output/tablas/verificaciones_replicas.csv",
      "output/tablas/parametros_replica1.csv"
    ],
    "correctOption": 0,
    "optionExplanations": [
      "Este archivo contiene los tamaños de cada destino por clase.",
      "Este archivo respalda la implementación de la limpieza y el filtro educativo, no los tamaños de cada destino por clase.",
      "Este archivo respalda las comprobaciones de destinos disjuntos y completos, no los tamaños de cada destino por clase.",
      "Este archivo respalda las previas, medias y desviaciones de entrenamiento, no los tamaños de cada destino por clase."
    ]
  },
  {
    "category": "P3 Validación y prueba",
    "evidence": [
      "output/tablas/verificaciones_replicas.csv"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 3; 04_resultados.md · sección 2.1 y 6",
    "explanation": "Separar selección y evaluación evita usar los resultados de prueba para elegir la regla.",
    "keyFigure": "Personas de prueba por réplica: 2 833.",
    "id": "p3-multiple",
    "type": "multiple",
    "prompt": "¿Qué uso corresponde a validación y prueba?",
    "options": [
      "Validación elige el umbral; prueba evalúa la regla fijada.",
      "Prueba elige el umbral; validación informa el resultado final.",
      "Ambas ajustan las medias y desviaciones del modelo.",
      "Los disponibles sin seleccionar se agregan a prueba."
    ],
    "correctOption": 0,
    "optionExplanations": [
      "Separar selección y evaluación evita usar los resultados de prueba para elegir la regla.",
      "Elegir el umbral en prueba contamina su evaluación.",
      "Los parámetros se estiman únicamente con entrenamiento.",
      "Los disponibles sin seleccionar quedan fuera de los cálculos de esa réplica."
    ]
  },
  {
    "category": "P3 Validación y prueba",
    "evidence": [
      "output/tablas/verificaciones_replicas.csv"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 3; 04_resultados.md · sección 2.1 y 6",
    "explanation": "Separar selección y evaluación evita usar los resultados de prueba para elegir la regla.",
    "keyFigure": "Personas de prueba por réplica: 2 833.",
    "id": "p3-open",
    "type": "open",
    "prompt": "Ensaya la defensa: explica validación y prueba y localiza su evidencia.",
    "points": [
      "Entrenamiento estima parámetros y validación elige el umbral.",
      "Prueba evalúa sin intervenir en las decisiones.",
      "Los destinos son disjuntos y completos; los sin seleccionar quedan registrados."
    ]
  },
  {
    "category": "P3 Validación y prueba",
    "evidence": [
      "output/tablas/verificaciones_replicas.csv"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 3; 04_resultados.md · sección 2.1 y 6",
    "explanation": "Separar selección y evaluación evita usar los resultados de prueba para elegir la regla.",
    "keyFigure": "Personas de prueba por réplica: 2 833.",
    "id": "p3-evidence",
    "type": "evidence",
    "prompt": "Te piden mostrar las comprobaciones de destinos disjuntos y completos. ¿Qué abres?",
    "options": [
      "output/tablas/verificaciones_replicas.csv",
      "R/01_datos.R",
      "output/tablas/tamanos_replica1.csv",
      "output/tablas/parametros_replica1.csv"
    ],
    "correctOption": 0,
    "optionExplanations": [
      "Este archivo contiene las comprobaciones de destinos disjuntos y completos.",
      "Este archivo respalda la implementación de la limpieza y el filtro educativo, no las comprobaciones de destinos disjuntos y completos.",
      "Este archivo respalda los tamaños de cada destino por clase, no las comprobaciones de destinos disjuntos y completos.",
      "Este archivo respalda las previas, medias y desviaciones de entrenamiento, no las comprobaciones de destinos disjuntos y completos."
    ]
  },
  {
    "category": "P4 Estimación de parámetros",
    "evidence": [
      "output/tablas/parametros_replica1.csv"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 4; 04_resultados.md · sección 2.2",
    "explanation": "Cada clase del entrenamiento aporta su previa, media y desviación; la varianza usa el ajuste muestral.",
    "keyFigure": "Previa de cada clase en entrenamiento: 0,5.",
    "id": "p4-multiple",
    "type": "multiple",
    "prompt": "¿De dónde se obtienen las previas y los parámetros numéricos?",
    "options": [
      "Del entrenamiento, por clase, con desviación muestral.",
      "De toda la tabla antes de separar los destinos.",
      "De prueba, para adaptar el modelo a las personas evaluadas.",
      "De validación, porque allí se elige el umbral."
    ],
    "correctOption": 0,
    "optionExplanations": [
      "Cada clase del entrenamiento aporta su previa, media y desviación; la varianza usa el ajuste muestral.",
      "Usar toda la tabla incorpora información reservada para evaluar.",
      "Prueba debe recibir parámetros ya fijados.",
      "La validación selecciona el umbral, no vuelve a estimar estos parámetros."
    ]
  },
  {
    "category": "P4 Estimación de parámetros",
    "evidence": [
      "output/tablas/parametros_replica1.csv"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 4; 04_resultados.md · sección 2.2",
    "explanation": "Cada clase del entrenamiento aporta su previa, media y desviación; la varianza usa el ajuste muestral.",
    "keyFigure": "Previa de cada clase en entrenamiento: 0,5.",
    "id": "p4-open",
    "type": "open",
    "prompt": "Ensaya la defensa: explica estimación de parámetros y localiza su evidencia.",
    "points": [
      "Estimar cada parámetro solo con entrenamiento y dentro de su clase.",
      "Explicar que el balanceo produce previas iguales, calculadas desde conteos.",
      "Distinguir media y desviación muestral; las funciones de R base sirven de comprobación."
    ]
  },
  {
    "category": "P4 Estimación de parámetros",
    "evidence": [
      "output/tablas/parametros_replica1.csv"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 4; 04_resultados.md · sección 2.2",
    "explanation": "Cada clase del entrenamiento aporta su previa, media y desviación; la varianza usa el ajuste muestral.",
    "keyFigure": "Previa de cada clase en entrenamiento: 0,5.",
    "id": "p4-evidence",
    "type": "evidence",
    "prompt": "Te piden mostrar las previas, medias y desviaciones de entrenamiento. ¿Qué abres?",
    "options": [
      "output/tablas/parametros_replica1.csv",
      "R/01_datos.R",
      "output/tablas/tamanos_replica1.csv",
      "output/tablas/verificaciones_replicas.csv"
    ],
    "correctOption": 0,
    "optionExplanations": [
      "Este archivo contiene las previas, medias y desviaciones de entrenamiento.",
      "Este archivo respalda la implementación de la limpieza y el filtro educativo, no las previas, medias y desviaciones de entrenamiento.",
      "Este archivo respalda los tamaños de cada destino por clase, no las previas, medias y desviaciones de entrenamiento.",
      "Este archivo respalda las comprobaciones de destinos disjuntos y completos, no las previas, medias y desviaciones de entrenamiento."
    ]
  },
  {
    "category": "P5 Densidad y acumulada",
    "evidence": [
      "output/tablas/densidad_ejemplo_replica1.csv"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 5; 04_resultados.md · sección 2.3",
    "explanation": "La densidad aporta al puntaje mediante su logaritmo; la acumulada permite interpretar un límite.",
    "keyFigure": "Densidad por año, clase negativa, edad del ejemplo: 0,029871.",
    "id": "p5-multiple",
    "type": "multiple",
    "prompt": "¿Cómo se interpreta $f$ frente a $F$ para la edad?",
    "options": [
      "La densidad tiene unidades por año; la acumulada expresa probabilidad hasta una edad.",
      "La densidad es la probabilidad exacta de tener esa edad.",
      "La acumulada sustituye la densidad dentro del puntaje.",
      "La densidad es la prevalencia de ingresos altos del grupo."
    ],
    "correctOption": 0,
    "optionExplanations": [
      "La densidad aporta al puntaje mediante su logaritmo; la acumulada permite interpretar un límite.",
      "En el modelo continuo una densidad puntual no es una probabilidad puntual.",
      "El puntaje usa la densidad, mientras F se calcula solo para interpretación.",
      "La prevalencia condiciona por grupo y responde una pregunta distinta."
    ]
  },
  {
    "category": "P5 Densidad y acumulada",
    "evidence": [
      "output/tablas/densidad_ejemplo_replica1.csv"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 5; 04_resultados.md · sección 2.3",
    "explanation": "La densidad aporta al puntaje mediante su logaritmo; la acumulada permite interpretar un límite.",
    "keyFigure": "Densidad por año, clase negativa, edad del ejemplo: 0,029871.",
    "id": "p5-open",
    "type": "open",
    "prompt": "Ensaya la defensa: explica densidad y acumulada y localiza su evidencia.",
    "points": [
      "Distinguir densidad puntual y probabilidad acumulada.",
      "Indicar las unidades por año de la densidad de edad.",
      "Explicar que el clasificador usa log-densidad y no la acumulada."
    ]
  },
  {
    "category": "P5 Densidad y acumulada",
    "evidence": [
      "output/tablas/densidad_ejemplo_replica1.csv"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 5; 04_resultados.md · sección 2.3",
    "explanation": "La densidad aporta al puntaje mediante su logaritmo; la acumulada permite interpretar un límite.",
    "keyFigure": "Densidad por año, clase negativa, edad del ejemplo: 0,029871.",
    "id": "p5-evidence",
    "type": "evidence",
    "prompt": "Te piden mostrar la evaluación de densidad y acumulada para la edad del ejemplo. ¿Qué abres?",
    "options": [
      "output/tablas/densidad_ejemplo_replica1.csv",
      "R/01_datos.R",
      "output/tablas/tamanos_replica1.csv",
      "output/tablas/verificaciones_replicas.csv"
    ],
    "correctOption": 0,
    "optionExplanations": [
      "Este archivo contiene la evaluación de densidad y acumulada para la edad del ejemplo.",
      "Este archivo respalda la implementación de la limpieza y el filtro educativo, no la evaluación de densidad y acumulada para la edad del ejemplo.",
      "Este archivo respalda los tamaños de cada destino por clase, no la evaluación de densidad y acumulada para la edad del ejemplo.",
      "Este archivo respalda las comprobaciones de destinos disjuntos y completos, no la evaluación de densidad y acumulada para la edad del ejemplo."
    ]
  },
  {
    "category": "P6 Categorías y Laplace",
    "evidence": [
      "output/tablas/probabilidades_g_replica1.csv"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 6; 04_resultados.md · sección 2.4",
    "explanation": "El conteo pertenece a una clase de entrenamiento y el denominador incorpora todos los niveles de la categoría conjunta.",
    "keyFigure": "Probabilidad Female/White dentro de la clase positiva: 0,135206.",
    "id": "p6-multiple",
    "type": "multiple",
    "prompt": "¿Qué estima $\\hat p_{c,g}$?",
    "options": [
      "La categoría conjunta dentro de una clase del entrenamiento, con Laplace.",
      "La prevalencia de ingresos altos dentro del grupo de prueba.",
      "El cruce educación por grupo usado directamente en el puntaje.",
      "La probabilidad de una edad exacta."
    ],
    "correctOption": 0,
    "optionExplanations": [
      "El conteo pertenece a una clase de entrenamiento y el denominador incorpora todos los niveles de la categoría conjunta.",
      "La prevalencia de prueba invierte el condicionamiento y usa el tamaño del grupo.",
      "El cruce educación por grupo es diagnóstico; el modelo estima sus componentes por separado.",
      "La edad se trata mediante densidad normal, no mediante esta probabilidad categórica."
    ]
  },
  {
    "category": "P6 Categorías y Laplace",
    "evidence": [
      "output/tablas/probabilidades_g_replica1.csv"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 6; 04_resultados.md · sección 2.4",
    "explanation": "El conteo pertenece a una clase de entrenamiento y el denominador incorpora todos los niveles de la categoría conjunta.",
    "keyFigure": "Probabilidad Female/White dentro de la clase positiva: 0,135206.",
    "id": "p6-open",
    "type": "open",
    "prompt": "Ensaya la defensa: explica categorías y laplace y localiza su evidencia.",
    "points": [
      "Definir los conteos de grupo y educación dentro de cada clase.",
      "Explicar que Laplace añade masa a todos los niveles y ajusta el denominador.",
      "Distinguir la probabilidad condicionada por clase de la prevalencia condicionada por grupo."
    ]
  },
  {
    "category": "P6 Categorías y Laplace",
    "evidence": [
      "output/tablas/probabilidades_g_replica1.csv"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 6; 04_resultados.md · sección 2.4",
    "explanation": "El conteo pertenece a una clase de entrenamiento y el denominador incorpora todos los niveles de la categoría conjunta.",
    "keyFigure": "Probabilidad Female/White dentro de la clase positiva: 0,135206.",
    "id": "p6-evidence",
    "type": "evidence",
    "prompt": "Te piden mostrar los conteos y probabilidades de categoría conjunta con Laplace. ¿Qué abres?",
    "options": [
      "output/tablas/probabilidades_g_replica1.csv",
      "R/01_datos.R",
      "output/tablas/tamanos_replica1.csv",
      "output/tablas/verificaciones_replicas.csv"
    ],
    "correctOption": 0,
    "optionExplanations": [
      "Este archivo contiene los conteos y probabilidades de categoría conjunta con Laplace.",
      "Este archivo respalda la implementación de la limpieza y el filtro educativo, no los conteos y probabilidades de categoría conjunta con Laplace.",
      "Este archivo respalda los tamaños de cada destino por clase, no los conteos y probabilidades de categoría conjunta con Laplace.",
      "Este archivo respalda las comprobaciones de destinos disjuntos y completos, no los conteos y probabilidades de categoría conjunta con Laplace."
    ]
  },
  {
    "category": "P7 Reconstrucción de predicción",
    "evidence": [
      "output/tablas/persona_replica1.csv"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 7; 04_resultados.md · sección 2.5",
    "explanation": "D combina previa, edad, horas, educación y grupo; la comparación aplica una regla ya fijada.",
    "keyFigure": "D de la persona del ejemplo: −0,027710.",
    "id": "p7-multiple",
    "type": "multiple",
    "prompt": "¿Cómo se reconstruye la predicción de la persona del ejemplo?",
    "options": [
      "Sumar las contribuciones a D y comparar con el umbral elegido en validación.",
      "Comparar la contribución de horas sola con el umbral.",
      "Sumar las probabilidades categóricas sin logaritmos.",
      "Cambiar el umbral hasta acertar su clase observada."
    ],
    "correctOption": 0,
    "optionExplanations": [
      "D combina previa, edad, horas, educación y grupo; la comparación aplica una regla ya fijada.",
      "Las horas son solo una contribución y pueden ser compensadas por otras.",
      "El modelo compara puntajes logarítmicos, no una suma de probabilidades.",
      "Ajustar el umbral mirando la clase de prueba introduce información de evaluación en la decisión."
    ]
  },
  {
    "category": "P7 Reconstrucción de predicción",
    "evidence": [
      "output/tablas/persona_replica1.csv"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 7; 04_resultados.md · sección 2.5",
    "explanation": "D combina previa, edad, horas, educación y grupo; la comparación aplica una regla ya fijada.",
    "keyFigure": "D de la persona del ejemplo: −0,027710.",
    "id": "p7-open",
    "type": "open",
    "prompt": "Ensaya la defensa: explica reconstrucción de predicción y localiza su evidencia.",
    "points": [
      "Nombrar las contribuciones de previa, edad, horas, educación y grupo.",
      "Explicar que las contribuciones se suman para reconstruir D.",
      "Comparar D con el umbral y explicar el falso negativo del ejemplo."
    ]
  },
  {
    "category": "P7 Reconstrucción de predicción",
    "evidence": [
      "output/tablas/persona_replica1.csv"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 7; 04_resultados.md · sección 2.5",
    "explanation": "D combina previa, edad, horas, educación y grupo; la comparación aplica una regla ya fijada.",
    "keyFigure": "D de la persona del ejemplo: −0,027710.",
    "id": "p7-evidence",
    "type": "evidence",
    "prompt": "Te piden mostrar la descomposición individual del puntaje y la predicción. ¿Qué abres?",
    "options": [
      "output/tablas/persona_replica1.csv",
      "R/01_datos.R",
      "output/tablas/tamanos_replica1.csv",
      "output/tablas/verificaciones_replicas.csv"
    ],
    "correctOption": 0,
    "optionExplanations": [
      "Este archivo contiene la descomposición individual del puntaje y la predicción.",
      "Este archivo respalda la implementación de la limpieza y el filtro educativo, no la descomposición individual del puntaje y la predicción.",
      "Este archivo respalda los tamaños de cada destino por clase, no la descomposición individual del puntaje y la predicción.",
      "Este archivo respalda las comprobaciones de destinos disjuntos y completos, no la descomposición individual del puntaje y la predicción."
    ]
  },
  {
    "category": "P8 Selección del umbral",
    "evidence": [
      "output/tablas/candidatos_replica1.csv"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 8; 04_resultados.md · sección 2.7",
    "explanation": "Youden equilibra sensibilidad y especificidad; se selecciona antes de evaluar en prueba.",
    "keyFigure": "Umbral elegido en la primera réplica: 0,0991012.",
    "id": "p8-multiple",
    "type": "multiple",
    "prompt": "¿Qué criterio elige el umbral?",
    "options": [
      "Máximo Youden en validación, con desempate establecido.",
      "Máxima exactitud en prueba.",
      "Máximo PPV en entrenamiento.",
      "Un umbral distinto para cada grupo de prueba."
    ],
    "correctOption": 0,
    "optionExplanations": [
      "Youden equilibra sensibilidad y especificidad; se selecciona antes de evaluar en prueba.",
      "La exactitud favorece la clase mayoritaria y prueba no puede seleccionar la regla.",
      "El criterio exigido es Youden y la selección se hace en validación.",
      "El proyecto aplica un umbral global por réplica, no umbrales por grupo."
    ]
  },
  {
    "category": "P8 Selección del umbral",
    "evidence": [
      "output/tablas/candidatos_replica1.csv"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 8; 04_resultados.md · sección 2.7",
    "explanation": "Youden equilibra sensibilidad y especificidad; se selecciona antes de evaluar en prueba.",
    "keyFigure": "Umbral elegido en la primera réplica: 0,0991012.",
    "id": "p8-open",
    "type": "open",
    "prompt": "Ensaya la defensa: explica selección del umbral y localiza su evidencia.",
    "points": [
      "Calcular los puntajes de validación con parámetros de entrenamiento.",
      "Evaluar cortes que representen los cambios de matriz y los extremos.",
      "Maximizar Youden; desempatar con épsilon, menor valor absoluto y luego menor umbral.",
      "Aplicar los mismos parámetros y umbral a prueba."
    ]
  },
  {
    "category": "P8 Selección del umbral",
    "evidence": [
      "output/tablas/candidatos_replica1.csv"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 8; 04_resultados.md · sección 2.7",
    "explanation": "Youden equilibra sensibilidad y especificidad; se selecciona antes de evaluar en prueba.",
    "keyFigure": "Umbral elegido en la primera réplica: 0,0991012.",
    "id": "p8-evidence",
    "type": "evidence",
    "prompt": "Te piden mostrar los candidatos y la fila elegida por Youden. ¿Qué abres?",
    "options": [
      "output/tablas/candidatos_replica1.csv",
      "R/01_datos.R",
      "output/tablas/tamanos_replica1.csv",
      "output/tablas/verificaciones_replicas.csv"
    ],
    "correctOption": 0,
    "optionExplanations": [
      "Este archivo contiene los candidatos y la fila elegida por Youden.",
      "Este archivo respalda la implementación de la limpieza y el filtro educativo, no los candidatos y la fila elegida por Youden.",
      "Este archivo respalda los tamaños de cada destino por clase, no los candidatos y la fila elegida por Youden.",
      "Este archivo respalda las comprobaciones de destinos disjuntos y completos, no los candidatos y la fila elegida por Youden."
    ]
  },
  {
    "category": "P9 Distribuciones y percentiles",
    "evidence": [
      "output/tablas/resumen_replicas.csv"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 9; 04_resultados.md · sección 3",
    "explanation": "Las réplicas cambian el sorteo y comparten personas; el resumen describe ese procedimiento.",
    "keyFigure": "Mediana del umbral entre réplicas: 0,0681.",
    "id": "p9-multiple",
    "type": "multiple",
    "prompt": "¿Qué describen los percentiles entre réplicas?",
    "options": [
      "Variación descriptiva ante el submuestreo sobre la misma tabla.",
      "Un intervalo de confianza para la población actual.",
      "La probabilidad individual de ingreso alto.",
      "La variación de parámetros reajustados en prueba."
    ],
    "correctOption": 0,
    "optionExplanations": [
      "Las réplicas cambian el sorteo y comparten personas; el resumen describe ese procedimiento.",
      "No son muestras independientes de una población y no justifican esa inferencia.",
      "Los percentiles resumen resultados entre réplicas, no probabilidades de una persona.",
      "Los parámetros se ajustan en entrenamiento; prueba evalúa la regla ya elegida."
    ]
  },
  {
    "category": "P9 Distribuciones y percentiles",
    "evidence": [
      "output/tablas/resumen_replicas.csv"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 9; 04_resultados.md · sección 3",
    "explanation": "Las réplicas cambian el sorteo y comparten personas; el resumen describe ese procedimiento.",
    "keyFigure": "Mediana del umbral entre réplicas: 0,0681.",
    "id": "p9-open",
    "type": "open",
    "prompt": "Ensaya la defensa: explica distribuciones y percentiles y localiza su evidencia.",
    "points": [
      "Explicar qué aporta cada réplica al resumen de umbrales e indicadores.",
      "Distinguir centro, dispersión y rango descriptivo de percentiles.",
      "Advertir que las réplicas comparten personas y el rango no es un intervalo de confianza."
    ]
  },
  {
    "category": "P9 Distribuciones y percentiles",
    "evidence": [
      "output/tablas/resumen_replicas.csv"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 9; 04_resultados.md · sección 3",
    "explanation": "Las réplicas cambian el sorteo y comparten personas; el resumen describe ese procedimiento.",
    "keyFigure": "Mediana del umbral entre réplicas: 0,0681.",
    "id": "p9-evidence",
    "type": "evidence",
    "prompt": "Te piden mostrar las medianas y percentiles del umbral y los indicadores. ¿Qué abres?",
    "options": [
      "output/tablas/resumen_replicas.csv",
      "R/01_datos.R",
      "output/tablas/tamanos_replica1.csv",
      "output/tablas/verificaciones_replicas.csv"
    ],
    "correctOption": 0,
    "optionExplanations": [
      "Este archivo contiene las medianas y percentiles del umbral y los indicadores.",
      "Este archivo respalda la implementación de la limpieza y el filtro educativo, no las medianas y percentiles del umbral y los indicadores.",
      "Este archivo respalda los tamaños de cada destino por clase, no las medianas y percentiles del umbral y los indicadores.",
      "Este archivo respalda las comprobaciones de destinos disjuntos y completos, no las medianas y percentiles del umbral y los indicadores."
    ]
  },
  {
    "category": "P10 Denominadores y sumas",
    "evidence": [
      "output/tablas/resumen_grupos.csv"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 10; 04_resultados.md · sección 4.1 y 6",
    "explanation": "La tasa carece de información para ese denominador y debe quedar NA; r indica cuántas réplicas contribuyen.",
    "keyFigure": "Réplicas con TPR estimable para Female/Other: 93.",
    "id": "p10-multiple",
    "type": "multiple",
    "prompt": "¿Qué hacer con una tasa por grupo cuyo denominador es cero?",
    "options": [
      "Marcarla como no estimable y conservar el número de réplicas estimables.",
      "Informarla como cero para mantener todos los grupos.",
      "Aplicar Laplace a la matriz de prueba.",
      "Usar el tamaño total de prueba como denominador."
    ],
    "correctOption": 0,
    "optionExplanations": [
      "La tasa carece de información para ese denominador y debe quedar NA; r indica cuántas réplicas contribuyen.",
      "Cero significaría una tasa observada, no ausencia de casos que permita estimarla.",
      "Laplace suaviza probabilidades del modelo; no inventa observaciones para evaluar tasas.",
      "Eso cambia la definición de la tasa condicionada por grupo."
    ]
  },
  {
    "category": "P10 Denominadores y sumas",
    "evidence": [
      "output/tablas/resumen_grupos.csv"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 10; 04_resultados.md · sección 4.1 y 6",
    "explanation": "La tasa carece de información para ese denominador y debe quedar NA; r indica cuántas réplicas contribuyen.",
    "keyFigure": "Réplicas con TPR estimable para Female/Other: 93.",
    "id": "p10-open",
    "type": "open",
    "prompt": "Ensaya la defensa: explica denominadores y sumas y localiza su evidencia.",
    "points": [
      "Precisar que TPR y FNR usan positivos reales y FPR negativos reales del grupo.",
      "Explicar NA y r cuando falta el denominador.",
      "Comprobar que matrices de grupo sumen la global y probabilidades sumen la unidad dentro de tolerancia."
    ]
  },
  {
    "category": "P10 Denominadores y sumas",
    "evidence": [
      "output/tablas/resumen_grupos.csv"
    ],
    "source": "01_preguntas_respuestas.md · Parte A, pregunta 10; 04_resultados.md · sección 4.1 y 6",
    "explanation": "La tasa carece de información para ese denominador y debe quedar NA; r indica cuántas réplicas contribuyen.",
    "keyFigure": "Réplicas con TPR estimable para Female/Other: 93.",
    "id": "p10-evidence",
    "type": "evidence",
    "prompt": "Te piden mostrar las tasas por grupo, denominadores y réplicas estimables. ¿Qué abres?",
    "options": [
      "output/tablas/resumen_grupos.csv",
      "R/01_datos.R",
      "output/tablas/tamanos_replica1.csv",
      "output/tablas/verificaciones_replicas.csv"
    ],
    "correctOption": 0,
    "optionExplanations": [
      "Este archivo contiene las tasas por grupo, denominadores y réplicas estimables.",
      "Este archivo respalda la implementación de la limpieza y el filtro educativo, no las tasas por grupo, denominadores y réplicas estimables.",
      "Este archivo respalda los tamaños de cada destino por clase, no las tasas por grupo, denominadores y réplicas estimables.",
      "Este archivo respalda las comprobaciones de destinos disjuntos y completos, no las tasas por grupo, denominadores y réplicas estimables."
    ]
  }
]
