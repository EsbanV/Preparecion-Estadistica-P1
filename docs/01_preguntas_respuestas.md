# Preguntas y respuestas

Documento 1 de 5. Responde las diez preguntas oficiales de la rúbrica (sección 10) y las preguntas de seguimiento más probables. Cada respuesta indica **dónde está la evidencia** en el proyecto, porque el criterio 5 premia responder «con precisión» y «localizar las evidencias que respaldan los cálculos consultados».

Las cifras salen de `docs/bitacora.md` (ejecución completa del 2026-10-22, R 4.6.1, Windows 11) y de los CSV de `output/tablas/` que esa ejecución generó. Se redondean al presentar; los CSV tienen 17 cifras significativas.

Convención para datos faltantes: `[FALTA DATO: …]` marca un dato que el proyecto **no** produce (decisión o información del equipo). Todas las cifras que sí están en los CSV ya fueron transcritas desde ellos (revisión del 2026-10-28).

Documentos relacionados: `02_documentacion_breve.md`, `03_documentacion_tecnica.md`, `04_resultados.md`, `05_evaluacion_resultados.md`.

---

## Parte A. Las diez preguntas oficiales

### 1. ¿Qué significan $c_i = 0$ y $c_i = 1$, y qué personas integran la población analizada?

- $c_i = 1$: ingreso anual **superior** a USD 50.000 (etiqueta `>50K`). Es la clase positiva.
- $c_i = 0$: ingreso anual **menor o igual** a USD 50.000 (etiqueta `<=50K`).
- **Población:** personas del archivo `adult.data` (Adult/Census Income, UCI, censo de EE. UU. de 1994) con `education-num` ≥ 9, es decir, secundaria completa o más. Se admiten 8 niveles: HS-grad, Some-college, Assoc-voc, Assoc-acdm, Bachelors, Masters, Prof-school y Doctorate. `12th` queda fuera.
- **Cómo se llegó a la tabla** (en este orden, como pide la rúbrica):

  | Paso | Filas |
  |---|---|
  | Filas originales | 32 561 |
  | Excluidas por faltantes en columnas requeridas | 0 |
  | Excluidas por educación (`education-num` < 9) | 4 253 |
  | **Total final** | **28 308** |

- Clases en la tabla: 20 711 con $c = 0$ y 7 597 con $c = 1$ (prevalencia 26,84 %).
- Por qué no se excluye nadie por faltantes: en `adult.data` los `?` están solo en `workclass` (1 408), `occupation` (1 411) y `native_country` (499) dentro de la tabla final, columnas que el modelo no usa. Solo se excluye por faltantes en las 7 columnas requeridas (age, hours-per-week, education, sex, race, education-num, ingreso).
- **Evidencia:** `data/processed/registro_exclusiones.csv`, `R/01_datos.R`, constantes `COLUMNAS_REQUERIDAS` y `EDUCACION_NUM_MIN` en `R/00_config.R`.

### 2. ¿Cómo se determina $n_*$ y cómo se forma el entrenamiento equilibrado de una réplica?

1. Con la semilla $20261021 + b - 1$, dentro de **cada clase** se permutan las personas y se reparten: $N_c^{\text{disp}} = \lfloor 0{,}8 N_c \rfloor$ disponibles para entrenar, $N_c^{\text{val}} = \lfloor 0{,}1 N_c \rfloor$ para validación y el resto para prueba.
2. $n_* = \min(N_0^{\text{disp}}, N_1^{\text{disp}})$.
3. Se sortean sin reemplazo $n_*$ personas de cada clase entre sus disponibles. El entrenamiento tiene $2 n_*$ personas.

Con los datos del proyecto (idéntico en las 200 réplicas, porque los tamaños solo dependen de $N_c$):

| Clase | $N_c$ | Disponibles | Entrenamiento | Validación | Prueba | Sin seleccionar |
|---|---|---|---|---|---|---|
| 0 | 20 711 | 16 568 | 6 077 | 2 071 | 2 072 | 10 491 |
| 1 | 7 597 | 6 077 | 6 077 | 759 | 761 | 0 |

