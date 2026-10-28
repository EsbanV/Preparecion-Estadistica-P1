# Clasificación de ingresos mediante Naive Bayes mixto

**Universidad Católica de Temuco**
Escuela de Ingeniería Informática
INFO-1165
Prueba Práctica 2
2026

Enunciado y rúbrica de evaluación
21 de octubre de 2026

---

## 1. Problema, datos y población de estudio

Construirán un modelo Naive Bayes mixto para clasificar ingresos anuales utilizando edad, horas semanales de trabajo, nivel educativo y la combinación de sexo y grupo registrado en el archivo. El objetivo comprende la estimación del clasificador, la selección de su umbral y el estudio de la variación de sus resultados mediante submuestreo. También examinarán los errores en las categorías conjuntas de sexo y grupo.

Utilizarán Adult/Census Income, publicado por UCI a partir de información estadounidense de 1994. Descarguen `adult.data`, con registros separados por comas y sin encabezado, y `adult.names`, que describe sus columnas y categorías, desde <https://archive.ics.uci.edu/dataset/2/adult>. Conserven el archivo fuente y un identificador que permita localizar la fila original de cada observación.

La variable de clase se denota por $C$. Para la persona $i$, su clase observada es $c_i \in \{0, 1\}$, definida por

$$
c_i =
\begin{cases}
0, & \text{ingreso anual menor o igual que USD 50.000,} \\
1, & \text{ingreso anual superior a USD 50.000.}
\end{cases}
$$

Así, $c_i = 1$ corresponde a la etiqueta `>50K` y $c_i = 0$ a `<=50K`. La letra $c$ sin índice identificará cualquiera de esos dos valores al estimar una cantidad para una clase.

La población de trabajo comprende las personas con educación secundaria completa o superior. Conserven el código `education-num` mayor o igual que 9. Se admiten `HS-grad`, `Some-college`, `Assoc-voc`, `Assoc-acdm`, `Bachelors`, `Masters`, `Prof-school` y `Doctorate`. La etiqueta `12th` representa un nivel previo a la graduación secundaria y queda fuera del filtro.

| Campo | Columna | Uso |
|---|---|---|
| `age` | 1 | Edad en años: predictor numérico. |
| `hours-per-week` | 13 | Horas de trabajo semanales: predictor numérico. |
| `education` | 4 | Nivel educativo: predictor categórico. |
| `sex`, `race` | 10, 9 | Sexo y categoría racial registrada: forman una categoría conjunta. |
| `education-num` | 5 | Código para aplicar el filtro educativo. |
| Ingreso | 15 | Clase observada que se desea predecir. |

Eliminen espacios al inicio y al final de las etiquetas y reconozcan campos vacíos y signos de interrogación como valores faltantes. Primero excluyan filas incompletas en los predictores, la clase o el filtro; después apliquen el filtro educativo. Registren filas originales, exclusiones por faltantes requeridos, exclusiones educativas y total final en ese orden. Este registro permite reconstruir la tabla analítica y la población a la que se refieren los resultados.

## 2. Notación del modelo

En todo el documento, $i$ identifica a una persona y $b$ a una réplica de submuestreo. La clase observada $c_i$ pertenece a $\{0, 1\}$ con el significado definido en la sección anterior. Un sombrero sobre un símbolo señala una estimación. El superíndice $(b)$ indica que esa estimación o resultado corresponde a la réplica $b$.

