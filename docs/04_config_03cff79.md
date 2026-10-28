# Commit 4 · `R/00_config.R`

| | |
|---|---|
| **Commit** | `03cff79` · `feat: implementa R/00_config.R (rutas, constantes, niveles y verificaciones)` |
| **Rama** | `feat/00-config` |
| **Archivos** | `R/00_config.R` (+96), `docs/bitacora.md` (ficha de 00 en curso) |

## Qué se hizo

Se escribió el archivo de nivel 0: **todas las constantes del proyecto en un solo lugar**, más una función (`semilla_replica`). No calcula nada ni escribe a disco. Al final tiene un bloque `stopifnot()` que se detiene si alguna constante quedó mal.

## Por qué se hizo

Si el 200, el 20261021 o la lista de niveles educativos estuvieran escritos en varios archivos, bastaría un error de tipeo en uno para que dos módulos trabajaran con supuestos distintos. Centralizarlos hace que cambiar algo sea cambiarlo una vez, y que todos los demás scripts lo hereden. Por eso `00_config.R` es el tercer nivel de autoridad, después de la rúbrica y la arquitectura.

## Cómo se hizo (y la teoría detrás)

### Réplicas y semilla

```r
B            <- 200L
SEMILLA_BASE <- 20261021L
semilla_replica <- function(b) SEMILLA_BASE + b - 1L
```

- La `L` hace que el número sea **entero** (`integer`) y no `double`. Las verificaciones lo exigen con `is.integer()` para que la semilla sea exactamente la que pide la rúbrica.
- Réplica 1 → 20261021 (la fecha del enunciado); réplica 200 → 20261220. Ambas se comprueban.
- **Por qué una semilla por réplica:** `set.seed(s)` fija el punto de partida del generador pseudoaleatorio. Con la misma semilla, el mismo código produce el mismo sorteo. Con una semilla distinta por réplica, cualquier réplica se puede reproducir sola, sin correr las anteriores.
- `semilla` es un alias de `semilla_replica`. En la bitácora quedó anotado que no figura en la arquitectura. **Cambio posterior:** el alias se eliminó en el commit `22d3c45` (`refactor: DESTINOS a 00_config, elimina alias semilla…`); en la versión actual solo existe `semilla_replica()`.

### Parámetros numéricos

| Constante | Valor | Para qué |
|---|---|---|
| `ALPHA` | `1` | Suavizado de Laplace (lo usará `03_modelo.R`) |
| `EPS` | `.Machine[["double.eps"]]` | Tolerancia de empate de Youden (`04`) |
| `P_PERCENTILES` | `c(0.025, 0.975)` | Percentiles del resumen entre réplicas (`06`, `07`) |
| `PROPORCIONES` | `c(disp = 0.8, val = 0.1, pru = 0.1)` | Reparto dentro de cada clase (`02`) |

**Épsilon de máquina.** Es la distancia entre 1 y el siguiente número representable en doble precisión: $2^{-52} \approx 2{,}22 \times 10^{-16}$. Se obtiene del entorno con `.Machine[["double.eps"]]` y no se escribe a mano, porque la rúbrica pide *"obtenerlo durante la ejecución"*. La verificación `EPS == 2^-52` confirma que la máquina usa doble precisión estándar. Se usa porque dos cálculos que en matemáticas dan lo mismo pueden diferir en el último bit en el computador, y compararlos con `==` fallaría.

**`sum(PROPORCIONES) == 1` con tolerancia.** Se verifica `abs(sum(PROPORCIONES) - 1) <= EPS` en vez de `== 1`, por la misma razón: 0,1 no tiene representación binaria exacta.

### Columnas de `adult.data`

- `COLUMNAS_ADULT`: los 15 nombres de `adult.names`, con `_` en vez de `-` (`hours-per-week` → `hours_per_week`), porque en R un `-` en un nombre obliga a usar comillas invertidas.
- `COLUMNAS_REQUERIDAS`: las 7 columnas cuyo faltante excluye a la persona (age, hours_per_week, education, sex, race, education_num, income). Son exactamente los predictores, la clase y la columna del filtro, como dice la rúbrica. Un `NA` en `occupation`, por ejemplo, **no** excluye a nadie.
- `ETIQUETAS_INGRESO`: `c("0" = "<=50K", "1" = ">50K")`, indexadas por la clase. Así la definición de $c_i$ queda escrita en un solo lugar.