$n_* = \lfloor 0{,}8 \cdot 7\,597 \rfloor = 6\,077$. El entrenamiento tiene 12 154 personas.

- **Evidencia:** `output/tablas/tamanos_replica1.csv`, `logs/semillas.csv` (200 filas con semilla, $n_*$ y tamaños de los 4 destinos), función `particionar()` en `R/02_particion.R`.
- **Para mostrar en consola:** `particionar(tabla$clase, semilla_replica(1))`.

### 3. ¿Qué función cumplen validación, prueba y los disponibles sin seleccionar?

- **Entrenamiento:** estima los parámetros (previas, medias, desviaciones y probabilidades con Laplace). Nada más.
- **Validación** (2 830 personas en cada réplica): con los parámetros ya estimados, calcula $D_i$ y elige el umbral $\tau_b$ que maximiza Youden. No se balancea: conserva la prevalencia real (≈ 26,8 %).
- **Prueba** (2 833 personas): evalúa la regla ya fijada (parámetros + $\tau_b$). Como no participó en ninguna decisión, sus indicadores no son optimistas.
- **Sin seleccionar** (10 491 personas de clase 0): disponibles que no entraron al sorteo equilibrado. Quedan registradas con un destino explícito y fuera de todos los cálculos de esa réplica.
- Los cuatro destinos son disjuntos y su unión es la tabla completa (28 308). En la réplica siguiente se vuelve a sortear desde cero, así que una persona puede cambiar de destino.
- **Evidencia:** columna `destino` de `particion` en cada `output/replicas/replica_XXX.rds`; columnas `destinos_disjuntos` y `todos_con_destino` de `output/tablas/verificaciones_replicas.csv` (TRUE en las 200).

### 4. ¿Cómo se estiman las previas, medias y desviaciones a partir del entrenamiento?

- **Previa:** $\hat\pi_c = n_c / (n_0 + n_1) = 6\,077 / 12\,154 = 0{,}5$. Se calcula (no se fija a mano) y se incluye en el puntaje, aunque se cancele en $D$.
- **Media:** $\hat\mu_{c,j} = \frac{1}{n_c} \sum_{i \in T_c} z_{i,j}$.
- **Desviación estándar:** $\hat\sigma_{c,j} = \sqrt{\sum (z_{i,j} - \hat\mu_{c,j})^2 / (n_c - 1)}$, con denominador $n_c - 1$.
- Todo con funciones propias (`media_manual`, `sd_manual` en `R/00_utilidades.R`); `mean` y `sd` solo dentro de `stopifnot()` como comprobación.

Réplica 1 (entrenamiento, $n = 6\,077$ por clase):

| Clase | Previa | $\hat\mu$ edad | $\hat\sigma$ edad | $\hat\mu$ horas | $\hat\sigma$ horas |
|---|---|---|---|---|---|
| 0 | 0,5 | 36,88 | 13,35 | 39,37 | 12,10 |
| 1 | 0,5 | 44,14 | 10,50 | 45,41 | 11,00 |

- **Evidencia:** `output/tablas/parametros_replica1.csv`, `ajustar_nb()` en `R/03_modelo.R`.

### 5. ¿Qué representa la densidad de una edad y qué expresa su probabilidad acumulada?

- $f_{c,\text{edad}}(z)$ es la **densidad normal** estimada para la clase $c$ evaluada en la edad $z$. Tiene unidades «por año» y **no es una probabilidad**: es el valor que entra al puntaje (como $\log f$).
- $F_{c,\text{edad}}(z)$ es la **probabilidad acumulada**: proporción de la distribución modelada con edad ≤ $z$. Se usa solo para interpretar.
- Ejemplo de la rúbrica: $\mu = 44$, $\sigma = 10$ dan $f(54) \approx 0{,}0242$ por año y $F(54) \approx 0{,}8413$.
- Ejemplo del proyecto (réplica 1, edad 37 de la persona del ejemplo de la pregunta 7), valores de `output/tablas/densidad_ejemplo_replica1.csv` redondeados al presentar:

  | Clase | $\hat\mu$ | $\hat\sigma$ | $\log f(37)$ | $f(37)$ (por año) | $F(37)$ |
  |---|---|---|---|---|---|
  | 0 | 36,8789 | 13,3548 | −3,510855 | 0,029871 | 0,5036 |
  | 1 | 44,1450 | 10,4957 | −3,501617 | 0,030149 | 0,2480 |

