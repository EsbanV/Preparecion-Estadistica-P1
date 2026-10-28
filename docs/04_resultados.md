# Resultados

Documento 4 de 5. Reúne las cifras del proyecto, cada una con su réplica o resumen, subconjunto, escala y denominador, como pide la rúbrica (sección 10). La interpretación está en `05_evaluacion_resultados.md`.

- **Origen:** ejecución completa del 2026-10-22 (R 4.6.1, Windows 11), registrada en `docs/bitacora.md`. Las tablas fuente están en `output/tablas/` con 17 cifras significativas; aquí se redondean.
- **Escalas:** las tasas son proporciones en $[0, 1]$; $J$ y $\tau$ están en su escala original.
- **Datos faltantes:** todas las cifras de este documento se transcribieron de los CSV (revisión del 2026-10-28). Las que no salen de un archivo del proyecto se marcan explícitamente como cálculo adicional.

## 1. Datos y población

Fuente: `data/processed/registro_exclusiones.csv`.

| Paso | Filas |
|---|---|
| Filas originales de `adult.data` | 32 561 |
| Excluidas por faltantes en columnas requeridas | 0 |
| Excluidas por `education-num` < 9 | 4 253 |
| **Total final (tabla analítica)** | **28 308** |

| Clase | Personas | Proporción |
|---|---|---|
| 0 (≤ USD 50.000) | 20 711 | 0,7316 |
| 1 (> USD 50.000) | 7 597 | 0,2684 |

- Faltantes en el archivo crudo: `workclass` 1 836, `occupation` 1 843, `native_country` 583 (2 399 filas con algún faltante). En la tabla final quedan `workclass` 1 408, `occupation` 1 411, `native_country` 499 (1 887 filas), todos en columnas no usadas.
- Composición de la tabla analítica por categoría conjunta (`table(tabla$g, tabla$clase)` sobre `data/processed/tabla_analitica.rds`; no hay un CSV del proyecto con este cuadro):

  | Categoría $g$ | $N_g$ | Clase 0 | Clase 1 | Prevalencia de clase 1 |
  |---|---|---|---|---|
  | Female/White | 7 661 | 6 647 | 1 014 | 0,132 |
  | Female/Black | 1 306 | 1 221 | 85 | 0,065 |
  | Female/Asian-Pac-Islander | 303 | 264 | 39 | 0,129 |
  | Female/Amer-Indian-Eskimo | 104 | 92 | 12 | 0,115 |
  | Female/Other | 76 | 70 | 6 | 0,079 |
  | Male/White | 16 674 | 10 779 | 5 895 | 0,354 |
  | Male/Black | 1 275 | 998 | 277 | 0,217 |
  | Male/Asian-Pac-Islander | 644 | 414 | 230 | 0,357 |
  | Male/Amer-Indian-Eskimo | 152 | 130 | 22 | 0,145 |
  | Male/Other | 113 | 96 | 17 | 0,150 |
  | **Total** | **28 308** | **20 711** | **7 597** | **0,268** |

- Composición por educación: HS-grad 10 501, Some-college 7 291, Assoc-voc 1 382, Assoc-acdm 1 067, Bachelors 5 355, Masters 1 723, Prof-school 576, Doctorate 413.
- MD5: `adult.data` 5d7c39d7b8804f071cdd1f2a7c460872; `adult.names` 1a7cdb3ff7a1b709968b1c7a11def63e.

## 2. Réplica 1 ($b = 1$, semilla 20 261 021)

### 2.1 Tamaños

Fuente: `output/tablas/tamanos_replica1.csv`. Iguales en las 200 réplicas.

| Clase | $N_c$ | Disponibles | Entrenamiento | Validación | Prueba | Sin seleccionar |
|---|---|---|---|---|---|---|
| 0 | 20 711 | 16 568 | 6 077 | 2 071 | 2 072 | 10 491 |
| 1 | 7 597 | 6 077 | 6 077 | 759 | 761 | 0 |
| Total | 28 308 | 22 645 | 12 154 | 2 830 | 2 833 | 10 491 |

$n_* = 6\,077$. Prevalencia de clase 1: validación 0,26820, prueba 0,26862, tabla 0,26837.

### 2.2 Parámetros (entrenamiento)

Fuente: `output/tablas/parametros_replica1.csv`.