| Símbolo | Definición y lectura |
|---|---|
| $N;\ i = 1, \dots, N$ | Número de personas de la tabla analítica e índice de una persona. |
| $C;\ c_i;\ c \in \{0, 1\}$ | Variable de clase; clase observada de la persona $i$; valor de clase para el que se calcula una cantidad. |
| $B;\ b = 1, \dots, B$ | Número de réplicas e índice de una réplica. Se utilizará $B = 200$. |
| $j \in \{\text{edad}, \text{horas}\};\ z_{i,j}$ | Nombre del predictor numérico y valor observado en la persona $i$. Por ejemplo, $z_{i,\text{edad}} = 54$ significa 54 años. |
| $E;\ e_i;\ e \in \mathcal{E}$ | Variable educativa; nivel observado en la persona $i$; un nivel del conjunto $\mathcal{E}$ de ocho etiquetas admitidas. |
| $S, R;\ s_i, r_i$ | Variables de sexo y grupo registrado, y sus valores observados en la persona $i$. |
| $G = (S, R);\ g_i = (s_i, r_i)$ | Variable conjunta y categoría observada. Por ejemplo, $g_i = \text{Female/White}$. |
| $g \in \mathcal{G};\ K_G, K_E$ | Una categoría del conjunto $\mathcal{G}$ de diez combinaciones; números de categorías de $G$ y educación: $K_G = 10$, $K_E = 8$. |
| $N_c;\ n_c^{(b)}$ | Personas con clase $c$ en toda la tabla; personas de esa clase seleccionadas para entrenar en la réplica $b$. |
| $n_{c,g}^{(b)}$ | Personas del entrenamiento $b$ que cumplen simultáneamente $c_i = c$ y $g_i = g$. |
| $m_{c,e}^{(b)}$ | Personas del entrenamiento $b$ que cumplen simultáneamente $c_i = c$ y $e_i = e$. |
| $\hat\pi_c^{(b)}$ | Probabilidad previa de la clase $c$, estimada en el entrenamiento $b$. |
| $\hat\mu_{c,j}^{(b)},\ \hat\sigma_{c,j}^{(b)}$ | Media y desviación estándar del predictor $j$ entre las personas de clase $c$ del entrenamiento $b$. |
| $\hat p_{c,g}^{(b)},\ \hat q_{c,e}^{(b)}$ | Probabilidades estimadas de la categoría conjunta $g$ y del nivel educativo $e$, dada la clase $c$, en el entrenamiento $b$. |
| $f_{c,j}^{(b)}(z);\ F_{c,j}^{(b)}(z)$ | Densidad normal y probabilidad acumulada del predictor $j$ para la clase $c$, estimadas en $b$ y evaluadas en $z$. |
| $x_i;\ \ell_c^{(b)}(x_i)$ | Predictores observados $(z_{i,\text{edad}}, z_{i,\text{horas}}, e_i, g_i)$; puntaje de la clase $c$ para esos valores en la réplica $b$. |
| $D_i^{(b)};\ \tau_b;\ \hat c_i^{(b)}$ | Diferencia de puntajes de la persona $i$; umbral seleccionado en validación; clase predicha en la réplica $b$. |

Por ejemplo, $n_{1,\text{Female/White}}^{(b)}$ cuenta las personas del entrenamiento $b$ con ingresos superiores a USD 50.000 y categoría conjunta Female/White. La variable $G$ ya está identificada por la definición del conteo y por la etiqueta del segundo subíndice. El glosario y las fórmulas conservarán esta misma notación.

El símbolo $P$ denota probabilidad y la barra vertical introduce una condición. Por ejemplo, $P(G = g \mid C = 1)$ es la probabilidad de pertenecer a $g$ dentro de la clase de ingresos superiores a USD 50.000. Todos los conteos, parámetros y resultados se obtendrán de los datos de la réplica correspondiente.

## 3. Submuestreo equilibrado y formación de las réplicas

El entrenamiento se equilibrará entre las dos clases de ingresos. En cada réplica se seleccionará el mismo número de personas de cada clase, determinado por la clase con menos observaciones disponibles. Repetir esta selección permite utilizar distintas personas en los entrenamientos y estudiar cuánto cambian el umbral y el desempeño del clasificador.

Cada réplica tiene tres etapas con funciones separadas. Entrenamiento permite estimar los parámetros del modelo; validación permite seleccionar un umbral utilizando esos parámetros; prueba permite evaluar la regla ya elegida. Las personas asignadas a esos destinos deben ser distintas dentro de una misma réplica.

Para la réplica $b$, sorteen dentro de cada clase un 80% disponible para entrenamiento, un 10% para validación y el resto para prueba. Los tamaños previos al balanceo son

$$
N_c^{\text{disp}} = \lfloor 0{,}80\,N_c \rfloor, \qquad
N_c^{\text{val}} = \lfloor 0{,}10\,N_c \rfloor, \qquad
N_c^{\text{pru}} = N_c - N_c^{\text{disp}} - N_c^{\text{val}}.
$$

Los superíndices identifican disponibilidad para entrenamiento, validación y prueba. El símbolo $\lfloor a \rfloor$ significa redondear $a$ hacia abajo. Las proporciones corresponden al reparto inicial de las personas.

Comprueben que validación y prueba contengan personas de ambas clases, para poder calcular sensibilidad y especificidad. Obtengan el tamaño común $n^* = \min(N_0^{\text{disp}}, N_1^{\text{disp}})$, donde $\min$ selecciona el menor tamaño.

Sorteen sin reemplazo $n^*$ personas de cada clase entre las disponibles para entrenamiento. Por tanto, $n_0^{(b)} = n_1^{(b)} = n^*$ y el entrenamiento contiene $2n^*$ personas. Sin reemplazo significa que una persona se selecciona una sola vez en ese sorteo. Las disponibles que queden sin seleccionar se registran aparte y quedan fuera de los cálculos de esa réplica.

El siguiente ejemplo general utiliza tres clases hipotéticas para ilustrar la selección al tamaño mínimo. En el problema de ingresos el mismo procedimiento se aplica a las dos clases definidas, 0 y 1.

