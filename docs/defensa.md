# Preparación para la defensa oral

La rúbrica dice que un integrante elegido al azar «expondrá y responderá preguntas» y el criterio 5 premia responder «con precisión» y localizar «las evidencias que respaldan los cálculos consultados». Más allá de las 10 preguntas, estas son las situaciones probables. Las cifras vienen de `docs/bitacora.md`; verifícalas en los CSV antes de citarlas.

## 1. «¿Por qué hicieron esto así?» (decisiones de diseño)

- **¿Por qué balancear solo el entrenamiento?** Para que el modelo no aprenda a favorecer la clase mayoritaria. Validación y prueba conservan la prevalencia real (≈ 27 % de >50K) para evaluar la regla en la población de la tabla.
- **¿Qué pasa con la previa de 0,5?** $\log \hat\pi_1 - \log \hat\pi_0 = 0$, así que la previa no aporta a $D$. Con las previas reales, $D$ cambiaría en una constante, $\log(0{,}268/0{,}732) \approx -1{,}0$. Eso solo desplaza el umbral y no cambia el orden de las personas, así que el $\tau_b$ elegido por Youden absorbe la diferencia.
- **¿Por qué Youden y no exactitud?** Con un 73 % de clase 0, clasificar a todos como 0 ya da exactitud 0,73 (es el corte $+\infty$ de la figura de validación). Youden da igual peso a TPR y TNR.
- **¿Por qué un conjunto de validación separado?** Si el umbral se eligiera en prueba, las métricas de prueba quedarían optimistas, porque se estaría evaluando con los mismos datos que fijaron la regla.
- **¿Por qué esos candidatos?** Entre dos valores consecutivos de $D$ la matriz no cambia, así que basta un punto por intervalo. $u_1$ y $+\infty$ representan «todos positivos» y «todos negativos». Se calcula $u_h/2 + u_{h+1}/2$ en vez de $(u_h + u_{h+1})/2$ para evitar desbordamiento.
- **¿Por qué el épsilon de máquina y el menor $|\tau|$?** Dos $J$ que deberían ser iguales pueden diferir en el último bit. Entre empates, la rúbrica fija el menor $|\tau|$ (lo más cercano a la regla de Bayes, $D \ge 0$) y luego el menor $\tau$.
- **¿Por qué logaritmos?** El producto de cuatro probabilidades y densidades pequeñas puede producir underflow. La suma de logaritmos es estable y conserva el orden.
- **¿Por qué Laplace?** Con $\alpha = 0$ un conteo cero daría $\log 0 = -\infty$ y un solo predictor anularía a todos los demás. Lo exige la rúbrica, y protege cualquier sorteo aunque en estos datos no hizo falta: en las 200 réplicas ningún $n_{c,g}$ ni $m_{c,e}$ de entrenamiento fue cero (mínimos 1 y 19). Con conteos chicos además modera la estimación: Female/Other de clase 1 tiene 4 en la réplica 1, y $\hat p = 5/6\,087 = 0{,}00082$ en vez de $4/6\,077 = 0{,}00066$. Ojo: los 32 ceros de `educacion_g_replica1.csv` (cruce educación × categoría) **no** son conteos que use el modelo; ese cuadro sirve para el diagnóstico de independencia, no para justificar Laplace.
- **¿Por qué una sola variable sexo/raza?** Así se captura la combinación (por ejemplo, Female/Black) sin suponer independencia entre sexo y raza dada la clase.
- **¿Por qué $n-1$?** Es el estimador insesgado de la varianza. Hay que saber decir que con $n_* = 6\,077$ la diferencia con $n$ es despreciable.

## 2. Supuestos del modelo y sus límites