| Clase | $n$ | Previa | $\hat\mu$ edad | $\hat\sigma$ edad | $\hat\mu$ horas | $\hat\sigma$ horas |
|---|---|---|---|---|---|---|
| 0 | 6 077 | 0,5 | 36,8789 | 13,3548 | 39,3671 | 12,1035 |
| 1 | 6 077 | 0,5 | 44,1450 | 10,4957 | 45,4119 | 11,0004 |

Unidades: años y horas por semana. Se obtienen cuatro medias y cuatro desviaciones, como pide la rúbrica (sección 4).

### 2.3 Densidad para una edad observada

Fuente: `output/tablas/densidad_ejemplo_replica1.csv`. Edad $z = 37$ (persona id 11).

| Clase | $\hat\mu$ | $\hat\sigma$ | $\log f(37)$ | $f(37)$ (por año) | $F(37)$ |
|---|---|---|---|---|---|
| 0 | 36,8789 | 13,3548 | −3,510855 | 0,029871 | 0,5036 |
| 1 | 44,1450 | 10,4957 | −3,501617 | 0,030149 | 0,2480 |

$\log f$ se calcula con `log_densidad_normal()` (a mano); $f = \exp(\log f)$; $F$ con `pnorm()`, solo para interpretar. La diferencia $\log f_1(37) - \log f_0(37) = +0{,}009237$ es la contribución de la edad de la sección 2.5.

### 2.4 Probabilidades categóricas con Laplace

Fuentes: `output/tablas/probabilidades_g_replica1.csv` (20 filas), `probabilidades_e_replica1.csv` (16 filas). $n_0 = n_1 = 6\,077$. Denominadores: $6\,077 + 10 = 6\,087$ para $\hat p_{c,g}$ y $6\,077 + 8 = 6\,085$ para $\hat q_{c,e}$. La última columna es la contribución que cada nivel aporta a $D$.

| $g$ | $n_{0,g}$ | $\hat p_{0,g}$ | $n_{1,g}$ | $\hat p_{1,g}$ | $\log(\hat p_{1,g}/\hat p_{0,g})$ |
|---|---|---|---|---|---|
| Female/White | 1 963 | 0,322655 | 822 | 0,135206 | −0,8698 |
| Female/Black | 353 | 0,058157 | 72 | 0,011993 | −1,5788 |
| Female/Asian-Pac-Islander | 82 | 0,013636 | 33 | 0,005586 | −0,8925 |
| Female/Amer-Indian-Eskimo | 24 | 0,004107 | 8 | 0,001479 | −1,0217 |
| Female/Other | 17 | 0,002957 | 4 | 0,000821 | −1,2809 |
| Male/White | 3 151 | 0,517825 | 4 701 | 0,772466 | +0,4000 |
| Male/Black | 309 | 0,050928 | 217 | 0,035814 | −0,3521 |
| Male/Asian-Pac-Islander | 126 | 0,020864 | 188 | 0,031050 | +0,3976 |
| Male/Amer-Indian-Eskimo | 32 | 0,005421 | 18 | 0,003121 | −0,5521 |
| Male/Other | 20 | 0,003450 | 14 | 0,002464 | −0,3365 |
| **Suma** | **6 077** | **1** | **6 077** | **1** | |

| $e$ | $m_{0,e}$ | $\hat q_{0,e}$ | $m_{1,e}$ | $\hat q_{1,e}$ | $\log(\hat q_{1,e}/\hat q_{0,e})$ |
|---|---|---|---|---|---|
| HS-grad | 2 519 | 0,414133 | 1 349 | 0,221857 | −0,6242 |
| Some-college | 1 776 | 0,292030 | 1 107 | 0,182087 | −0,4724 |
| Assoc-voc | 293 | 0,048316 | 287 | 0,047329 | −0,0206 |
| Assoc-acdm | 234 | 0,038620 | 211 | 0,034840 | −0,1030 |
| Bachelors | 949 | 0,156122 | 1 778 | 0,292358 | +0,6273 |
| Masters | 235 | 0,038784 | 772 | 0,127034 | +1,1864 |
| Prof-school | 43 | 0,007231 | 336 | 0,055382 | +2,0359 |
| Doctorate | 28 | 0,004766 | 237 | 0,039113 | +2,1050 |
| **Suma** | **6 077** | **1** | **6 077** | **1** | |

