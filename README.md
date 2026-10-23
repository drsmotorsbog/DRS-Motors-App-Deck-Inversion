# DRS Motors App · deck de inversión

Documento interactivo para inversionistas de la DRS Motors App (octubre de 2026): visión, ecosistema, mercado, modelo de negocio, hoja de ruta, metas, tablero de proyecciones a 5 años con tres casos, calculadora de inversión, riesgos y equipo.

- **En línea:** https://drsmotorsbog.github.io/DRS-Motors-App-Deck-Inversion/
- **Copia privada en claude.ai:** https://claude.ai/artifact/7bN9wVe6jzeTZ2fFBmTwLf

El repositorio es público para que GitHub Pages sirva la página. La página pide a los buscadores que no la indexen, pero cualquiera con el enlace puede abrirla.

## Qué hay

| Ruta | Qué es |
|---|---|
| `index.html` | El deck armado, listo para abrir. Lo genera `herramientas/build.py`: no se edita a mano. |
| `fuente/fuente.html` | Estructura, textos y estilos del deck. |
| `fuente/app.js` | Animaciones, órbita de servicios, tablero de proyecciones y calculadora de inversión. |
| `fuente/modelo.js` | Motor de proyecciones: usuarios, comercios, ingresos, costos, EBITDA y caja mes a mes durante 60 meses. |
| `fuente/casos.js` | Supuestos de los casos pesimista, conservador y favorable. |
| `docs/resumen-de-costos.md` | Resumen de costos del plan de 8 meses que se le mandó al equipo de ingeniería. |
| `herramientas/build.py` | Arma `index.html` con los tokens, el logo y los iconos de la marca. |
| `herramientas/prueba-modelo.js` | Corre los tres casos en la terminal y muestra los resultados por año. |
| `herramientas/capturas.cjs` | Abre el deck en Chrome sin ventana, en computador y en celular, y revisa errores y el tablero. |

## Cambiar algo

1. Edita lo que toque en `fuente/`.
2. Arma la página: `python3 herramientas/build.py`. La marca (`Marca/`) no está en este repositorio: el script la busca en la carpeta de DRS Motors, dos niveles arriba, o en la ruta de la variable `DRS_MARCA`.
3. Si cambiaste supuestos o el motor: `node herramientas/prueba-modelo.js`.
4. Sube el cambio a `main`. GitHub Pages publica en uno o dos minutos.

## Reglas que el deck respeta

- DRS Motors es una sociedad de hecho. La inversión entraría a una S.A.S. que se constituirá para la app; ningún texto trata a DRS como persona jurídica.
- La comisión de consignación nunca se anuncia.
- Las proyecciones son ilustrativas y parten del caso pesimista. Las cifras sin fuente están marcadas como estimado o supuesto.
- Marca: modo noche, un solo Azul Acero por composición, Bebas Neue y Montserrat, radio 0, iconos del sprite oficial.
