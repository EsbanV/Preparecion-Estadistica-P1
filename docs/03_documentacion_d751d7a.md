# Commit 3 · Contexto, arquitectura y bitácora

| | |
|---|---|
| **Commit** | `d751d7a` · `docs: contexto, arquitectura y bitácora` |
| **Archivos** | `CLAUDE.md` (39 líneas), `docs/arquitectura.md` (284), `docs/bitacora.md` (94) |

## Qué se hizo

Se escribieron tres documentos antes de programar:

- **`CLAUDE.md`**: resumen del proyecto y reglas de trabajo.
- **`docs/arquitectura.md`**: todas las fórmulas, la estructura del repo y el **contrato** de cada función (entradas, salidas y tipos).
- **`docs/bitacora.md`**: una ficha por módulo (estado, qué se implementó, verificaciones, dudas) que se completa al cerrar cada uno.

## Por qué se hizo

La rúbrica es larga y tiene muchos detalles finos: el orden de las exclusiones, cómo romper empates de Youden, el percentil tipo 7. Si cada módulo se programa leyendo el PDF por su cuenta, es fácil que dos archivos interpreten algo distinto. La arquitectura traduce la rúbrica **una sola vez** a fórmulas y contratos concretos. Después, cada módulo solo tiene que cumplir su contrato.

## Cómo se organizó

### Jerarquía de autoridad

Si dos fuentes se contradicen, gana la primera:

1. La rúbrica en PDF.
2. `docs/arquitectura.md`.
3. `R/00_config.R`.
4. El resto del código.

Además, la arquitectura **no se edita de paso** al implementar: si hace falta un cambio, se propone en el PR. Así no se mueve la base sin que nadie lo note.

> **Cambio posterior** (`df79467`): ya no hay PR por módulo; las propuestas se anotan en «Dudas abiertas» de `docs/bitacora.md`, se trabaja en una sola rama con un commit y un push por módulo, y no se hace merge hasta que el equipo lo decida.

### Jerarquía de dependencias

| Nivel | Archivos | Qué puede usar |
|---|---|---|
| 0 | `00_config` | nada |
| 1 | `01_datos` | nivel 0 |
| 2 | `02_particion`, `03_modelo`, `04_umbral_metricas` | nivel 0 |
| 3 | `05_replicas` | niveles 0–2 |
| 4 | `06`–`09` | niveles 0–2 y los `.rds` |

> **Cambio posterior** (`484e202` y `f5c01a6`): se agregó `R/00_utilidades.R` en el nivel 0, sin dependencias, ni siquiera de la config. Contiene `media_manual`, `sd_manual`, `percentil_tipo7` y, desde `618369f`, `escribir_csv`. También se agregó la carpeta `tests/`, fuera de la jerarquía. La tabla vigente está en `CLAUDE.md` y `docs/arquitectura.md`.

Regla: **un archivo solo depende de niveles inferiores**. Los tres de nivel 2 no se llaman entre sí. Por ejemplo, `04` recibe el vector de puntajes $D$ y no sabe que viene de un Naive Bayes, así que se puede probar con números inventados. `05` es el único que une partición, modelo y umbral, y los scripts de nivel 4 nunca vuelven a ajustar modelos: solo leen lo guardado.

### Decisión: cálculos a mano

La media, la desviación estándar, la log-densidad normal y el percentil tipo 7 se programan a mano. `mean`, `sd`, `dnorm` y `quantile` aparecen **solo** dentro de `stopifnot()` para comprobar que el resultado coincide. La razón es la sección 10 de la rúbrica: hay que *"desarrollar la estimación … a partir de las operaciones descritas, para poder reconstruir y explicar cada etapa"*. Además, la nota de preguntas (25 %) depende de poder explicar cada cálculo.

También se usa solo R base: nada de `caret`, `e1071` ni `tidymodels`.

## La teoría que quedó fijada en la arquitectura

Este es el resumen de lo que cada módulo implementará. Sirve como hoja de repaso general.

**Modelo (Naive Bayes mixto).** Por Bayes, $P(C = c \mid x) \propto P(C = c)\, P(x \mid C = c)$. El supuesto "naive" es que, **dada la clase**, los predictores son independientes, así que $P(x \mid c)$ se factoriza en un producto. Es "mixto" porque mezcla factores continuos (densidad normal) con categóricos (frecuencias). Con logaritmos, el producto pasa a ser una suma y se evita el *underflow* al multiplicar números muy pequeños:

$$
\ell_c(x_i) = \log \hat\pi_c + \log f_{c,\text{edad}} + \log f_{c,\text{horas}} + \log \hat q_{c,e_i} + \log \hat p_{c,g_i}
$$

**Diferencia de puntajes.** $D_i = \ell_1 - \ell_0$ es el log de la razón de posteriores. El denominador de Bayes, $P(x)$, se cancela. Se predice 1 si $D_i \ge \tau_b$. Como el entrenamiento está balanceado, $\hat\pi_0 = \hat\pi_1 = 0{,}5$ y la contribución de la previa a $D$ vale 0. Aun así se calcula y se guarda, porque la rúbrica pide las cinco contribuciones.

**Gaussiana en escala log.**

$$
\log f(z) = -\log\hat\sigma - \tfrac12 \log(2\pi) - \frac{(z - \hat\mu)^2}{2\hat\sigma^2}
$$

Se usa $n - 1$ en la desviación (estimador muestral).

**Laplace ($\alpha = 1$).** $\hat p_{c,g} = (n_{c,g} + 1)/(n_c + 10)$. Sin el $+1$, una categoría que no aparece en el entrenamiento tendría probabilidad 0, su log sería $-\infty$ y anularía todo el puntaje. Sumar $\alpha K$ al denominador mantiene $\sum_g \hat p_{c,g} = 1$.

**Por qué balancear.** Solo ~27 % de la tabla es clase 1. Con el entrenamiento a 50/50, el modelo no queda sesgado hacia la clase mayoritaria. Validación y prueba **no** se balancean, para medir el desempeño con la composición real.

**Youden.** $J = \text{TPR} + \text{TNR} - 1$ va de −1 a 1 y le da el mismo peso a acertar positivos y negativos ($\text{BA} = (J+1)/2$). Los candidatos son el menor valor observado, los puntos medios entre valores consecutivos y $+\infty$. Dos $J$ se consideran empatados si difieren en a lo más $\varepsilon_{\text{mach}}$, y en ese caso se elige el menor $|\tau|$ y después el menor $\tau$.

**Percentil tipo 7.** Con los $r$ valores ordenados, la posición es $h = 1 + (r-1)p$ y se interpola linealmente entre $x_{(\lfloor h \rfloor)}$ y el siguiente. Es el método por defecto de R.

## Relación con la rúbrica

- Criterio 2 (metodología, 25 %): cada etapa queda definida y es verificable.
- Criterio 5 (preguntas, 25 %): la arquitectura es la mejor hoja de estudio para las diez preguntas.
- La bitácora sirve de evidencia de las verificaciones, que el criterio 2 pide explícitamente.