- Lectura: a los 37 años la densidad es casi igual en ambas clases, por eso la contribución de la edad es casi cero: $\log f_1(37) - \log f_0(37) = -3{,}501617 - (-3{,}510855) = +0{,}009237$. En cambio, $F_1(37) = 0{,}248$ dice que solo un cuarto de la distribución modelada de la clase 1 tiene 37 años o menos, y $F_0(37) = 0{,}504$ que 37 está casi en la mitad de la distribución de la clase 0 (su media es 36,88).
- $F$ se calcula con `pnorm()` solo para interpretar (`R/09_replica1.R`); no entra al modelo.
- **Evidencia:** `output/tablas/densidad_ejemplo_replica1.csv`, `log_densidad_normal()` en `R/03_modelo.R` (contrastada con `dnorm(log = TRUE)` con tolerancia $3\varepsilon \max(1, |\text{ref}|)$).

### 6. ¿Cómo se obtienen $n_{c,g}$, $m_{c,e}$ y sus probabilidades con Laplace?

- $n_{c,g}$: personas del entrenamiento con clase $c$ y categoría conjunta $g$ (sexo/raza, 10 niveles).
- $m_{c,e}$: personas del entrenamiento con clase $c$ y nivel educativo $e$ (8 niveles).
- Laplace con $\alpha = 1$:

$$
\hat p_{c,g} = \frac{n_{c,g} + 1}{n_c + 10}, \qquad \hat q_{c,e} = \frac{m_{c,e} + 1}{n_c + 8}
$$

- Con $n_c = 6\,077$, los denominadores son 6 087 (categoría conjunta) y 6 085 (educación).
- Los niveles son factores fijos (`NIVELES_G`, `NIVELES_E` en `R/00_config.R`), así que un nivel con 0 casos sigue existiendo y recibe $1/(n_c + K)$. Sin Laplace, $\log 0 = -\infty$ anularía a los otros predictores.
- En los hechos, ningún entrenamiento de las 200 réplicas tuvo un conteo $n_{c,g}$ o $m_{c,e}$ igual a cero: el mínimo de $n_{c,g}$ fue 1 (en una réplica) y el de $m_{c,e}$, 19. Laplace se aplica igual porque lo exige la rúbrica y porque garantiza un logaritmo finito en cualquier sorteo; con conteos tan chicos (Female/Other de clase 1 tiene 4 en la réplica 1) además modera la estimación: $5/6\,087 = 0{,}00082$ en vez de $4/6\,077 = 0{,}00066$.
- Por qué una sola variable sexo/raza: captura la combinación (por ejemplo, Female/Black) sin suponer independencia entre sexo y raza dada la clase.
- Ejemplos numéricos de la réplica 1, para recalcular en vivo (`probabilidades_g_replica1.csv`, `probabilidades_e_replica1.csv`):

  | Cantidad | Conteo | Cálculo | Resultado |
  |---|---|---|---|
  | $\hat p_{1,\text{Female/White}}$ | $n_{1,\text{Female/White}} = 822$ | $(822 + 1)/(6\,077 + 10)$ | 0,135206 |
  | $\hat p_{0,\text{Female/White}}$ | $n_{0,\text{Female/White}} = 1\,963$ | $(1\,963 + 1)/6\,087$ | 0,322655 |
  | $\hat p_{1,\text{Male/White}}$ | $n_{1,\text{Male/White}} = 4\,701$ | $(4\,701 + 1)/6\,087$ | 0,772466 |
  | $\hat q_{1,\text{Bachelors}}$ | $m_{1,\text{Bachelors}} = 1\,778$ | $(1\,778 + 1)/(6\,077 + 8)$ | 0,292358 |
  | $\hat q_{0,\text{Bachelors}}$ | $m_{0,\text{Bachelors}} = 949$ | $(949 + 1)/6\,085$ | 0,156122 |