Las contribuciones de las dos últimas columnas se calcularon a partir de las probabilidades del CSV; el proyecto guarda la contribución solo por persona (`c_g`, `c_educacion` en `persona_replica1.csv` y en `prueba` de cada `.rds`). En las 200 réplicas ningún conteo $n_{c,g}$ o $m_{c,e}$ de entrenamiento fue cero (mínimos 1 y 19).

### 2.5 Persona descompuesta

Fuente: `output/tablas/persona_replica1.csv`. Primera persona de prueba por `id_original`.

| Campo | Valor |
|---|---|
| `id_original` | 11 |
| Edad, horas | 37 años, 80 h/semana |
| Educación, categoría conjunta | Some-college, Male/Black |
| Clase observada | 1 |
| Contribución previa | 0 |
| Contribución edad | +0,009237 |
| Contribución horas | +0,787500 |
| Contribución educación | −0,472370 |
| Contribución categoría conjunta | −0,352077 |
| $D_{11}^{(1)}$ | −0,027710 |
| $\ell_0$, $\ell_1$ | −17,459817; −17,487527 |
| $\tau_1$ | 0,099101 |
| Predicción | 0 (falso negativo) |

Comprobaciones (`R/09_replica1.R` y `tests/test_09_replica1.R`): la suma de las cinco contribuciones reproduce $D$ con error relativo 0,11·ε (límite 16·ε); `D == l1 - l0` exacto; `pred == (D >= tau)`.

### 2.6 Distribución de $D$ en validación

$n = 2\,830$ (759 de clase 1, 2 071 de clase 0). Mínimo −5,93, mediana −0,37, máximo 3,86 (bitácora, módulo 03). Con corte 0: 592 de 759 positivos y 1 487 de 2 071 negativos quedan bien clasificados (TPR 0,780, TNR 0,718, $J$ 0,4980 en validación). En `candidatos_replica1.csv` corresponde a la fila $\tau = -0{,}001354$, que da la misma matriz.

### 2.7 Elección del umbral (validación)

Fuente: `output/tablas/candidatos_replica1.csv`, figura `output/figuras/curvas_validacion_replica1.png`.

| Cantidad | Valor |
|---|---|
| Valores distintos de $D$ ($L$) | 1 855 |
| Candidatos evaluados | 1 856 |
| Candidatos empatados en $J_{\max}$ | 1 |
| $J_{\max}$ (validación) | 0,5056 |
| $\varepsilon_{\text{mach}}$ | $2{,}220446 \times 10^{-16}$ |
| **$\tau_1$** | **0,0991012** |

En el corte $+\infty$ (todos negativos): exactitud 0,7318, TNR 1, TPR 0, F1 0, FPR 0, PPV no estimable (0 positivos predichos).

Validación en $\tau_1$ (fila `elegido = TRUE`, la 1 114 de 1 856):

| | Predicción 0 | Predicción 1 | Total |
|---|---|---|---|
| Clase 0 | TN = 1 541 | FP = 530 | 2 071 |
| Clase 1 | FN = 181 | TP = 578 | 759 |

| Exactitud | TPR | TNR | PPV | F1 | FPR | $J$ |
|---|---|---|---|---|---|---|
| 0,7488 | 0,7615 | 0,7441 | 0,5217 | 0,6192 | 0,2559 | 0,5056 |

### 2.8 Evaluación en prueba

$n_{\text{eval}} = 2\,833$.

| | Predicción 0 | Predicción 1 | Total |
|---|---|---|---|
| Clase 0 | TN = 1 552 | FP = 520 | 2 072 |
| Clase 1 | FN = 186 | TP = 575 | 761 |

| Exactitud | TPR | TNR | PPV | F1 | FPR | FNR | BA | J |
|---|---|---|---|---|---|---|---|---|
| 0,7508 | 0,7556 | 0,7490 | 0,5251 | 0,6196 | 0,2510 | 0,2444 | 0,7523 | 0,5046 |

## 3. Distribución entre las 200 réplicas (prueba)

Fuente: `output/tablas/resumen_replicas.csv` (con `replicas_indicadores.csv` de 200 filas). Figuras: `hist_tau.png`, `paneles_indicadores.png`, `boxplot_indicadores.png`. $r = 200$ en todas las variables (ningún indicador fue no estimable).