| Clase | Total | Disponibles | Entrenamiento $b$ | Validación | Prueba | Sin seleccionar |
|---:|---:|---:|---:|---:|---:|---:|
| A | 50 | 40 | 40 | 5 | 5 | 0 |
| B | 100 | 80 | 40 | 10 | 10 | 40 |
| C | 200 | 160 | 40 | 20 | 20 | 120 |

El mínimo disponible es 40. Se seleccionan las 40 personas disponibles de A y se sortean 40 entre las 80 de B y 40 entre las 160 de C. Se entrena con esas 120 personas, se elige el umbral con validación y se registran los indicadores de prueba. La tabla permite comprobar que las observaciones sin seleccionar tienen un destino explícito.

Al comenzar la réplica siguiente vuelvan a sortear desde la tabla analítica completa. Una persona puede cambiar de destino entre réplicas. El balanceo se aplica al entrenamiento; validación y prueba conservan aproximadamente la composición de ingresos de la tabla para evaluar la regla en esa composición.

Utilicen $B = 200$ y semilla base 20261021. La réplica $b$ utilizará la semilla $20261021 + b - 1$, de modo que la primera coincide con la fecha del documento. Conserven identificadores, semillas y conteos de los cuatro destinos: entrenamiento, validación, prueba y disponibles sin seleccionar. Estos registros permiten repetir cada sorteo y comprobar que las personas de una misma réplica quedan separadas por función.

## 4. Probabilidades previas y distribución de edad y horas

Los parámetros se estiman exclusivamente con el entrenamiento de la réplica $b$. La previa expresa la proporción de cada clase dentro de ese entrenamiento:

$$
\hat\pi_c^{(b)} = \frac{n_c^{(b)}}{n_0^{(b)} + n_1^{(b)}}.
$$

Si se seleccionan 40 personas de clase 0 y 40 de clase 1, ambas previas son $40/80 = 0{,}5$. El balanceo solicitado produce esta igualdad en todas las réplicas. Estas previas describen la composición equilibrada utilizada para ajustar el modelo; la composición de ingresos observada se conserva y se informa en validación y prueba.

Para el predictor $j$, sean $T_c^{(b)}$ los índices de las personas de clase $c$ del entrenamiento $b$. La media y desviación estándar muestral se obtienen mediante

$$
\hat\mu_{c,j}^{(b)} = \frac{1}{n_c^{(b)}} \sum_{i \in T_c^{(b)}} z_{i,j}, \qquad
\hat\sigma_{c,j}^{(b)} = \sqrt{\frac{\sum_{i \in T_c^{(b)}} \left(z_{i,j} - \hat\mu_{c,j}^{(b)}\right)^2}{n_c^{(b)} - 1}}.
$$

Cada suma recorre las personas de esa clase en ese entrenamiento. Realicen el cálculo para edad y horas, dentro de las clases 0 y 1. Se obtienen cuatro medias y cuatro desviaciones en cada réplica.

La función que utiliza el modelo para evaluar un valor observado $z$ es la densidad normal

$$
f_{c,j}^{(b)}(z) = \frac{1}{\sqrt{2\pi}\,\hat\sigma_{c,j}^{(b)}}
\exp\left( -\frac{\left(z - \hat\mu_{c,j}^{(b)}\right)^2}{2\left(\hat\sigma_{c,j}^{(b)}\right)^2} \right).
$$

Aquí $\pi$ es la constante matemática y $\exp$ la función exponencial. La densidad describe cómo se distribuyen los valores del predictor dentro de la clase. Su evaluación en cada edad u horario observado proporciona el componente numérico que entrará en el puntaje.

Por ejemplo, consideren las 40 personas seleccionadas para la clase 1, correspondientes a ingresos superiores a USD 50.000. Supongan que sus edades producen media de 44 años y desviación estándar de 10 años. Para una persona de 54 años se utiliza $z_{i,\text{edad}} = 54$ y se obtiene $f_{1,\text{edad}}^{(b)}(54) \approx 0{,}0242$ por año. Para una persona de 44 años se evalúa la misma función en 44 y se obtiene aproximadamente 0,0399 por año. Se repite esta evaluación para la edad de cada persona que se desee clasificar y para la distribución estimada de cada clase.

La función acumulada se denota por $F_{c,j}^{(b)}(z)$ y expresa la probabilidad modelada de observar un valor menor o igual que $z$ en esa clase. En el ejemplo, $F_{1,\text{edad}}^{(b)}(54) \approx 0{,}8413$: alrededor del 84,13% de la distribución estimada queda hasta los 54 años. La densidad $f_{c,j}^{(b)}$ aporta el valor que se utiliza en el clasificador; la acumulada $F_{c,j}^{(b)}$ permite interpretar una proporción hasta un límite. Las probabilidades sobre intervalos se obtienen integrando la densidad.