- Las tablas completas (10 + 8 niveles por clase) están en `04_resultados.md`, sección 2.4.
- **Evidencia:** `output/tablas/probabilidades_g_replica1.csv` (20 filas) y `probabilidades_e_replica1.csv` (16 filas), con conteo, $n_c$ y probabilidad; `ajustar_nb()` en `R/03_modelo.R`.

### 7. ¿Cómo se reconstruye una predicción desde sus cinco contribuciones?

$$
D_i = \ell_1(x_i) - \ell_0(x_i) = \underbrace{\log\tfrac{\hat\pi_1}{\hat\pi_0}}_{\text{previa}} + \underbrace{\log\tfrac{f_{1,\text{edad}}}{f_{0,\text{edad}}}}_{\text{edad}} + \underbrace{\log\tfrac{f_{1,\text{horas}}}{f_{0,\text{horas}}}}_{\text{horas}} + \underbrace{\log\tfrac{\hat q_{1,e}}{\hat q_{0,e}}}_{\text{educación}} + \underbrace{\log\tfrac{\hat p_{1,g}}{\hat p_{0,g}}}_{\text{categoría conjunta}}
$$

y se predice $\hat c_i = 1$ si $D_i \ge \tau_b$.

Persona de la rúbrica: la primera persona de prueba de la réplica 1 ordenada por `id_original`. Es el **id 11**: 37 años, 80 h/semana, Some-college, Male/Black, clase observada 1.

| Contribución | Fórmula | Valor |
|---|---|---|
| Previa | $\log(0{,}5/0{,}5)$ | 0 (exacto) |
| Edad | $\log f_{1,\text{edad}}(37) - \log f_{0,\text{edad}}(37)$ | +0,009237 |
| Horas | $\log f_{1,\text{horas}}(80) - \log f_{0,\text{horas}}(80)$ | +0,787500 |
| Educación | $\log(\hat q_{1,\text{Some-college}}/\hat q_{0,\text{Some-college}}) = \log(0{,}182087/0{,}292030)$ | −0,472370 |
| Categoría conjunta | $\log(\hat p_{1,\text{Male/Black}}/\hat p_{0,\text{Male/Black}}) = \log(0{,}035814/0{,}050928)$ | −0,352077 |
| **$D_{11}^{(1)}$** | suma de las cinco | **−0,027710** |
| $\ell_0$, $\ell_1$ | puntajes de clase | $\ell_0 = -17{,}459817$; $\ell_1 = -17{,}487527$ |
| $\tau_1$ | elegido en validación | 0,099101 |
| Predicción | $D < \tau_1$ | 0 (**falso negativo**: clase observada 1) |

Fuente: `output/tablas/persona_replica1.csv` (17 cifras significativas; aquí redondeado a 6 decimales). Se comprueba $D = \ell_1 - \ell_0 = -17{,}487527 - (-17{,}459817) = -0{,}027710$.

- Lectura: trabajar 80 horas empuja hacia la clase 1 (+0,79), pero el nivel Some-college (−0,47) y la categoría Male/Black (−0,35) pesan más hacia la clase 0. Queda bajo el umbral por $0{,}099101 - (-0{,}027710) = 0{,}126811$. Incluso con la regla de Bayes ($\tau = 0$) sería clase 0, porque $D < 0$.
- Verificaciones: la suma de las cinco contribuciones reproduce $D$ con error relativo de 0,11·ε (límite 16·ε); `D == l1 - l0`; `pred == (D >= tau)`.
- **Evidencia:** `output/tablas/persona_replica1.csv`, `puntuar()` en `R/03_modelo.R`, `R/09_replica1.R`.

### 8. ¿Cómo se elige $\tau_b$ con validación y se aplica después a prueba?

