# Commit 1 · Incorporación de la rúbrica

| | |
|---|---|
| **Commit** | `6663ff2` · `docs: incorporacion rubrica del proyecto` |
| **Autor** | diegoa18 · 22-10-2026 |
| **Archivos** | `docs/Rubrica_INFO1165_Prueba_2_Practica.pdf` |

## Qué se hizo

Se subió al repositorio el PDF con el enunciado y la rúbrica de la Prueba Práctica 2. Es el primer commit: antes de escribir una línea de código, el documento que manda queda versionado junto al proyecto.

## Por qué se hizo

Todo lo que viene después se justifica contra este PDF. En `CLAUDE.md` quedó escrito que, ante un conflicto, **la rúbrica gana** sobre la arquitectura y sobre el código. Tenerla dentro del repo evita trabajar con una copia distinta en cada computador y permite citar secciones exactas en los PR.

## Qué pide la rúbrica, en corto

1. **Datos y población.** Solo `adult.data`. Recortar espacios, tratar `""` y `"?"` como faltantes, excluir faltantes solo en las columnas requeridas y después filtrar `education-num >= 9`. Registrar los conteos en ese orden.
2. **Clase.** $c_i = 1$ si el ingreso es `>50K`, $c_i = 0$ si es `<=50K`.
3. **Predictores.** Edad y horas (numéricos, Gaussiana), educación (8 niveles) y la categoría conjunta sexo × raza (10 niveles), ambas categóricas con Laplace $\alpha = 1$.
4. **Réplicas.** $B = 200$, semilla $20261021 + b - 1$. En cada réplica: 80 % disponible / 10 % validación / 10 % prueba **dentro de cada clase**, y entrenamiento balanceado con $n_* = \min(N_0^{\text{disp}}, N_1^{\text{disp}})$ por clase.
5. **Umbral.** $\tau_b$ se elige en validación maximizando Youden $J = \text{TPR} + \text{TNR} - 1$, con empates dentro del épsilon de máquina.
6. **Resultados.** Nueve indicadores en prueba, resumidos entre réplicas (media, sd, mediana, percentiles 2,5 y 97,5 tipo 7).
7. **Grupos.** TPR, FPR y FNR por cada una de las 10 categorías sexo/raza, mostrando denominadores.
8. **Diagnósticos.** Q–Q, dependencia edad/horas, sumas de probabilidades ≈ 1, duplicados de perfil, etc.

## Cómo se evalúa

| Criterio | Peso | Qué mira |
|---|---|---|
| Planteamiento | 5 % | Población, clases, predictores y alcance |
| Cálculos y metodología | 25 % | Limpieza, balanceo, estimación, $\tau_b$ con épsilon, verificaciones |
| Análisis de resultados | 25 % | Interpretar distribuciones, denominadores por grupo, diagnósticos |
| Código reproducible | 10 % | Que se regeneren las 200 réplicas con semillas y versiones |
| Respuestas a preguntas | 25 % | Explicación individual (expone un integrante al azar) |
| Expresión oral | 5 % | Orden y claridad |
| Manejo del tiempo | 5 % | Entre 10 y 15 minutos |

Cada criterio se puntúa de 0 a 3 y aporta $\text{peso} \times \text{puntaje}/3$. La rúbrica distingue entre una **omisión de presentación** (falta una etiqueta o explicación, el cálculo está bien) y un **error de procedimiento** (cambia la población, el balanceo, las estimaciones, el umbral o los denominadores). Lo segundo es lo que más cuesta.

## Para repasar

Las diez preguntas de la sección 10 son la guía de estudio natural. Estado al 2026-10-28 (todos los módulos implementados; último commit `cc8efa7`). Las respuestas completas están en `01_preguntas_respuestas.md`:

1. Significado de $c_i$ y población → `R/01_datos.R`; `data/processed/registro_exclusiones.csv`.
2. Cómo se obtiene $n_*$ → `R/02_particion.R`; `output/tablas/tamanos_replica1.csv`, `logs/semillas.csv`.
3. Función de validación, prueba y sin seleccionar → `R/02_particion.R` y `R/05_replicas.R`; `verificaciones_replicas.csv`.
4. Previas, medias y desviaciones → `R/03_modelo.R` y `R/00_utilidades.R`; `parametros_replica1.csv`.
5. Densidad y acumulada → `R/03_modelo.R` y `R/09_replica1.R`; `densidad_ejemplo_replica1.csv`.
6. Conteos y Laplace → `R/03_modelo.R` (niveles fijos de `R/00_config.R`); `probabilidades_g_replica1.csv`, `probabilidades_e_replica1.csv`.
7. Las cinco contribuciones → `R/03_modelo.R` y `R/09_replica1.R`; `persona_replica1.csv`.
8. Elegir $\tau_b$ → `R/04_umbral_metricas.R` (`EPS` de `00_config.R`); `candidatos_replica1.csv`, `curvas_validacion_replica1.png`.
9. Distribución de umbrales y percentiles → `R/06_resumen.R` y `percentil_tipo7()`; `resumen_replicas.csv` y 3 figuras.
10. Denominadores por grupo y sumas ≈ 1 → `R/07_grupos.R` y `R/08_diagnosticos.R`; `resumen_grupos.csv`, `verificaciones_replicas.csv`.

*(En el commit `6663ff2` esta lista marcaba como «pendiente» los puntos 2–5, 7 y 10, porque esos módulos aún no existían.)*

Fecha de presentación: **29 de octubre de 2026**.