Presenten para la primera réplica los tamaños de entrenamiento, las previas y las medias y desviaciones de edad y horas por clase. Agreguen una evaluación numérica de la densidad para una edad observada, identificando sus parámetros. Estas evidencias deben permitir reconstruir el componente numérico del modelo. Si falta el mínimo de dos observaciones o alguna desviación es nula, registren el caso y revisen ese ajuste con el docente antes de continuar.

## 5. Categorías conjuntas, educación y puntaje de clasificación

La variable $G$ reúne las combinaciones de Female y Male con los cinco grupos registrados: White, Black, `Asian-Pac-Islander`, `Amer-Indian-Eskimo` y Other. El conjunto $\mathcal{G}$ contiene sus diez combinaciones. El conjunto educativo $\mathcal{E}$ contiene las ocho etiquetas admitidas por el filtro. Obtengan $K_G$ y $K_E$ contando los niveles de esos conjuntos. Consérvenlos en todas las réplicas, para que cada categoría tenga la misma definición aunque su conteo sea cero en un entrenamiento.

Para cada clase, categoría conjunta y nivel educativo calculen los conteos $n_{c,g}^{(b)}$ y $m_{c,e}^{(b)}$ definidos en el glosario. Con suavizado de Laplace de parámetro $\alpha = 1$, sus probabilidades son

$$
\hat p_{c,g}^{(b)} = \frac{n_{c,g}^{(b)} + \alpha}{n_c^{(b)} + \alpha K_G}, \qquad
\hat q_{c,e}^{(b)} = \frac{m_{c,e}^{(b)} + \alpha}{n_c^{(b)} + \alpha K_E}.
$$

La primera estima $P(G = g \mid C = c)$; la segunda, $P(E = e \mid C = c)$. El ajuste agrega una unidad a cada conteo y el número de categorías al denominador. De esta forma cada categoría recibe una probabilidad positiva y se podrá calcular su logaritmo.

Por ejemplo, si el entrenamiento contiene 40 personas de clase 1 y ocho tienen categoría Female/White, entonces $n_{1,\text{Female/White}}^{(b)} = 8$ y $\hat p_{1,\text{Female/White}}^{(b)} = (8 + 1)/(40 + 10) = 0{,}18$. Si diez de esas 40 personas tienen educación `Bachelors`, entonces $m_{1,\text{Bachelors}}^{(b)} = 10$ y $\hat q_{1,\text{Bachelors}}^{(b)} = (10 + 1)/(40 + 8) \approx 0{,}2292$.

El modelo supone independencia condicional entre edad, horas, educación y la categoría conjunta, dada la clase. Ese supuesto permite multiplicar sus componentes. La combinación de sexo y grupo se estima mediante una sola categoría $G$. Obtengan sus probabilidades y las de educación como cuadros por clase, con los conteos que las originan, para comprobar los denominadores y el suavizado.

Para clasificar a la persona $i$, con predictores observados $x_i$, el puntaje de clase es

$$
\ell_c^{(b)}(x_i) = \log \hat\pi_c^{(b)}
+ \log f_{c,\text{edad}}^{(b)}(z_{i,\text{edad}})
+ \log f_{c,\text{horas}}^{(b)}(z_{i,\text{horas}})
+ \log \hat q_{c,e_i}^{(b)}
+ \log \hat p_{c,g_i}^{(b)}.
$$

El símbolo $\log$ representa el logaritmo natural. Los cinco términos corresponden a previa, edad, horas, educación y categoría conjunta. Los logaritmos convierten el producto en una suma que puede evaluarse con mayor estabilidad numérica. El denominador común de Bayes se cancela al comparar las razones de ambas clases.

Calculen $D_i^{(b)} = \ell_1^{(b)}(x_i) - \ell_0^{(b)}(x_i)$ y apliquen la regla

$$
\hat c_i^{(b)} =
\begin{cases}
1, & D_i^{(b)} \ge \tau_b, \\
0, & D_i^{(b)} < \tau_b.
\end{cases}
$$

El umbral $\tau_b$ se obtendrá con validación para esa réplica. Por ejemplo, si los puntajes son $-12$ para clase 1 y $-13$ para clase 0, la diferencia es 1. Con $\tau_b = 0{,}5$, la predicción es clase 1.

Para la primera persona de prueba de la primera réplica, ordenada por identificador original, muestren sus predictores, clase observada, cinco contribuciones a la diferencia, valor de $D_i^{(1)}$, umbral $\tau_1$ y predicción. Esta descomposición permite reconstruir una clasificación desde sus componentes. Conserven precisión completa en los cálculos y redondeen al presentar.

## 6. Indicadores y elección de un umbral por réplica