1. Se calcula $D$ en validación con los parámetros del entrenamiento $b$.
2. Candidatos: con $u_1 < \dots < u_L$ los valores distintos de $D$, se evalúan $u_1$, los puntos medios $u_h/2 + u_{h+1}/2$ y $+\infty$. Entre dos valores consecutivos la matriz no cambia, así que basta un punto por intervalo. $u_1$ es «todos positivos» y $+\infty$ «todos negativos». Se escribe $u_h/2 + u_{h+1}/2$ (y no $(u_h + u_{h+1})/2$) para evitar desbordamiento; si el redondeo deja el corte fuera de $(u_h, u_{h+1}]$ se usa $u_{h+1}$.
3. Para cada candidato, $J = \text{TPR} + \text{TNR} - 1$. Maximizar $J$ equivale a maximizar BA, porque $\text{BA} = (J + 1)/2$.
4. Empate: $|J(\tau) - J_{\max}| \le \varepsilon_{\text{mach}}$, con $\varepsilon_{\text{mach}} = 2^{-52} \approx 2{,}22 \times 10^{-16}$ leído del entorno (`.Machine[["double.eps"]]`). Entre empatados, menor $|\tau|$ y luego menor $\tau$.
5. Ese $\tau_b$ y los mismos parámetros se aplican a prueba: $\hat c_i = 1$ si $D_i \ge \tau_b$.

Réplica 1:

- 1 856 candidatos (1 855 valores distintos de $D$ más $+\infty$); un solo candidato en el máximo.
- **$\tau_1 = 0{,}0991012$**, $J_{\max} = 0{,}5056$ en validación.
- En $+\infty$ (todos negativos): exactitud 0,732, TNR 1, TPR = F1 = FPR = 0, PPV no estimable. Por eso no se usa la exactitud para elegir: clasificar a todos como 0 ya da 73 %.
- En prueba ($n = 2\,833$): TN 1 552, FP 520, FN 186, TP 575; exactitud 0,7508, TPR 0,7556, TNR 0,7490, PPV 0,5251, F1 0,6196, BA 0,7523, J 0,5046.
- **Evidencia:** `output/tablas/candidatos_replica1.csv` (columnas `J`, `J_max`, `eps`, `empatado`, `elegido`), `output/figuras/curvas_validacion_replica1.png`, `elegir_umbral()` en `R/04_umbral_metricas.R`.

### 9. ¿Qué describen la distribución de umbrales, las de indicadores y sus percentiles?

- Cada réplica da un $\tau_b$ y nueve indicadores de prueba. Las 200 réplicas forman una distribución que muestra **cuánto cambian el umbral y el desempeño cuando cambia el sorteo**.
- Se informa $r$ (valores estimables), media (nivel promedio), desviación estándar (dispersión), mediana (centro) y percentiles 2,5 y 97,5 (95 % central).
- **Los percentiles no son un intervalo de confianza.** Son un rango descriptivo de la variación frente al submuestreo, sobre esta misma tabla, y las réplicas comparten personas. No dicen nada sobre la población de EE. UU. ni sobre otros datos.
- Percentil tipo 7 a mano: con los $r$ valores ordenados, posición $h = 1 + (r - 1)p$; si $h$ cae entre dos valores, se interpola linealmente. Con $r = 200$ y $p = 0{,}025$, $h = 5{,}975$.
- Resultados ($B = 200$, $r = 200$ en todas las variables; fuente `output/tablas/resumen_replicas.csv`, subconjunto prueba salvo $\tau_b$, que se elige en validación):

  | Variable | Escala | Media | sd | Mediana | p2,5 | p97,5 |
  |---|---|---|---|---|---|---|
  | $\tau_b$ | original (escala de $D$) | 0,0482 | 0,1314 | 0,0681 | −0,2156 | 0,2650 |
  | Exactitud | proporción | 0,7327 | 0,0174 | 0,7363 | 0,6918 | 0,7579 |
  | TPR | proporción | 0,7595 | 0,0327 | 0,7582 | 0,6925 | 0,8174 |
  | TNR | proporción | 0,7228 | 0,0328 | 0,7283 | 0,6486 | 0,7713 |
  | PPV | proporción | 0,5030 | 0,0209 | 0,5063 | 0,4586 | 0,5349 |
  | F1 | proporción | 0,6044 | 0,0120 | 0,6062 | 0,5801 | 0,6265 |
  | FPR | proporción | 0,2772 | 0,0328 | 0,2717 | 0,2287 | 0,3514 |
  | FNR | proporción | 0,2405 | 0,0327 | 0,2418 | 0,1826 | 0,3075 |
  | BA | proporción | 0,7412 | 0,0096 | 0,7418 | 0,7210 | 0,7578 |
  | J | original ($[-1, 1]$) | 0,4823 | 0,0192 | 0,4837 | 0,4419 | 0,5155 |

  $\tau_b$: mínimo −0,3231, máximo 0,3195, 200 valores distintos; 61 de 200 son negativos.