| Variable | Escala | $r$ | Media | sd | Mediana | p2,5 | p97,5 |
|---|---|---|---|---|---|---|---|
| $\tau_b$ | original | 200 | 0,0482 | 0,1314 | 0,0681 | −0,2156 | 0,2650 |
| Exactitud | proporción | 200 | 0,7327 | 0,0174 | 0,7363 | 0,6918 | 0,7579 |
| TPR | proporción | 200 | 0,7595 | 0,0327 | 0,7582 | 0,6925 | 0,8174 |
| TNR | proporción | 200 | 0,7228 | 0,0328 | 0,7283 | 0,6486 | 0,7713 |
| PPV | proporción | 200 | 0,5030 | 0,0209 | 0,5063 | 0,4586 | 0,5349 |
| F1 | proporción | 200 | 0,6044 | 0,0120 | 0,6062 | 0,5801 | 0,6265 |
| FPR | proporción | 200 | 0,2772 | 0,0328 | 0,2717 | 0,2287 | 0,3514 |
| FNR | proporción | 200 | 0,2405 | 0,0327 | 0,2418 | 0,1826 | 0,3075 |
| BA | proporción | 200 | 0,7412 | 0,0096 | 0,7418 | 0,7210 | 0,7578 |
| J | original | 200 | 0,4823 | 0,0192 | 0,4837 | 0,4419 | 0,5155 |

En cada réplica FPR = 1 − TNR y FNR = 1 − TPR; por eso sus sd coinciden con las de TNR y TPR, y su mediana es el complemento (1 − 0,7283 = 0,2717; 1 − 0,7582 = 0,2418), lo que el CSV confirma.

Rango completo (mínimo–máximo, de `replicas_indicadores.csv`): $\tau_b$ −0,3231 a 0,3195 (200 valores distintos, 61 negativos); exactitud 0,6745–0,7702; TPR 0,6820–0,8239; TNR 0,6207–0,7896; BA 0,7138–0,7609. Correlación entre réplicas: $\tau_b$ con TPR −0,88; $\tau_b$ con TNR +0,95 (calculadas sobre `replicas_indicadores.csv`; el proyecto no las guarda).

**Cálculo adicional, fuera de `run_all.R`: regla fija $\tau = 0$ en prueba.** Aplicando `predecir(r$prueba$D, 0)` a los 200 `.rds` (mismos modelos y personas de prueba) se obtienen estas medianas: exactitud 0,7289, TPR 0,7740, TNR 0,7119, PPV 0,4971, F1 0,6050, BA 0,7429, $J$ 0,4858 (sd de BA 0,0091). Frente a $\tau_b$ (BA 0,7418, sd 0,0096), elegir el umbral en validación no mejora BA en prueba; desplaza el reparto hacia más TNR y menos TPR. La rúbrica no lo pide; sirve solo para responder la pregunta hipotética.

## 4. Errores por categoría conjunta

Fuentes: `output/tablas/resumen_grupos.csv` (30 filas), `grupos_replicas.csv` (2 000 filas), `grupos_replica1.csv`, `marginales_sexo_replica1.csv`, `marginales_raza_replica1.csv`; figura `output/figuras/tasas_grupos.png`.

### 4.1 Medianas entre réplicas (prueba)

TPR y FNR tienen denominador $n_1$ (positivos reales del grupo en prueba); FPR, $n_0$ (negativos reales). Fuente: `output/tablas/resumen_grupos.csv`. «Den.» = denominador mínimo / mediano / máximo entre las 200 réplicas; $r$ = réplicas con el indicador estimable.