En cada réplica, la matriz de confusión cruza la clase observada $c_i$ con la predicha $\hat c_i^{(b)}$. La clase positiva es 1, correspondiente al ingreso superior a USD 50.000. Sus conteos son positivos correctos $TP$, negativos correctos $TN$, falsos positivos $FP$ y falsos negativos $FN$. Las siglas corresponden a los términos ingleses *true positive*, *true negative*, *false positive* y *false negative*.

| Clase observada | Predicción 0 | Predicción 1 |
|:---:|:---:|:---:|
| 0 | $TN$ | $FP$ |
| 1 | $FN$ | $TP$ |

Sea $n_{\text{eval}} = TP + TN + FP + FN$ el número de personas del subconjunto evaluado. La matriz y los indicadores se calculan en validación para elegir el umbral y en prueba para evaluar la regla elegida. Identifiquen siempre el subconjunto y la réplica.

| Indicador | Fórmula | Qué expresa |
|---|---|---|
| Exactitud | $(TP + TN)/n_{\text{eval}}$ | Proporción total de aciertos. |
| Sensibilidad, TPR | $TP/(TP + FN)$ | Proporción de positivos reales identificados. |
| Especificidad, TNR | $TN/(TN + FP)$ | Proporción de negativos reales identificados. |
| Precisión positiva, PPV | $TP/(TP + FP)$ | Proporción de predicciones positivas correctas. |
| $F1$ | $2TP/(2TP + FP + FN)$ | Resumen de recuperación y precisión positiva. |
| Tasa de falsos positivos, FPR | $FP/(TN + FP)$ | Proporción de negativos clasificados como positivos. |
| Tasa de falsos negativos, FNR | $FN/(TP + FN)$ | Proporción de positivos omitidos. |
| Exactitud balanceada, BA | $(TPR + TNR)/2$ | Desempeño con igual peso para ambas clases. |
| Youden, $J$ | $TPR + TNR - 1$ | Criterio de selección del umbral. |

Por ejemplo, si se identifican 40 de 50 positivos reales, la sensibilidad es $40/50 = 80\%$. Si se han predicho 100 positivos, la precisión positiva es $40/100 = 40\%$. Verifiquen cada denominador y reporten como no estimable cualquier indicador cuyo denominador sea cero.

Para seleccionar $\tau_b$, calculen los puntajes de validación con los parámetros del entrenamiento $b$. Sean $u_1 < \cdots < u_L$ sus $L$ valores distintos. Evalúen $u_1$, un corte entre cada par consecutivo $u_h, u_{h+1}$, con $h = 1, \dots, L-1$, y $+\infty$. Los extremos representan clasificar todas las personas como positivas o como negativas, respectivamente. Para $L = 1$ se utilizan esos dos extremos. Por ejemplo, los valores $-2, -1, 1$ generan los candidatos $-2, -1{,}5, 0, +\infty$.

Calculen el índice $J(\tau)$ en validación para cada candidato $\tau$. Maximizar Youden equivale a maximizar BA porque $BA = (J + 1)/2$. Sea $J_{\max}$ el máximo calculado y $\varepsilon_{\text{mach}}$ el épsilon de máquina, obtenido del entorno de ejecución. Consideren empatados los candidatos que cumplan $|J(\tau) - J_{\max}| \le \varepsilon_{\text{mach}}$. Entre ellos elijan primero el menor valor absoluto $|\tau|$ y después el menor $\tau$. La tolerancia se aplica en la escala acotada de Youden, de $-1$ a $1$.

## 7. Distribución de umbrales e indicadores

La réplica $b$ produce un entrenamiento equilibrado, un conjunto de parámetros, un umbral $\tau_b$ elegido con validación y los indicadores obtenidos en prueba. El proceso completo se repite $B = 200$ veces. Al finalizar tendrán los valores $\tau_1, \dots, \tau_{200}$ y 200 resultados de cada indicador que sea estimable en todas las pruebas.

El épsilon de máquina es la separación entre 1 y el siguiente valor representable en la precisión utilizada; en precisión doble habitual tiene una magnitud aproximada de $2{,}22 \times 10^{-16}$. Obtengan su valor durante la ejecución y conserven la precisión completa al comparar Youden. Para construir los puntos medios utilicen $u_h/2 + u_{h+1}/2$. Si el redondeo deja un corte fuera de $(u_h, u_{h+1}]$, el extremo superior representa la separación requerida por $D_i^{(b)} \ge \tau$.

Guarden todos los candidatos de validación, sus valores de Youden, el máximo, el épsilon consultado y el corte elegido. Este registro permite reconstruir por qué se seleccionó $\tau_b$. En la primera réplica grafiquen exactitud, TPR, TNR, PPV, $F1$ y FPR en validación frente a los cortes finitos, marcando $\tau_1$; muestren aparte el extremo infinito. Las curvas permiten interpretar el compromiso de la regla elegida. Después apliquen ese mismo umbral a prueba, conservando los parámetros del entrenamiento.