- Lectura: el umbral varía bastante (95 % central de ancho 0,48), pero los indicadores se mantienen en un rango acotado. Lo que cambia es el **reparto entre TPR y TNR**: entre réplicas, la correlación de $\tau_b$ con TPR es −0,88 y con TNR +0,95. Por eso TPR y TNR tienen un 95 % central de ancho 0,125 y 0,123, mientras que BA, que las promedia, solo de 0,037 (sd 0,0096 frente a 0,033).
- FPR y FNR tienen la misma sd que TNR y TPR porque en cada réplica FPR = 1 − TNR y FNR = 1 − TPR.
- **Evidencia:** `output/tablas/resumen_replicas.csv`, `output/tablas/replicas_indicadores.csv`, `output/figuras/hist_tau.png`, `paneles_indicadores.png`, `boxplot_indicadores.png`; `resumir()` en `R/04_umbral_metricas.R`, `percentil_tipo7()` en `R/00_utilidades.R`.

### 10. ¿Qué explican los denominadores por grupo y las verificaciones de sumas próximas a uno?

**Denominadores por grupo.**

- TPR y FNR usan los positivos reales del grupo ($n_{g,1}$); FPR usa los negativos reales ($n_{g,0}$). Con pocos casos, un solo acierto mueve mucho la tasa: Female/Black tiene $n_1 \approx 8$ en prueba, así que un acierto cambia la TPR en unos 12 puntos.
- Si un grupo no tiene positivos en una prueba, TPR y FNR quedan `NA` y no cuentan en $r$. Hubo 201 combinaciones grupo-réplica sin positivos: Female/Other 107, Female/Amer-Indian-Eskimo 44, Male/Other 30, Male/Amer-Indian-Eskimo 18, Female/Asian-Pac-Islander 2. Por eso Female/Other tiene $r = 93$ en TPR.
- No confundir $\hat p_{c,g}$ (proporción del grupo **dentro de una clase del entrenamiento**, denominador $n_c + 10$) con la prevalencia de prueba del grupo (ingresos altos **dentro del grupo**, denominador $n_g$). Responden preguntas distintas.
- Las 10 matrices por grupo suman la matriz global de la misma réplica (verificado en las 200).

**Sumas próximas a uno.**

- Previas, las 10 $\hat p_{c,g}$ y las 8 $\hat q_{c,e}$ deben sumar 1 por clase. En punto flotante la suma puede diferir en el último bit, por eso se registra el error absoluto $|\sum - 1|$ y se compara con $K \cdot \varepsilon_{\text{mach}}$.
- Error máximo observado en las 200 réplicas: 1,1·10⁻¹⁶ (media unidad de ε).
- Esas comprobaciones localizan errores de denominador (por ejemplo, olvidar $+\alpha K$) o niveles perdidos.
- **Evidencia:** `output/tablas/resumen_grupos.csv` (denominador mínimo, mediano y máximo, $r$), `grupos_replicas.csv`, `grupos_replica1.csv`, `output/figuras/tasas_grupos.png`; `output/tablas/verificaciones_replicas.csv` (columnas `err_previa`, `err_p_g_0`, `err_p_g_1`, `err_q_e_0`, `err_q_e_1`, `grupos_suman_global`).

---

## Parte B. Preguntas de seguimiento probables

### Decisiones de diseño