| Categoría | Indicador | Den. (mín/med/máx) | $r$ | Mediana | p2,5 | p97,5 |
|---|---|---|---|---|---|---|
| Female/White | TPR | 82 / 102 / 124 | 200 | 0,321 | 0,231 | 0,410 |
| | FPR | 610 / 665 / 718 | 200 | 0,077 | 0,055 | 0,114 |
| | FNR | 82 / 102 / 124 | 200 | 0,679 | 0,590 | 0,769 |
| Female/Black | TPR | 2 / 8 / 16 | 200 | 0,125 | 0,000 | 0,446 |
| | FPR | 93 / 120 / 147 | 200 | 0,008 | 0,000 | 0,020 |
| | FNR | 2 / 8 / 16 | 200 | 0,875 | 0,554 | 1,000 |
| Female/Asian-Pac-Islander | TPR | 0 / 4 / 9 | 198 | 0,268 | 0,000 | 1,000 |
| | FPR | 15 / 27 / 39 | 200 | 0,123 | 0,000 | 0,250 |
| | FNR | 0 / 4 / 9 | 198 | 0,732 | 0,000 | 1,000 |
| Female/Amer-Indian-Eskimo | TPR | 0 / 1 / 4 | 156 | 0,500 | 0,000 | 1,000 |
| | FPR | 3 / 9 / 17 | 200 | 0,000 | 0,000 | 0,200 |
| | FNR | 0 / 1 / 4 | 156 | 0,500 | 0,000 | 1,000 |
| Female/Other | TPR | 0 / 0 / 3 | 93 | 0,000 | 0,000 | 1,000 |
| | FPR | 1 / 7 / 14 | 200 | 0,000 | 0,000 | 0,143 |
| | FNR | 0 / 0 / 3 | 93 | 1,000 | 0,000 | 1,000 |
| Male/White | TPR | 558 / 590 / 618 | 200 | 0,860 | 0,794 | 0,923 |
| | FPR | 1 008 / 1 078 / 1 133 | 200 | 0,438 | 0,367 | 0,561 |
| | FNR | 558 / 590 / 618 | 200 | 0,140 | 0,077 | 0,206 |
| Male/Black | TPR | 15 / 27 / 40 | 200 | 0,474 | 0,275 | 0,668 |
| | FPR | 79 / 101 / 122 | 200 | 0,121 | 0,061 | 0,204 |
| | FNR | 15 / 27 / 40 | 200 | 0,526 | 0,332 | 0,725 |
| Male/Asian-Pac-Islander | TPR | 14 / 23 / 35 | 200 | 0,893 | 0,722 | 1,000 |
| | FPR | 28 / 42 / 64 | 200 | 0,474 | 0,300 | 0,623 |
| | FNR | 14 / 23 / 35 | 200 | 0,107 | 0,000 | 0,278 |
| Male/Amer-Indian-Eskimo | TPR | 0 / 2 / 7 | 182 | 0,250 | 0,000 | 1,000 |
| | FPR | 5 / 12 / 21 | 200 | 0,061 | 0,000 | 0,200 |
| | FNR | 0 / 2 / 7 | 182 | 0,750 | 0,000 | 1,000 |
| Male/Other | TPR | 0 / 1 / 6 | 170 | 0,500 | 0,000 | 1,000 |
| | FPR | 2 / 9 / 17 | 200 | 0,083 | 0,000 | 0,333 |
| | FNR | 0 / 1 / 6 | 170 | 0,500 | 0,000 | 1,000 |

Los $r$ de TPR y FNR son 200 menos las réplicas sin positivos en prueba (Female/Other 107, Female/Amer-Indian-Eskimo 44, Male/Other 30, Male/Amer-Indian-Eskimo 18, Female/Asian-Pac-Islander 2; 201 en total). FPR es estimable en las 200 réplicas en los 10 grupos (el mínimo de $n_0$ es 1). La mediana de $n_1$ de Female/Other es 0: en más de la mitad de las réplicas ese grupo no tiene positivos en prueba.

### 4.2 Marginales por sexo (réplica 1, prueba)

Conteos sumados por sexo antes de calcular las tasas.

Fuente: `output/tablas/marginales_sexo_replica1.csv`.

| Sexo | $n$ | $n_1$ | $n_0$ | Prevalencia | TN | FP | FN | TP | TPR | FNR | FPR |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Female | 974 | 113 | 861 | 0,116 | 807 | 54 | 76 | 37 | 0,327 | 0,673 | 0,063 |
| Male | 1 859 | 648 | 1 211 | 0,349 | 745 | 466 | 110 | 538 | 0,830 | 0,170 | 0,385 |
| **Total** | **2 833** | **761** | **2 072** | 0,269 | 1 552 | 520 | 186 | 575 | 0,756 | 0,244 | 0,251 |

FNR = 1 − TPR. La fila total coincide con la matriz global de prueba de la réplica 1 (sección 2.8).