Representen la distribución de los umbrales y las de los indicadores de prueba. Para cada una informen media, desviación estándar, mediana y percentiles 2,5 y 97,5. La media resume el nivel promedio, la desviación su dispersión y la mediana identifica el centro. Los percentiles delimitan el 95% central de la distribución obtenida entre réplicas, como rango descriptivo de variación frente al submuestreo. Su interpretación corresponde al procedimiento aplicado sobre esta tabla, cuyas réplicas comparten personas.

Por ejemplo, si los percentiles de los umbrales resultan $-0{,}8$ y $-0{,}3$, ese rango describe dónde se sitúa la parte central de los $\tau_b$ obtenidos. Cada réplica ya fue evaluada en prueba con su propio $\tau_b$. Los percentiles se calculan al resumir esos resultados.

Para reproducir los percentiles utilicen interpolación lineal tipo 7: ordenen los $r$ valores estimables y sitúen el percentil en la posición $1 + (r - 1)p$, donde $p$ es su proporción, 0,025 o 0,975. Cuando esa posición cae entre dos valores consecutivos, interpólenlos según su distancia. Informen cuántos valores contribuyeron a cada resumen. Con uno, la desviación estándar queda sin valor; con cero, todos los resúmenes quedan sin valor.

Entreguen un cuadro con esos resúmenes para $\tau_b$ y para los nueve indicadores. Grafiquen al menos umbral, exactitud, TPR, TNR, PPV, $F1$ y BA; pueden reunirlos en paneles. Estos productos permiten observar nivel, dispersión y estabilidad. Identifiquen siempre la escala: tasas como proporciones o porcentajes, y Youden en su escala original.

## 8. Errores por categoría conjunta

Después de predecir en cada prueba con el modelo y umbral de la réplica, agrupen los resultados por $g \in \mathcal{G}$. Cada grupo conserva las predicciones que recibió al aplicar el clasificador global. Su matriz y sus tasas permiten detectar diferencias que pueden quedar ocultas al resumir toda la prueba.

Para un grupo $g$, sean $n_g^{\text{pru},(b)}$ sus personas de prueba, $n_{g,1}^{\text{pru},(b)}$ las de clase 1 y $n_{g,0}^{\text{pru},(b)}$ las de clase 0. La prevalencia del grupo es $n_{g,1}^{\text{pru},(b)} / n_g^{\text{pru},(b)}$. Los símbolos $TP_g, FN_g, FP_g, TN_g$ representan los conteos de su matriz en esa réplica. TPR y FNR utilizan como denominador sus positivos reales, y FPR sus negativos reales.

Por ejemplo, con 50 positivos reales un solo acierto cambia la sensibilidad en dos puntos porcentuales; con 200, el cambio es de medio punto. Mostrar los denominadores permite interpretar las tasas extremas de las categorías pequeñas. Si un grupo carece de positivos, TPR y FNR quedan sin valor; FPR podrá calcularse si tiene negativos.

Para la primera réplica, presenten composición, matrices y tasas por categoría conjunta. Agreguen matrices y tasas marginales por sexo y por grupo registrado, sumando los conteos de las categorías que correspondan antes de calcular las tasas. Estas agregaciones permiten examinar qué diferencias quedan visibles al reunir grupos.

Para cada categoría conjunta, resuman TPR, FPR y FNR entre réplicas mediante mediana y percentiles 2,5 y 97,5, con sus denominadores y el número de valores estimables. Grafiquen esos resultados. Comprueben que la suma de las diez matrices recupere la matriz global de la misma réplica. Las probabilidades $\hat p_{c,g}^{(b)}$ describen la categoría dentro de una clase del entrenamiento; la prevalencia de prueba describe los ingresos altos dentro del grupo. Sus denominadores indican la pregunta que responde cada cantidad.

## 9. Diagnósticos y comprobaciones

En la primera réplica elaboren cuatro gráficos Q–Q: edad y horas dentro de las clases 0 y 1 del entrenamiento. Un gráfico Q–Q compara los valores ordenados con cuantiles normales de referencia. Un cuantil identifica el valor hasta el que se acumula una proporción determinada de la distribución. Describan curvaturas, concentraciones y valores extremos para examinar la aproximación normal. Examinen además edad frente a horas y los conteos de educación frente a la categoría conjunta, por clase, para discutir dependencias que el modelo simplifica.

Las probabilidades previas deben sumar uno. Para cada clase, las probabilidades de las diez categorías conjuntas deben sumar uno, al igual que las de los ocho niveles educativos. En particular, comprueben

$$
\sum_{g \in \mathcal{G}} \hat p_{c,g}^{(b)} \approx 1, \qquad
\left| \sum_{g \in \mathcal{G}} \hat p_{c,g}^{(b)} - 1 \right| \approx 0.
$$