### Niveles de factores

```r
EDUCACION_NUM_MIN <- 9L
NIVELES_E    <- c("HS-grad", "Some-college", ..., "Doctorate")   # 8, en orden de education-num 9..16
NIVELES_SEXO <- c("Female", "Male")
NIVELES_RAZA <- c("White", "Black", "Asian-Pac-Islander", "Amer-Indian-Eskimo", "Other")
NIVELES_G    <- paste(rep(NIVELES_SEXO, each = 5), rep(NIVELES_RAZA, times = 2), sep = "/")
K_E <- length(NIVELES_E); K_G <- length(NIVELES_G)
```

- `NIVELES_G` queda como `"Female/White", …, "Female/Other", "Male/White", …, "Male/Other"`: sexo afuera y raza adentro. La verificación revisa las posiciones 1, 5, 6 y 10.
- $K_E = 8$ y $K_G = 10$ **se cuentan** con `length()` en vez de escribirse, como pide la rúbrica ("obtengan $K_G$ y $K_E$ contando los niveles").
- **Por qué niveles fijos (punto clave de teoría).** En un entrenamiento de una réplica puede pasar que no haya ninguna persona `Female/Other` de clase 1. Si el factor se construyera con los valores que aparecen, esa categoría desaparecería: la tabla tendría 9 columnas y el denominador de Laplace sería $n_c + 9$ en vez de $n_c + 10$. Con `factor(..., levels = NIVELES_G)`, el conteo es 0, Laplace le da $(0+1)/(n_c+10) > 0$ y las probabilidades siguen sumando 1 sobre las 10 categorías.

### Indicadores y rutas

- `INDICADORES`: los nueve nombres en orden (exactitud, TPR, TNR, PPV, F1, FPR, FNR, BA, J).
- `RUTAS`: lista con las seis carpetas, construidas con `file.path()` para que funcionen en Windows y en Linux.

### Verificaciones

El `stopifnot()` final revisa tipos, valores, largos, ausencia de duplicados y orden de los niveles. Si algo cambia por error, `source("R/00_config.R")` se detiene con un mensaje en lugar de seguir con datos malos. Se probó con `Rscript` y termina sin errores.

## Dudas que quedaron abiertas

`PROPORCIONES`, `COLUMNAS_REQUERIDAS`, `ETIQUETAS_INGRESO`, `EDUCACION_NUM_MIN` y el alias `semilla` no están en la tabla de objetos de la arquitectura. Como la arquitectura no se edita de paso, se propone agregarlos en la descripción del PR.

> **Cambio posterior:** el flujo de trabajo cambió en `df79467` (actualización de `CLAUDE.md`): ya no se abren PR por módulo; todo se desarrolla en la rama `feat/01-datos` y las propuestas de cambio a la arquitectura se anotan en «Dudas abiertas» de `docs/bitacora.md`. Además, en `22d3c45` se agregó `DESTINOS` a `00_config.R` y se eliminó el alias `semilla`.

## Relación con la rúbrica

- Sección 3: $B = 200$ y semilla $20261021 + b - 1$.
- Sección 5: $K_G$, $K_E$ y niveles conservados en todas las réplicas aunque su conteo sea cero.
- Secciones 6–7: épsilon de máquina obtenido del entorno.
- Criterio 4: semillas registradas y reproducibles.

## Preguntas para practicar

- ¿Por qué `EPS` no se escribe como `2.22e-16`? → La rúbrica pide obtenerlo del entorno; además es exactamente $2^{-52}$ y un literal redondeado no lo sería.
- ¿Qué pasaría si `g` se construyera sin `levels`? → Una categoría ausente desaparecería y cambiaría el denominador de Laplace.
- ¿Cómo reproduzco solo la réplica 57? → La semilla es `semilla_replica(57L)` = 20 261 077. No basta con `set.seed()`: `particionar()` fija la semilla por dentro, con el generador explícito, así que se llama `particionar(tabla$clase, semilla_replica(57L))` y después `ajustar_nb()` y `puntuar()`, como en `R/05_replicas.R`. El resultado ya guardado está en `output/replicas/replica_057.rds`; `tests/test_05_replicas.R` comprueba que recalcular las réplicas 1, 100 y 200 da un resultado `identical()` a su `.rds`.