- **Normalidad:** la edad es aproximada (asimétrica a la derecha en la clase 0). Las horas están lejos de ser normales: son discretas, con mucha masa en 40 y topes en 1 y 99. Hay que mostrar `qq_replica1.png` y saber explicar qué se ve.
- **Independencia condicional:** la correlación edad–horas es 0,024 (clase 0) y −0,122 (clase 1), débil. Educación y grupo pueden no ser independientes: lo muestra la tabla educación × g.
- **Alternativas** (pregunta típica): discretizar las horas, usar una densidad kernel o transformar las variables. Respuesta: la rúbrica fija la normal; el diagnóstico deja documentado el costo.
- **Densidad vs. probabilidad:** $f$ tiene unidades «por año» y no es una probabilidad. Ejemplo de la rúbrica: $\mu = 44$, $\sigma = 10$ dan $f(54) \approx 0{,}0242$ y $F(54) \approx 0{,}8413$. Ejemplo del proyecto (réplica 1, edad 37, `densidad_ejemplo_replica1.csv`): clase 0 ($\hat\mu = 36{,}88$, $\hat\sigma = 13{,}35$) $f = 0{,}02987$, $F = 0{,}504$; clase 1 ($\hat\mu = 44{,}14$, $\hat\sigma = 10{,}50$) $f = 0{,}03015$, $F = 0{,}248$. Las densidades casi iguales explican la contribución casi nula de la edad (+0,0092).

## 3. Interpretación de resultados

- **Los percentiles no son un intervalo de confianza.** Describen la variación frente al submuestreo sobre esta misma tabla, y las réplicas comparten personas. Es el error de interpretación que la rúbrica penaliza en el criterio 3.
- **Réplica 1:** $\tau_1 = 0{,}0991$, $J_{\max} = 0{,}5056$ en validación; en prueba TPR 0,756, TNR 0,749, PPV 0,525, BA 0,752. Hay que explicar por qué el PPV es bajo: con un 27 % de positivos, incluso un FPR de 0,25 produce muchos falsos positivos en términos absolutos.
- **Estabilidad del umbral:** $\tau_b$ va de −0,32 a 0,32 en 200 réplicas. Hay que saber relacionarlo con el cambio que eso produce en TPR/TNR (`paneles_indicadores.png`).
- **Grupos:** los hombres tienen TPR 0,830 (538/648) y FPR 0,385 (466/1 211); las mujeres TPR 0,327 (37/113) y FPR 0,063 (54/861) (marginal de la réplica 1, prueba). Para explicarlo:
  - $\hat p_{c,g}$ funciona como un factor de verosimilitud: pertenecer a un grupo con alta $P(G = g \mid C = 1)$ relativa a $P(G = g \mid C = 0)$ empuja $D$ hacia la clase 1. En la réplica 1, $\log(\hat p_{1,g}/\hat p_{0,g})$ es +0,400 para Male/White ($0{,}7725/0{,}5178$) y −0,870 para Female/White ($0{,}1352/0{,}3227$).
  - Hay que distinguir $\hat p_{c,g}$ (proporción del grupo dentro de una clase del entrenamiento) de la prevalencia de prueba (ingresos altos dentro del grupo). La rúbrica lo pregunta explícitamente en la sección 8.
- **Denominadores pequeños:** Female/Other tiene mediana $n_1 = 0$ y TPR estimable solo en 93 de 200 réplicas. Female/Black tiene $n_1 \approx 8$, así que un acierto mueve la TPR unos 12 puntos. Esos intervalos cubren casi todo $[0, 1]$.
- **Descripción, no causalidad:** las disparidades describen el comportamiento del clasificador en estos datos. No prueban discriminación ni causas.

## 4. «Muéstramelo en el proyecto»

Ten el proyecto abierto y sabe ir directo a:

- **$n_*$:** `tamanos_replica1.csv` ($n_* = 6\,077$ por clase) y `R/02_particion.R`.
- **Persona descompuesta:** `persona_replica1.csv`. Es el id 11 (37 años, 80 h, Some-college, Male/Black, clase 1), con $D = -0{,}0277 < \tau_1$, o sea un **falso negativo**. Las horas suman +0,787 y la educación (−0,472) y el grupo (−0,352) restan más.
- **Por qué se eligió $\tau_1$:** `candidatos_replica1.csv` (1 856 cortes, columna `elegido`) y `curvas_validacion_replica1.png`.
- **Reproducir una réplica en consola:** `particionar(tabla$clase, semilla_replica(1))`, luego `ajustar_nb()` y `puntuar()`. Antes ensaya cuánto tarda; `run_all.R` completo tarda unos 2,3 min.
- **Recalcular un $\hat p$ con Laplace:** desde `probabilidades_g_replica1.csv`, con $(conteo + 1)/(n_c + 10)$.
- **Las verificaciones:** `verificaciones_replicas.csv`, con todas las columnas lógicas en `TRUE` en las 200 réplicas.