La primera expresión comprueba la suma esperada. La segunda expresa el error absoluto respecto de esa suma. Se espera una suma próxima a uno y un error próximo a cero, considerando el redondeo de la representación numérica. Realicen la misma comprobación para educación y previas, y registren las diferencias observadas. La tolerancia de comparación de Youden sigue siendo el épsilon de máquina especificado.

Comprueben también que el entrenamiento tenga $n^*$ personas por clase, que los destinos de cada réplica sean disjuntos, que cada persona tenga registrado su destino y que los puntajes sean finitos. La suma de contribuciones debe reproducir $D_i^{(b)}$ y las matrices deben recuperar el número de personas de prueba. Estas verificaciones permiten localizar errores de selección, denominadores y agregación.

### 9.1 Trazabilidad y alcance de los resultados

Busquen perfiles idénticos en las 15 columnas originales de la muestra filtrada, dejando fuera el identificador añadido. Mantengan las filas y reporten duplicados excedentes: un perfil repetido tres veces aporta dos. Cuenten las personas de prueba cuyo perfil coincida con alguno de entrenamiento o validación en la primera réplica. Este examen informa coincidencias de valores que la separación de identificadores deja pendientes.

Discutan cómo el filtro educativo, el origen histórico del archivo, sus categorías, el balanceo del entrenamiento y la ausencia de ponderación poblacional condicionan los resultados. Si análisis previos orientaron decisiones sobre el archivo, declaren ese antecedente para situar el alcance exploratorio de esta evaluación.

## 10. Entrega y presentación

El trabajo se realizará en GNU R, en equipos de tres integrantes. Desarrollen la estimación, las predicciones, la selección del umbral y los indicadores a partir de las operaciones descritas, para poder reconstruir y explicar cada etapa.

Entreguen el archivo fuente de datos conservado, su diccionario, la tabla analítica con identificadores, el proyecto ejecutable y un registro de las semillas y versiones utilizadas. Guarden índices, parámetros, candidatos de validación, umbral elegido y resultados de prueba por réplica. Estos elementos permiten reproducir los sorteos y auditar los cuadros finales.

El informe debe explicar población y variables, submuestreo equilibrado, estimación, elección de $\tau_b$, resultados, diagnósticos y alcance de las conclusiones. Incluyan los cuadros y gráficos solicitados con su réplica o resumen, subconjunto, escala y denominadores. Estas identificaciones permiten interpretar cada evidencia sin reconstruirla desde archivos separados.

Preparen respuestas a las diez preguntas siguientes, vinculándolas con los cálculos y resultados del proyecto:

1. ¿Qué significan $c_i = 0$ y $c_i = 1$, y qué personas integran la población analizada?
2. ¿Cómo se determina $n^*$ y cómo se forma el entrenamiento equilibrado de una réplica?
3. ¿Qué función cumplen validación, prueba y los disponibles sin seleccionar?
4. ¿Cómo se estiman las previas, medias y desviaciones a partir del entrenamiento?
5. ¿Qué representa la densidad de una edad y qué expresa su probabilidad acumulada?
6. ¿Cómo se obtienen $n_{c,g}^{(b)}$, $m_{c,e}^{(b)}$ y sus probabilidades con Laplace?
7. ¿Cómo se reconstruye una predicción desde sus cinco contribuciones?
8. ¿Cómo se elige $\tau_b$ con validación y se aplica después a prueba?
9. ¿Qué describen la distribución de umbrales, las de indicadores y sus percentiles?
10. ¿Qué explican los denominadores por grupo y las verificaciones de sumas próximas a uno?

La presentación se realizará el 29 de octubre de 2026, en el horario reservado por cada equipo en la hoja que el profesor pondrá a disposición. Un integrante elegido al azar expondrá y responderá preguntas, para evaluar la comprensión compartida del trabajo. La exposición durará entre 10 y 15 minutos; seleccionen evidencias representativas y conserven el detalle para consultas.

## 11. Rúbrica de evaluación

Cada indicador recibe 0, 1, 2 o 3 puntos. Su contribución al logro es su ponderación multiplicada por el puntaje dividido por tres. El logro total suma las siete contribuciones y sus ponderaciones suman 100%. Por ejemplo, dos puntos en un indicador de 25% aportan $(2/3)25 \approx 16{,}67$ puntos porcentuales. La conversión de logro a nota seguirá la regla comunicada por el curso.

Una omisión de presentación afecta una etiqueta, explicación o referencia recuperable del proyecto y conserva el cálculo central. Un error de procedimiento modifica población, selección equilibrada, estimaciones, umbral, predicciones o denominadores. Esta distinción se utiliza para aplicar los niveles siguientes.

### 1. Planteamiento del problema: 5%

Se evalúa la definición de población, clases, predictores y alcance, para establecer qué problema se resolvió y sobre quiénes se interpretan los resultados.