### 4.3 Marginales por raza y composición por grupo (réplica 1, prueba)

Fuente: `output/tablas/marginales_raza_replica1.csv` (conteos sumados por raza antes de calcular tasas).

| Raza | $n$ | $n_1$ | $n_0$ | Prevalencia | TN | FP | FN | TP | TPR | FPR | FNR |
|---|---|---|---|---|---|---|---|---|---|---|---|
| White | 2 442 | 689 | 1 753 | 0,282 | 1 270 | 483 | 148 | 541 | 0,785 | 0,276 | 0,215 |
| Black | 256 | 40 | 216 | 0,156 | 204 | 12 | 25 | 15 | 0,375 | 0,056 | 0,625 |
| Asian-Pac-Islander | 86 | 26 | 60 | 0,302 | 39 | 21 | 9 | 17 | 0,654 | 0,350 | 0,346 |
| Amer-Indian-Eskimo | 23 | 3 | 20 | 0,130 | 18 | 2 | 1 | 2 | 0,667 | 0,100 | 0,333 |
| Other | 26 | 3 | 23 | 0,115 | 21 | 2 | 3 | 0 | 0,000 | 0,087 | 1,000 |

Fuente: `output/tablas/grupos_replica1.csv` (composición, matriz y tasas por categoría conjunta).

| Categoría | $n$ | $n_1$ | $n_0$ | Prevalencia | TN | FP | FN | TP | TPR | FPR | FNR |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Female/White | 793 | 98 | 695 | 0,124 | 648 | 47 | 65 | 33 | 0,337 | 0,068 | 0,663 |
| Female/Black | 133 | 9 | 124 | 0,068 | 122 | 2 | 6 | 3 | 0,333 | 0,016 | 0,667 |
| Female/Asian-Pac-Islander | 27 | 3 | 24 | 0,111 | 20 | 4 | 3 | 0 | 0,000 | 0,167 | 1,000 |
| Female/Amer-Indian-Eskimo | 8 | 1 | 7 | 0,125 | 6 | 1 | 0 | 1 | 1,000 | 0,143 | 0,000 |
| Female/Other | 13 | 2 | 11 | 0,154 | 11 | 0 | 2 | 0 | 0,000 | 0,000 | 1,000 |
| Male/White | 1 649 | 591 | 1 058 | 0,358 | 622 | 436 | 83 | 508 | 0,860 | 0,412 | 0,140 |
| Male/Black | 123 | 31 | 92 | 0,252 | 82 | 10 | 19 | 12 | 0,387 | 0,109 | 0,613 |
| Male/Asian-Pac-Islander | 59 | 23 | 36 | 0,390 | 19 | 17 | 6 | 17 | 0,739 | 0,472 | 0,261 |
| Male/Amer-Indian-Eskimo | 15 | 2 | 13 | 0,133 | 12 | 1 | 1 | 1 | 0,500 | 0,077 | 0,500 |
| Male/Other | 13 | 1 | 12 | 0,077 | 10 | 2 | 1 | 0 | 0,000 | 0,167 | 1,000 |

En la réplica 1 todas las categorías tienen al menos un positivo en prueba, así que las 30 tasas son estimables. Las tasas 0 y 1 de los grupos pequeños salen de 1 a 3 positivos: Female/Amer-Indian-Eskimo tiene TPR 1,000 con un único positivo.

### 4.4 Comprobación de agregación

En las 200 réplicas, las 10 matrices por grupo suman la matriz global y $\sum_g n_g$ es igual al tamaño de prueba. Las marginales por sexo y por raza de la réplica 1 suman la matriz global.

## 5. Diagnósticos (réplica 1, entrenamiento)

Fuentes: `output/figuras/qq_replica1.png`, `edad_horas_replica1.png`, `output/tablas/educacion_g_replica1.csv`.

