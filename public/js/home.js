document.addEventListener("DOMContentLoaded", function () {
    console.log("Script home.js cargado correctamente");

    // Obtener nombre del usuario y saludar
    const nombre = localStorage.getItem("nombre") || "Amiga";
    document.getElementById("saludo").textContent = `¡Hola, ${nombre}!`;


    fetch(`/obtener-menarquia`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            const tipoMenarquia = data.data.tipoMenarquia || "sin_menarquia";
            mostrarMenarquia(tipoMenarquia);
        })
        .catch(error => console.error("Error al obtener la menarquía:", error));


    function mostrarMenarquia(tipoMenarquia) {
        const infoMenarquia = document.getElementById("tipoMenarquia");
        const consejosMenarquia = document.getElementById("consejosMenarquia");
    
        if (consejosPorMenarquia[tipoMenarquia]) {
            infoMenarquia.innerHTML = consejosPorMenarquia[tipoMenarquia].info;
            consejosMenarquia.innerHTML = consejosPorMenarquia[tipoMenarquia].consejos;
        } else {
            infoMenarquia.innerHTML = "<p>❓ No hay información sobre tu menarquia.</p>";
            consejosMenarquia.innerHTML = "";
        }
    }
    


    // Mostrar la fecha actual correctamente
    document.getElementById("fechaActual").textContent = new Date().toLocaleDateString('es', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    // Manejo del flujo de sangrado
    document.querySelectorAll("input[name='sangrado']").forEach(radio => {
        radio.addEventListener("change", (e) => {
            document.getElementById("flujoIntensidad").style.display = e.target.value === "si" ? "block" : "none";
        });
    });

    const consejosPorMenarquia = {
        temprana: {
            info: `
                <h2>¿Qué es la menarquia?</h2>
                <p>La menarquia es el nombre que le damos a la primera vez que una niña tiene su periodo menstrual. Es un signo de que su cuerpo está madurando y entrando en la pubertad. Esto generalmente ocurre entre los 10 y 15 años, pero puede variar de una niña a otra.</p>
    
                <h2>¿Qué es la menarquia temprana?</h2>
                <p>Se considera menarquia temprana cuando el primer periodo ocurre antes de los 8 años. Esto significa que el cuerpo de la niña está experimentando cambios puberales antes de lo esperado.</p>
    
                <h2>¿Por qué ocurre la menarquia temprana?</h2>
                <ul>
                    <li><strong>Factores genéticos:</strong> Si las mujeres de tu familia tuvieron su primer periodo temprano, es posible que tú también lo tengas.</li>
                    <li><strong>Factores ambientales:</strong> Ciertos químicos en los alimentos o productos pueden afectar nuestras hormonas.</li>
                    <li><strong>Condiciones médicas:</strong> En algunos casos, puede ser causada por problemas hormonales o tumores (aunque esto es menos común).</li>
                </ul>
    
                <h2>¿Qué debo hacer si tengo menarquia temprana?</h2>
                <p>Si tienes tu primer periodo antes de los 8 años, es importante hablar con un adulto de confianza (padres, familiares o maestros). Ellos te ayudarán a buscar un médico para asegurarse de que todo esté bien.</p>
    
                <h2>¿Es malo tener menarquia temprana?</h2>
                <p>En la mayoría de los casos, no es algo malo, pero es importante revisarlo con un médico. A veces, la menarquia temprana puede hacer que las niñas crezcan rápido al principio, pero luego dejen de crecer antes de lo esperado.</p>
    
                <h2>¿Qué puedo esperar?</h2>
                <p>Tener tu periodo significa que tu cuerpo está cambiando y preparándose para la adultez. Es normal sentirse nerviosa o confundida, pero recuerda que no estás sola. Muchas personas te apoyan en este proceso.</p>
            `,
            consejos: `
                <h2>Consejos para ti</h2>
                <ul>
                    <li><strong>Habla con un adulto de confianza:</strong> No tengas miedo de hablar sobre lo que te está pasando. Tus padres, un familiar o un maestro pueden ayudarte a entender y a sentirte más cómoda.</li>
                    <li><strong>Visita al médico:</strong> Es importante que un médico te revise para asegurarse de que todo esté bien. Ellos pueden responder a tus preguntas y ayudarte a sentirte más tranquila.</li>
                    <li><strong>Aprende sobre tu cuerpo:</strong> Investiga sobre la pubertad y la menstruación. Hay muchos libros y sitios web que pueden ayudarte a entender los cambios que estás experimentando.</li>
                    <li><strong>Cuida tu higiene:</strong> Usa productos de higiene femenina adecuados y cámbialos con frecuencia para mantenerte limpia y cómoda.</li>
                    <li><strong>No te compares con otras niñas:</strong> Cada cuerpo es diferente y se desarrolla a su propio ritmo. No te preocupes si tus amigas aún no tienen su periodo.</li>
                    <li><strong>Prepara un botiquín:</strong> Ten a mano productos de higiene femenina, analgésicos y ropa interior extra para estar preparada cuando te llegue el periodo.</li>
                </ul>
            `
        },
        regular: {
            info: `
                <h2>¿Qué es la menarquia regular?</h2>
                <p>La menarquia regular se refiere a la primera menstruación que ocurre dentro del rango de edad típico, que generalmente es entre los 10 y 15 años. Es un signo normal y saludable de que el cuerpo de una niña está madurando y entrando en la pubertad.</p>
    
                <h2>¿Qué significa esto?</h2>
                <p>Significa que tu cuerpo está siguiendo un patrón de desarrollo común. Tus hormonas están trabajando para preparar tu cuerpo para la edad adulta.</p>
    
                <h2>¿Qué puedo esperar?</h2>
                <ul>
                    <li><strong>Ciclo menstrual:</strong> Después de tu primera menstruación, es posible que tus periodos no sean regulares al principio. Esto es completamente normal. Puede tomar un par de años para que tu ciclo se establezca.</li>
                    <li><strong>Duración y flujo:</strong> La cantidad de sangrado y la duración de tu periodo pueden variar. Algunas chicas tienen periodos cortos y ligeros, mientras que otras tienen periodos más largos y abundantes.</li>
                    <li><strong>Síntomas:</strong> Algunas chicas experimentan síntomas como cólicos, cambios de humor o sensibilidad en los senos antes o durante su periodo.</li>
                </ul>
    
                <h2>¿Es normal?</h2>
                <p>¡Sí! La menarquia regular es una parte natural del crecimiento. Cada niña es diferente, y el momento en que ocurre la menarquia puede variar.</p>
            `,
            consejos: `
                <h2>Consejos para ti</h2>
                <ul>
                    <li><strong>Lleva un registro de tu ciclo:</strong> Usa un calendario o una aplicación para hacer un seguimiento de tus periodos. Esto te ayudará a entender tu ciclo y a anticipar tus periodos.</li>
                    <li><strong>Prepara un botiquín:</strong> Ten a mano productos de higiene femenina, analgésicos y ropa interior extra para estar preparada cuando te llegue el periodo.</li>
                    <li><strong>Maneja los síntomas:</strong> Si tienes cólicos, prueba con una almohadilla térmica, ejercicio suave o medicamentos de venta libre.</li>
                    <li><strong>Mantén una buena higiene:</strong> Cambia tus productos de higiene femenina con frecuencia y lávate las manos para prevenir infecciones.</li>
                    <li><strong>Habla con alguien de confianza:</strong> Si tienes preguntas o inquietudes, habla con un adulto de confianza o con tu médico.</li>
                </ul>
            `
        },
        tardia: {
            info: `
                <h2>¿Qué es la menarquia tardía?</h2>
                <p>La menarquia tardía se refiere a la primera menstruación que ocurre después de los 15 años. Aunque es menos común, no siempre es motivo de preocupación.</p>
    
                <h2>¿Por qué ocurre la menarquia tardía?</h2>
                <ul>
                    <li><strong>Factores genéticos:</strong> Al igual que con la menarquia temprana, la genética puede influir.</li>
                    <li><strong>Peso corporal:</strong> Un peso corporal muy bajo puede retrasar la menarquia.</li>
                    <li><strong>Ejercicio excesivo:</strong> El ejercicio intenso puede afectar las hormonas y retrasar la pubertad.</li>
                    <li><strong>Condiciones médicas:</strong> En algunos casos, puede ser causada por problemas hormonales o genéticos.</li>
                </ul>
    
                <h2>¿Qué debo hacer si tengo menarquia tardía?</h2>
                <p>Si tienes 15 años o más y aún no has tenido tu primer periodo, es importante hablar con un adulto de confianza y consultar a un médico. Ellos pueden ayudarte a entender por qué está sucediendo y asegurarse de que todo esté bien.</p>
    
                <h2>¿Es malo tener menarquia tardía?</h2>
                <p>En la mayoría de los casos, no es algo malo, pero es importante descartar cualquier problema de salud subyacente.</p>
    
                <h2>¿Qué puedo esperar?</h2>
                <p>Tu cuerpo se desarrollará a su propio ritmo. No te compares con otras chicas y recuerda que hay muchas personas que te apoyan.</p>
            `,
            consejos: `
                <h2>Consejos para ti</h2>
                <ul>
                    <li><strong>Habla con un adulto de confianza:</strong> Comparte tus inquietudes con tus padres, un familiar o un maestro. Ellos pueden brindarte apoyo y ayudarte a buscar respuestas.</li>
                    <li><strong>Consulta a un médico:</strong> Es importante que un médico te revise para descartar cualquier problema de salud y responder a tus preguntas.</li>
                    <li><strong>Mantén un estilo de vida saludable:</strong> Una dieta equilibrada y ejercicio moderado pueden ayudar a regular tus hormonas.</li>
                    <li><strong>No te compares con otras chicas:</strong> Cada cuerpo es diferente y se desarrolla a su propio ritmo. No te preocupes si tus amigas ya tienen su periodo.</li>
                    <li><strong>Aprende sobre tu cuerpo:</strong> Investiga sobre la pubertad y la menstruación. Hay muchos recursos disponibles para ayudarte a entender los cambios que estás experimentando.</li>
                    <li><strong>Prepara un botiquín:</strong> Ten a mano productos de higiene femenina, analgésicos y ropa interior extra para estar preparada cuando te llegue el periodo.</li>
                </ul>
            `
        },
        sin_menarquia: {
            info: `
                <h2>¿Qué significa no tener la menarquia?</h2>
                <p>Si tienes 15 años o más y aún no has tenido tu primer periodo, se considera que no has tenido la menarquia. Esto puede ser normal en algunos casos, pero es importante investigarlo.</p>
    
                <h2>¿Por qué ocurre?</h2>
                <ul>
                    <li><strong>Retraso puberal constitucional:</strong> Es una variación normal en el desarrollo puberal.</li>
                    <li><strong>Problemas hormonales:</strong> Desequilibrios hormonales pueden afectar el inicio de la menstruación.</li>
                    <li><strong>Problemas genéticos:</strong> Algunas condiciones genéticas pueden retrasar la pubertad.</li>
                    <li><strong>Problemas con el útero o los ovarios:</strong> En casos raros, puede haber problemas con estos órganos.</li>
                    </ul>

                <h2>¿Qué debo hacer?</h2>
                <p>Es importante hablar con un adulto de confianza y consultar a un médico. Ellos pueden realizar exámenes para determinar la causa y brindarte el tratamiento adecuado.</p>

                <h2>¿Qué puedo esperar?</h2>
                <p>Con el tratamiento adecuado, la mayoría de las chicas con ausencia de menarquia pueden tener una vida normal y saludable. Es importante ser paciente y seguir las recomendaciones del médico.</p>
            `,
        consejos: `
            <h2>Consejos para ti</h2>
            <ul>
                <li><strong>Habla con un adulto de confianza:</strong> Comparte tus inquietudes con tus padres, un familiar o un maestro. Ellos pueden brindarte apoyo y ayudarte a buscar respuestas.</li>
                <li><strong>Consulta a un médico:</strong> Es importante que un médico te revise para descartar cualquier problema de salud y responder a tus preguntas.</li>
                <li><strong>No te compares con otras chicas:</strong> Cada cuerpo es diferente y se desarrolla a su propio ritmo. No te preocupes si tus amigas ya tienen su periodo.</li>
                <li><strong>Mantén un estilo de vida saludable:</strong> Una dieta equilibrada y ejercicio moderado pueden ayudar a regular tus hormonas.</li>
                <li><strong>Aprende sobre tu cuerpo:</strong> Investiga sobre la pubertad y la menstruación. Hay muchos recursos disponibles para ayudarte a entender los cambios que estás experimentando.</li>
                <li><strong>Sé paciente:</strong> El cuerpo de cada persona tiene su propio ritmo de desarrollo. Confía en que tu cuerpo se desarrollará a su tiempo.</li>
                <li><strong>Prepara un botiquín:</strong> Ten a mano productos de higiene femenina, analgésicos y ropa interior extra para estar preparada cuando te llegue el periodo.</li>
            </ul>
        `
    }
};

    // Inicializar el calendario antes de agregar eventos
    var calendarEl = document.getElementById('calendar');
    if (calendarEl) {
        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'es',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            eventClick: function(info) {
                const fecha = info.event.start.toISOString().split('T')[0]; // Obtener la fecha del evento

                console.log("Evento clickeado:", fecha); // Verifica si se detecta el clic en consola

                // Llamar al backend para obtener los datos del reporte
                fetch(`/obtener-registro/${fecha}`)
                    .then(response => response.json())
                    .then(registro => {
                        console.log("Datos del reporte recibidos:", registro); // Verifica que se reciban datos

                        if (!registro || Object.keys(registro).length === 0) {
                            abrirModal("<p>No hay datos registrados para esta fecha.</p>");
                            return;
                        }

                        const flujoTexto = registro.sangrado === "si" ? `Flujo: ${registro.intensidad}` : "Flujo: No hubo sangrado";
                        const sintomasTexto = registro.sintomas.length > 0 ? `Sensaciones físicas: ${registro.sintomas.join(', ')}` : "Sensaciones físicas: Ninguna";

                        const modalContent = `
                            <h2>Reporte del Día</h2>
                            <p><strong>Fecha:</strong> ${fecha}</p>
                            <p>${flujoTexto}</p>
                            <p>${sintomasTexto}</p>
                        `;

                        abrirModal(modalContent);
                    })
                    .catch(error => console.error("Error al obtener el registro:", error));
            }
        });

        calendar.render();
        obtenerEventosDelUsuario(localStorage.getItem("userId")); // Cargar eventos después de renderizar el calendario
    } else {
        console.warn("No se encontró el elemento 'calendar' en el DOM.");
    }


    // Manejar el envío del formulario
    const formularioDiario = document.getElementById("formularioDiario");
    if (formularioDiario) {
    formularioDiario.addEventListener("submit", function (e) {
        e.preventDefault();

        const hoy = new Date();
        const fechaHoy = hoy.toLocaleDateString('en-CA'); // Formato compatible con MySQL: YYYY-MM-DD

        const registro = {
            fecha: fechaHoy, // Cambia a fechaHoy para obtener la fecha local
            sangrado: document.querySelector("input[name='sangrado']:checked")?.value || "no",
            intensidad: document.querySelector("input[name='intensidad']:checked")?.value || null,
            sintomas: Array.from(document.querySelectorAll("input[name='sintomas']:checked")).map(input => input.value),
            emocion: document.querySelector("input[name='emocion']:checked")?.value || "sin seleccionar"
        };

        guardarRegistro(registro); // Llama a tu función guardarRegistro con el registro actualizado
    });
    } else {
    console.warn("No se encontró el formulario 'formularioDiario' en el DOM.");
    }

    function guardarRegistro(registro) {
        const usuarioId = localStorage.getItem("userId");
        console.log("Valor de sangrado:", registro.sangrado); // Agrega este log
        const data = {
            usuario: usuarioId,
            fecha: registro.fecha,
            flujo: registro.sangrado === "si" ? 1 : 0,
            nivel_flujo: registro.sangrado === "si" ? registro.intensidad : null,
            opciones: []
        };
    
        const sintomasIds = Array.from(document.querySelectorAll("input[name='sintomas']:checked"))
            .map(input => {
                const opcionesMap = {
                    "dolor": 1,
                    "dolorCabeza": 2,
                    "fatiga": 3,
                    "otros": 4
                };
                return opcionesMap[input.value];
            });
    
        const emocionesIds = Array.from(document.querySelectorAll("input[name='emocion']:checked"))
            .map(input => {
                const emocionesMap = {
                    "feliz": 5,
                    "tranquila": 6,
                    "irritable": 7,
                    "triste": 8
                };
                return emocionesMap[input.value];
            });
    
        // Combina síntomas y emociones en un solo array
        data.opciones = [...sintomasIds, ...emocionesIds];
    
        fetch("/registrar-reporte", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.message) {
                console.log("Registro guardado exitosamente");
                obtenerEventosDelUsuario(usuarioId); // Actualiza el calendario
            } else {
                console.error("Error al guardar el registro:", result.message);
            }
        })
        .catch(error => console.error("Error en la solicitud:", error));
    }
    
    function actualizarCalendario(eventos) {
        if (!calendar) return; // Asegúrate de que el calendario esté inicializado
    
        calendar.removeAllEvents(); // Limpia eventos previos del calendario
    
        // Verificar si eventos es un array y no está vacío
        if (Array.isArray(eventos) && eventos.length > 0) {
            eventos.forEach(evento => {
                const color = evento.sangrado === "si" ? '#FF6347' : '#87CEFA'; // Rojo si hubo flujo, azul si no
    
                calendar.addEvent({
                    title: 'Registro', // Asegúrate de que el título esté vacío
                    start: evento.fecha,
                    color: color // Estilo depende del valor del flujo
                });
            });
        } else {
            console.warn("No se encontraron eventos para mostrar.");
        }
    }
    
    // Personalizar la forma en que se renderizan los eventos
    calendar.on('eventDidMount', function(info) {
        const eventElement = info.el;
        eventElement.innerHTML = `<span class="emoji-event">${info.event.title}</span>`; // Solo el emoji
        eventElement.style.display = 'flex'; // Usar flexbox para centrar
        eventElement.style.justifyContent = 'center'; // Centrar horizontalmente
        eventElement.style.alignItems = 'center'; // Centrar verticalmente
    });
    
    // Manejo del clic en el evento para abrir el modal
    calendar.on('eventClick', function(info) {
        const userId = localStorage.getItem("userId"); // Obtener el ID del usuario
        const fecha = info.event.start.toISOString().split('T')[0]; // Obtener la fecha del evento

        // Llamar al backend para obtener los datos del reporte
        fetch(`/obtener-registro/${userId}/${fecha}`)
            .then(response => {
                if (!response.ok) throw new Error("Error al obtener el registro");
                return response.json();
            })
            .then(registro => {
                const flujoTexto = registro.sangrado === "si" ? `Flujo: ${registro.intensidad}` : "Flujo: No hubo sangrado";
                const sintomasTexto = registro.sintomas.length > 0 ? `Sensaciones físicas: ${registro.sintomas.join(', ')}` : "Sensaciones físicas: Ninguna";

                const modalContent = `
                    <h2>Reporte del Día</h2>
                    <p><strong>Fecha:</strong> ${fecha}</p>
                    <p>${flujoTexto}</p>
                    <p>${sintomasTexto}</p>
                `;

                abrirModal(modalContent); // Abre el modal con el contenido
            })
            .catch(error => console.error("Error al obtener el registro:", error));
    });
    
    // Función para abrir el modal
    function abrirModal(contenido) {
        const modal = document.getElementById('miModal');
        if (!modal) {
            console.error("No se encontró el modal en el DOM.");
            return;
        }

        modal.querySelector('.modal-body').innerHTML = contenido;
        modal.style.display = 'block'; // Muestra el modal
    }

    
    // Cerrar el modal al hacer clic fuera de él
    window.onclick = function(event) {
        const modal = document.getElementById('miModal');
        if (event.target === modal) {
            modal.style.display = 'none'; // Cierra el modal
        }
    };

    // Cerrar el modal al hacer clic en la "X"
    document.addEventListener("DOMContentLoaded", function() {
        const closeModalButton = document.querySelector('.close');
        if (closeModalButton) {
            closeModalButton.addEventListener('click', function() {
                const modal = document.getElementById('miModal');
                modal.style.display = 'none'; // Cierra el modal
            });
        } else {
            console.warn("No se encontró el botón de cierre del modal.");
        }
    });


    // Llamar a la API para obtener los eventos del usuario
    function obtenerEventosDelUsuario(userId) {
        fetch(`/obtener-eventos`)
            .then(response => response.json())
            .then(data => {
                console.log("Eventos recibidos:", data); // Agrega este log
                actualizarCalendario(data.data); // Pasa los datos a actualizarCalendario
            })
            .catch(error => console.error("Error al obtener eventos:", error));
    }

    // Modificar la función de inicialización del calendario
    if (calendarEl) {
        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'es',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }
        });

        calendar.render();

        // Obtener el ID del usuario desde localStorage
        const userId = localStorage.getItem("userId");
        if (userId) {
            obtenerEventosDelUsuario(userId); // Llamar a la función para obtener eventos
        }
    } else {
        console.warn("No se encontró el elemento 'calendar' en el DOM.");
    }

    // Manejo de las cards desplegables
    const collapsibles = document.querySelectorAll(".collapsible");
    console.log("Elementos .collapsible encontrados:", collapsibles.length);

    collapsibles.forEach(button => {
        console.log("Evento añadido a:", button.textContent.trim());
        button.addEventListener("click", function () {
            console.log("Click")
            this.classList.toggle("active");
            const content = this.nextElementSibling;
            console.log("Contenido:", content);
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
});

function cerrar_sesion(){
    window.location.href = "./cerrar-sesion";
}