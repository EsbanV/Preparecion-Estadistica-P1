# Commit 2 · Estructura inicial del proyecto

| | |
|---|---|
| **Commit** | `923e57f` · `chore: estructura inicial del proyecto` |
| **Rama** | `chore/estructura-inicial-proyecto` |
| **Archivos** | 20: `.gitignore`, `.Rproj`, `README.md`, `run_all.R`, `R/00`–`R/09` (vacíos con un comentario), carpetas con `.gitkeep` |

## Qué se hizo

Se armó el esqueleto completo del proyecto **sin lógica todavía**: diez scripts numerados en `R/`, cada uno con una sola línea que dice qué va a contener, un orquestador `run_all.R`, y las carpetas `data/raw`, `data/processed`, `output/replicas`, `output/tablas`, `output/figuras` y `logs`.

## Por qué se hizo así

- **Decidir la forma antes que el contenido.** Con los diez archivos creados de entrada, cada módulo posterior es un PR que solo rellena su archivo. Eso permite revisar cada pieza por separado. *(Cambio posterior, `df79467`: se reemplazó por un commit y un push por módulo en una sola rama, sin PR hasta que el equipo decida. Más adelante se agregaron `R/00_utilidades.R` y `tests/`, así que hoy hay once scripts en `R/`.)*
- **Numerar los scripts** fija el orden de ejecución: `00` configura, `01` prepara los datos, `02`–`04` definen funciones, `05` corre las 200 réplicas y `06`–`09` solo leen resultados para tablas y figuras.
- **Reproducibilidad (10 % de la nota).** La rúbrica pide que otra persona pueda regenerar todo. Por eso existe un único punto de entrada (`source("run_all.R")`) y las salidas están separadas de las entradas.

## Cómo se hizo

**`.gitignore`.** No se versionan los datos (`data/raw/*`, `data/processed/*`), las salidas (`output/*`) ni los logs: todo eso se regenera ejecutando el código. Se conserva solo el `.gitkeep` de cada carpeta para que exista en un clon nuevo. Los logs tienen una nota: si la entrega pide versionarlos, se quitan esas líneas.

**`.Rproj`.** Tres opciones importan para la reproducibilidad:

- `RestoreWorkspace: No` y `SaveWorkspace: No`: RStudio no guarda ni recarga `.RData`. Así nunca se arrastran objetos de una sesión anterior que oculten un error.
- `Encoding: UTF-8`: tildes y ñ se leen igual en todos los equipos.

Abrir el `.Rproj` deja el directorio de trabajo en la raíz, y por eso todas las rutas del proyecto son relativas (`data/raw/...`).

**`data/raw/` intocable.** La rúbrica exige conservar el archivo fuente. La convención es que el código solo lee de `raw/` y escribe en `processed/`.

**`run_all.R`.** Solo hace `source()` en orden, sin lógica propia. Si algo falla, se sabe en qué script ocurrió.

## Relación con la rúbrica

- Criterio 4 (código reproducible): ruta ejecutable única y datos fuente conservados.
- Sección 10 (entrega): pide la fuente de datos, la tabla analítica, el proyecto ejecutable y el registro de semillas y versiones. Cada uno tiene ya su carpeta (`data/raw`, `data/processed`, la raíz del proyecto, `logs/`).

## Para recordar

Si te preguntan "¿cómo reproduzco su análisis?": se clona el repo, se ponen `adult.data` y `adult.names` en `data/raw/`, se abre el `.Rproj` y se ejecuta `source("run_all.R")`.