- **¿Por qué balancear solo el entrenamiento?** Para que el modelo no favorezca a la clase mayoritaria. Validación y prueba conservan la prevalencia real para evaluar la regla en la composición de la tabla.
- **¿Qué cambia con previas reales en vez de 0,5?** $D$ se desplazaría en la constante $\log(0{,}268/0{,}732) \approx -1{,}0$. No cambia el orden de las personas, así que el $\tau_b$ elegido por Youden absorbe el desplazamiento.
- **¿Por qué Youden y no exactitud?** Con 73 % de clase 0, «todos negativos» ya da exactitud 0,732. Youden pesa igual TPR y TNR.
- **¿Por qué un conjunto de validación separado?** Si el umbral se eligiera en prueba, las métricas de prueba serían optimistas.
- **¿Por qué ε de máquina y menor $|\tau|$?** Dos $J$ que deberían ser iguales pueden diferir en el último bit. El menor $|\tau|$ es lo más cercano a la regla de Bayes ($D \ge 0$); lo fija la rúbrica.
- **¿Por qué logaritmos?** El producto de densidades y probabilidades pequeñas puede dar underflow. La suma de logaritmos es estable y conserva el orden.
- **¿Por qué $n - 1$?** Estimador insesgado de la varianza. Con $n_c = 6\,077$ la diferencia con $n$ es despreciable (factor $\sqrt{6077/6076}$).
- **¿Por qué `sample.int` y no `sample`?** `sample(x, n)` con `length(x) == 1` sortea de `1:x`. Se usa `x[sample.int(length(x), n)]`.

### Supuestos y diagnósticos

- **Normalidad:** la edad es aproximada (en la clase 0 hay piso en 17–20 años y cola derecha larga). Las horas están lejos de la normal: valores discretos, gran masa en 40, topes en 1 y 99. Evidencia: `output/figuras/qq_replica1.png`.
- **Independencia condicional:** Pearson edad–horas = 0,024 (clase 0) y −0,122 (clase 1), dependencia lineal débil. Educación y grupo pueden no ser independientes: `output/tablas/educacion_g_replica1.csv` tiene 32 de 160 celdas en cero, concentradas en grupos pequeños con educación alta. Evidencia: `output/figuras/edad_horas_replica1.png`.
- **Alternativas:** discretizar las horas, densidad kernel o transformar variables. La rúbrica fija la normal; el diagnóstico documenta el costo.

### Interpretación

- **¿Por qué el PPV es bajo (≈ 0,51–0,53)?** Con 27 % de positivos, un FPR de 0,25 sobre 2 072 negativos produce 520 falsos positivos frente a 575 verdaderos positivos (réplica 1).
- **¿Por qué los hombres tienen más TPR y más FPR?** Marginal réplica 1 (prueba): hombres TPR 0,830 (538/648) y FPR 0,385 (466/1 211); mujeres TPR 0,327 (37/113) y FPR 0,063 (54/861). $\hat p_{c,g}$ actúa como factor de verosimilitud: un grupo con alta $P(G = g \mid C = 1)$ relativa a $P(G = g \mid C = 0)$ empuja $D$ hacia la clase 1 para todas sus personas. En la réplica 1, la contribución $c_g = \log(\hat p_{1,g}/\hat p_{0,g})$ vale +0,400 para Male/White y +0,398 para Male/Asian-Pac-Islander, y es negativa para todas las categorías femeninas: −0,870 Female/White, −0,893 Female/Asian-Pac-Islander, −1,022 Female/Amer-Indian-Eskimo, −1,281 Female/Other, −1,579 Female/Black. Una mujer parte con $D$ alrededor de 1,27 unidades más bajo que un hombre blanco con los mismos otros predictores (−0,870 frente a +0,400).
- **¿Prueba esto discriminación?** No. Describe el comportamiento del clasificador en estos datos; no identifica causas.

### Preguntas hipotéticas