| Diagnóstico | Resultado |
|---|---|
| Q–Q edad, clase 0 | Piso en 17–20 años y cola superior larga (asimetría a la derecha): mínimo 17, el 7,1 % tiene 20 años o menos, cuartiles 26 / 34 / 45, máximo 90 |
| Q–Q edad, clase 1 | Buen ajuste en el centro, cola inferior más corta: mínimo 21, cuartiles 36 / 43 / 51, máximo 90 |
| Q–Q horas, ambas clases | Valores discretos (82 y 77 valores distintos), gran masa en 40 (48,6 % en clase 0, 41,6 % en clase 1), topes en 1 y 99. En clase 0 los cuartiles son 37 / 40 / 40 (rango intercuartílico 3); en clase 1, 40 / 40 / 50 |
| Pearson edad–horas (a mano) | 0,024 (clase 0), −0,122 (clase 1) |
| Educación × categoría conjunta | 32 de 160 celdas en cero (19 en clase 0, 13 en clase 1). Por educación: Doctorate 11, Prof-school 9, Masters 4, Assoc-voc 4, Assoc-acdm 2, HS-grad 1, Some-college 1, Bachelors 0. Por grupo: Female/Other 8, Male/Amer-Indian-Eskimo 6, Male/Other 6, Female/Asian-Pac-Islander 4, Female/Amer-Indian-Eskimo 4, Female/Black 3, Male/Black 1; ninguna en Female/White, Male/White ni Male/Asian-Pac-Islander |

Los cuartiles, proporciones y conteos de celdas se calcularon sobre el entrenamiento de la réplica 1 para describir las figuras; el proyecto guarda la figura y la tabla `educacion_g_replica1.csv`, no estos resúmenes.

## 6. Verificaciones numéricas (200 réplicas)

Fuente: `output/tablas/verificaciones_replicas.csv`.

| Verificación | Resultado |
|---|---|
| Previas, $\hat p_{c,g}$, $\hat q_{c,e}$ suman 1 | Sí; error máximo 1,1·10⁻¹⁶ = ε/2 (en $\hat p_{c,g}$); 0 exacto en previas y $\hat q_{c,e}$ |
| $n_*$ por clase en entrenamiento | Sí, 6 077 en todas |
| Destinos disjuntos y completos | Sí |
| Puntajes finitos | Sí |
| $D$ recalculado `identical()` al guardado | Sí |
| Contribuciones suman $D$ | Sí; máximo relativo 2,10·ε (límite 16·ε), máximo absoluto 9,1·10⁻¹⁵ |
| Matriz de prueba suma $n$ | Sí |
| Grupos suman la matriz global | Sí |
| Funciones a mano frente a R base | `tests/test_00_utilidades.R` (7 casos de prueba): diferencia máxima 4,4·10⁻¹⁶ (sd con empates), el resto 0. `tests/test_03_modelo.R` (réplica 1): `mean` 0, `sd` 1,8·10⁻¹⁵, `dnorm(log = TRUE)` 3,6·10⁻¹⁵. `tests/test_06_resumen.R`: `resumen_replicas.csv` frente a `mean`/`sd`/`median`/`quantile(type = 7)`, 1,1·10⁻¹⁶. Todas dentro de $n\,\varepsilon \max(1, \lvert\text{ref}\rvert)$ |

## 7. Trazabilidad y duplicados

Fuente: `output/tablas/trazabilidad.csv`. Perfil = las 15 columnas originales, sin `id_original`.

| Indicador | Valor |
|---|---|
| Filas de la tabla analítica | 28 308 |
| Perfiles distintos | 28 289 |
| Duplicados excedentes | 19 |
| Personas de prueba (réplica 1) | 2 833 |
| Con perfil igual a alguien de entrenamiento | 3 |
| Con perfil igual a alguien de validación | 1 |
| Con perfil igual a alguien de cualquiera de los dos | 4 (0,14 %) |

## 8. Ejecución y reproducibilidad

| Concepto | Valor |
|---|---|
| Fecha, entorno | 2026-10-22, R 4.6.1, Windows 11 |
| `Rscript run_all.R` desde cero | 137,5 s, sin errores |
| Corrida cronometrada por script (138,6 s en total) | `05` 123,2 s (89 %), `08` 9,0 s, `07` 1,9 s, `06` 1,8 s, `01` 1,4 s, `09` 0,6 s, resto ≈ 0 |
| Archivos generados | 200 `.rds` (35,5 MB = 33,9 MiB), 17 tablas, 7 figuras |
| Segunda ejecución desde cero | `.rds` `identical()` y CSV idénticos línea a línea |
| Tests (`tests/`, 9 scripts) | Todos pasan, unos 12 s |