## 5. Preguntas hipotéticas («¿qué pasaría si…?»)

- **$\alpha$ distinto de 1:** un $\alpha$ mayor acerca las probabilidades a la uniforme; uno menor, a las frecuencias observadas.
- **Sin balancear:** la previa ya no se cancela y los parámetros se estiman con más datos de clase 0. El umbral elegido por Youden compensaría parte de la diferencia.
- **Usar $\tau = 0$ fijo:** es la regla de Bayes con previas 0,5. En un cálculo adicional (fuera de `run_all.R`, aplicando `predecir(r$prueba$D, 0)` a los 200 `.rds`), la mediana de BA en prueba con $\tau = 0$ es 0,7429, frente a 0,7418 con $\tau_b$; TPR 0,774 frente a 0,758 y TNR 0,712 frente a 0,728. Elegir el umbral en validación no mejoró BA en prueba: cambió el reparto entre TPR y TNR. Si se cita, decir que es un cálculo extra y cómo se reproduce.
- **$\hat\sigma = 0$ o menos de 2 personas en una clase:** el código se detiene con `stop()`, como pide la rúbrica, para revisarlo con el docente.
- **Validación con una sola clase o $L = 1$:** se controla en `particionar()` y en `candidatos_umbral()`.
- **Usar `adult.test`:** la rúbrica pide solo `adult.data`; usarlo cambiaría la población.
- **Otra semilla u otro $B$:** las cifras cambian, pero las distribuciones deberían parecerse. Esa es justamente la pregunta que estudia el submuestreo.

## 6. Datos y alcance

- **Población:** personas con education-num ≥ 9 (secundaria completa o más), de un censo de EE. UU. de 1994. Los resultados no se generalizan a otra población ni a la actualidad.
- **Exclusiones:** solo se descartan faltantes en las columnas usadas, no en workclass, occupation ni native-country. Registro: 32 561 originales, 0 por faltantes requeridos, 4 253 por educación, 28 308 finales. Con `na.omit()` sobre todas las columnas se habrían perdido además 1 887 personas de la población filtrada.
- **Sin ponderación:** no se usa `fnlwgt`, así que las tasas son de la muestra, no de la población.
- **Duplicados:** 19 duplicados excedentes. En la réplica 1, 4 personas de prueba tienen un perfil idéntico a alguien de entrenamiento o validación: los identificadores son distintos, pero los valores coinciden.
- **Antecedentes** (sección 9.1): si algún análisis previo orientó decisiones, hay que declararlo.

## 7. Reproducibilidad y numérico

- **Semilla:** $20261021 + b - 1$; `set.seed()` con `sample.kind = "Rejection"`. Se usa `sample.int` porque `sample(x, n)` con `length(x) == 1` sortea de `1:x`.
- **$\varepsilon_{\text{mach}}$:** $2^{-52} \approx 2{,}22 \times 10^{-16}$, la separación entre 1 y el siguiente double.
- **Funciones a mano:** media, sd, log-densidad y percentil tipo 7 se calculan a mano; `mean`, `sd`, `dnorm` y `quantile` solo se usan para comprobar. Hay que saber explicar la posición $1 + (r-1)p$.
- **Precisión de los CSV:** se escriben con 17 cifras (`escribir_csv`) para no perder precisión. Se redondea solo al presentar.

## 8. Manejo de la exposición (criterios 6 y 7)

- La exposición debe durar entre 10 y 15 minutos (fuera de ese rango se pierde puntaje). Ensáyala cronometrada.
- Cada figura que se muestre tiene que llevar réplica o resumen, subconjunto, escala y denominadores.
- Si no sabes algo, di qué archivo lo contiene y ábrelo. La rúbrica premia «localizar las evidencias».