- **$\alpha$ distinto de 1:** mayor $\alpha$ acerca las probabilidades a la uniforme; menor, a las frecuencias observadas.
- **Sin balancear:** la previa no se cancela y los parámetros de la clase 0 se estiman con más datos; Youden compensaría parte en el umbral.
- **$\tau = 0$ fijo:** es la regla de Bayes con previas 0,5. En validación de la réplica 1, con corte 0 quedan bien clasificados 592 de 759 positivos y 1 487 de 2 071 negativos ($J = 0{,}4980$ frente a $J_{\max} = 0{,}5056$ en $\tau_1$); esto sí lo registra el proyecto: bitácora (módulo 03) y, en `candidatos_replica1.csv`, el candidato $\tau = -0{,}001354$, que da la misma matriz que $\tau = 0$ (TN 1 487, FP 584, FN 167, TP 592) porque ningún $D$ de validación cae entre ambos.
  - **Cálculo fuera del pipeline** (no lo genera `run_all.R`; se obtuvo el 2026-10-28 aplicando `predecir(r$prueba$D, 0)` a los 200 `.rds` guardados, sin reajustar nada): en prueba, mediana con $\tau = 0$ de exactitud 0,7289, TPR 0,7740, TNR 0,7119, BA 0,7429, $J$ 0,4858; con $\tau_b$, 0,7363, 0,7582, 0,7283, 0,7418, 0,4837. Es decir, el umbral elegido por Youden en validación cambia el reparto (menos TPR, más TNR) pero **no mejora BA en prueba** respecto de $\tau = 0$ (diferencia de medianas −0,001, dentro de la sd entre réplicas, 0,0096). Si se cita, hay que decir que es un cálculo adicional y cómo reproducirlo.
- **$\hat\sigma = 0$ o menos de 2 personas en una clase:** `ajustar_nb()` se detiene con `stop()`, como pide la rúbrica.
- **Validación sin ambas clases o $L = 1$:** `particionar()` se detiene si falta una clase; `candidatos_umbral()` usa $\{u_1, +\infty\}$ si $L = 1$.
- **Usar `adult.test`:** la rúbrica pide solo `adult.data`; cambiaría la población.
- **Otra semilla u otro $B$:** las cifras puntuales cambian, pero las distribuciones deberían parecerse. Es justamente lo que estudia el submuestreo.

### Datos y alcance

- **Sin ponderación:** no se usa `fnlwgt`, así que las tasas son de la muestra, no de la población de EE. UU.
- **Duplicados:** 28 308 filas, 28 289 perfiles distintos, 19 duplicados excedentes. En la réplica 1, 4 personas de prueba (0,14 % de 2 833) tienen un perfil idéntico a alguien de entrenamiento (3) o validación (1). Evidencia: `output/tablas/trazabilidad.csv`.
- **Por qué se excluye solo por faltantes en las 7 columnas requeridas:** con `na.omit()` sobre toda la tabla se habrían perdido 1 887 personas más de la población filtrada (2 399 filas con algún `?` en el archivo crudo), por faltantes en columnas que el modelo no usa.
- **Antecedentes (rúbrica 9.1):** [FALTA DATO: declarar si algún análisis previo del archivo orientó decisiones del equipo. El proyecto no registra esta información en ningún archivo; es una declaración que debe hacer el equipo en el informe.] <!-- FALTA: decisión del equipo -->

---

## Parte C. Mapa rápido «muéstramelo»

| Si preguntan por… | Abrir |
|---|---|
| Registro de exclusiones | `data/processed/registro_exclusiones.csv` |
| $n_*$ y tamaños | `output/tablas/tamanos_replica1.csv`, `logs/semillas.csv` |
| Parámetros réplica 1 | `output/tablas/parametros_replica1.csv` |
| Densidad de una edad | `output/tablas/densidad_ejemplo_replica1.csv` |
| Laplace | `output/tablas/probabilidades_g_replica1.csv`, `probabilidades_e_replica1.csv` |
| Persona descompuesta | `output/tablas/persona_replica1.csv` |
| Elección de $\tau_1$ | `output/tablas/candidatos_replica1.csv`, `output/figuras/curvas_validacion_replica1.png` |
| Distribuciones | `output/tablas/resumen_replicas.csv`, `output/figuras/paneles_indicadores.png` |
| Grupos | `output/tablas/resumen_grupos.csv`, `grupos_replica1.csv`, `marginales_*_replica1.csv`, `output/figuras/tasas_grupos.png` |
| Q–Q y dependencias | `output/figuras/qq_replica1.png`, `edad_horas_replica1.png`, `output/tablas/educacion_g_replica1.csv` |
| Verificaciones | `output/tablas/verificaciones_replicas.csv` |
| Duplicados | `output/tablas/trazabilidad.csv` |
| Semillas y versiones | `logs/semillas.csv`, `logs/sesion.txt` |