| Puntos | Evidencia observable |
|:---:|---|
| 3 | Define los cuatro elementos y los relaciona con los datos y el procedimiento. |
| 2 | Define población, clases y predictores, con una omisión de presentación sobre el alcance. |
| 1 | Identifica el objetivo general y presenta una confusión relevante sobre población, clase o predictor. |
| 0 | Carece de una definición utilizable de población y objetivo de clasificación. |

### 2. Cálculos y metodología: 25%

Se evalúan limpieza y selección equilibrada; estimación numérica y categórica; puntajes; selección de $\tau_b$; matrices y verificaciones, para comprobar cómo se producen los resultados.

| Puntos | Evidencia observable |
|:---:|---|
| 3 | Las etapas son correctas y verificables; calcula un umbral por réplica utilizando validación y épsilon de máquina. |
| 2 | Las etapas son correctas y una presenta una omisión de presentación recuperable del proyecto. |
| 1 | Se reconoce el procedimiento y existe un error que afecta selección, estimación, umbral o indicadores. |
| 0 | Faltan etapas esenciales para reconstruir una clasificación y su evaluación. |

### 3. Análisis de resultados: 25%

Se evalúa la interpretación de las distribuciones de umbrales e indicadores, los errores por grupo y los diagnósticos, para relacionar las conclusiones con la evidencia obtenida.

| Puntos | Evidencia observable |
|:---:|---|
| 3 | Interpreta nivel y variación de resultados, denominadores y diagnósticos, con conclusiones coherentes. |
| 2 | Interpreta los resultados centrales con una omisión acotada en una evidencia secundaria. |
| 1 | Describe resultados y presenta una confusión relevante de escala, denominador o interpretación de percentiles. |
| 0 | Las conclusiones centrales contradicen la evidencia o falta el análisis interpretativo. |

### 4. Código reproducible: 10%

Se evalúa la ejecución del proyecto y la regeneración de resultados, para que otra persona pueda repetirlo y auditarlo.

| Puntos | Evidencia observable |
|:---:|---|
| 3 | Reproduce las 200 réplicas, cada una con su entrenamiento, umbral e indicadores; conserva datos, índices, semillas y versiones. |
| 2 | Reproduce el análisis tras un ajuste menor de configuración, conservando fórmulas y resultados. |
| 1 | Reproduce una parte, requiere reparaciones o incluye resultados transcritos que debían calcularse. |
| 0 | Carece de una ruta ejecutable para reproducir el análisis. |

### 5. Respuestas a preguntas: 25%

Se evalúa la explicación individual del procedimiento y su relación con los resultados, para comprobar la comprensión del trabajo implementado.

| Puntos | Evidencia observable |
|:---:|---|
| 3 | Responde con precisión y localiza las evidencias que respaldan los cálculos consultados. |
| 2 | Responde lo esencial y corrige una imprecisión menor al consultar el proyecto. |
| 1 | Responde parcialmente y presenta vacíos relevantes al explicar decisiones o resultados. |
| 0 | Carece de una explicación utilizable de las decisiones o cálculos centrales consultados. |

### 6. Expresión oral: 5%

Se evalúa la claridad del razonamiento y la presentación de evidencias, para permitir seguir el procedimiento y sus resultados.

| Puntos | Evidencia observable |
|:---:|---|
| 3 | Explica con orden, define los términos utilizados y permite leer y seguir cuadros y figuras. |
| 2 | La exposición se comprende, con una dificultad menor de orden, terminología o referencia a la evidencia. |
| 1 | Las dificultades de claridad o legibilidad interrumpen reiteradamente la comprensión. |
| 0 | La exposición impide reconocer el procedimiento y los resultados presentados. |

### 7. Manejo del tiempo: 5%

Se evalúa la organización de la evidencia para una exposición de 10 a 15 minutos, antes de las preguntas. La desviación se mide desde el límite más cercano: una exposición de 9 minutos se aparta un minuto; una de 17, dos.

| Puntos | Evidencia observable |
|:---:|---|
| 3 | Duración entre 10 y 15 minutos, incluidos los extremos. |
| 2 | Desviación inferior a dos minutos. |
| 1 | Desviación desde dos minutos y menor que cinco. |
| 0 | Desviación de cinco minutos o más. |

## Fuentes de consulta

Becker, B. y Kohavi, R. (1996). Adult. UCI Machine Learning Repository. <https://doi.org/10.24432/C5XW20>. Fuente de datos y categorías.

Documentación de Naive Bayes gaussiano y categórico: <https://scikit-learn.org/stable/modules/naive_bayes.html>. Referencia conceptual de los componentes del modelo. Documentación de la distribución normal y precisión numérica: <https://stat.ethz.ch/R-manual/R-devel/>. Describe densidad, distribución acumulada y características del entorno de cálculo.
