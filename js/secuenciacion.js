// ==========================================
// LÓGICA DE LA PESTAÑA: SECUENCIACIÓN (RC)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    const contenedor = document.getElementById('contenedor-secuenciacion');

    // Función para calcular y renderizar la tabla de Razón Crítica
    function renderSecuenciacion() {
        const servidores = StorageManager.getServidores();

        // 1. Procesar los cálculos matemáticos para cada servidor
        let procesados = servidores.map(srv => {
            let diasRestantes = srv.fechaPrometida - srv.fechaActual;
            let rc = diasRestantes / srv.tiempoProcesamiento;
            rc = Math.round(rc * 100) / 100;

            let estado = ""; let colorClass = ""; let icon = "";

            if (rc < 1.0) {
                estado = "Atrasado (Crítico)";
                colorClass = "bg-red-100 text-red-700 border-red-200";
                icon = "fa-exclamation-triangle";
            } else if (rc === 1.0) {
                estado = "A Tiempo (Precaución)";
                colorClass = "bg-yellow-100 text-yellow-700 border-yellow-200";
                icon = "fa-exclamation-circle";
            } else {
                estado = "Con Holgura (Seguro)";
                colorClass = "bg-emerald-100 text-emerald-700 border-emerald-200";
                icon = "fa-check-circle";
            }

            return { ...srv, diasRestantes, rc, estado, colorClass, icon };
        });

        // 2. Ordenar de menor RC a mayor RC
        procesados.sort((a, b) => a.rc - b.rc);

        // 3. Calcular el próximo ID automáticamente (Inicia en SRV-001 si está vacío)
        let maxIdNum = 0;
        if (servidores.length > 0) {
            servidores.forEach(s => {
                let num = parseInt(s.id.replace('SRV-', ''));
                if(num > maxIdNum) maxIdNum = num;
            });
        }
        let nextIdVisual = "SRV-" + (maxIdNum + 1).toString().padStart(3, '0');

        // 4. Construir la interfaz de usuario
        let html = `
            <div class="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 shadow-sm">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-sm font-bold uppercase tracking-widest text-slate-600 flex items-center">
                        <i class="fas fa-magic text-blue-500 mr-2"></i> Simular Requerimiento Rápido
                    </h3>
                    <div class="flex space-x-2">
                        <span class="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest flex items-center">
                            Próximo ID: ${nextIdVisual}
                        </span>
                        <button onclick="StorageManager.resetData()" class="bg-slate-200 hover:bg-slate-300 text-slate-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest transition-colors" title="Limpiar Cola">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
                
                <form id="form-nuevo-servidor" class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label class="block text-xs text-slate-500 font-bold mb-1">Días Procesamiento</label>
                        <input type="number" id="in-tiempo" min="1" placeholder="Ej: 3" required class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                    </div>
                    <div>
                        <label class="block text-xs text-slate-500 font-bold mb-1">Día Prometido</label>
                        <input type="number" id="in-promesa" min="1" max="31" placeholder="Ej: 30" required class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                    </div>
                    <div>
                        <label class="block text-xs text-slate-500 font-bold mb-1">Día Actual</label>
                        <input type="number" id="in-actual" min="1" max="31" value="26" required class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-slate-100">
                    </div>
                    <div>
                        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm shadow-md uppercase tracking-widest">
                            <i class="fas fa-play mr-1"></i> Calcular RC
                        </button>
                    </div>
                </form>
            </div>

            <div class="flex justify-between items-center mb-4 px-2">
                <h2 class="text-xl font-bold text-slate-800">Cola de Trabajo Priorizada</h2>
                <span class="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-[10px] uppercase font-bold border border-slate-300">
                    Ordenado Automáticamente
                </span>
            </div>

            <div class="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-900 text-white text-[11px] uppercase tracking-wider">
                            <th class="p-4 font-semibold rounded-tl-lg">Prioridad</th>
                            <th class="p-4 font-semibold">Servidor ID</th>
                            <th class="p-4 font-semibold text-center">T. Procesamiento</th>
                            <th class="p-4 font-semibold text-center">Días Restantes</th>
                            <th class="p-4 font-semibold text-center text-blue-300">Razón Crítica (RC)</th>
                            <th class="p-4 font-semibold rounded-tr-lg">Estado Operativo</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
        `;

        // 5. Dibujar cada fila o mostrar mensaje de vacío
        if (procesados.length === 0) {
            html += `
                <tr>
                    <td colspan="6" class="p-10 text-center text-slate-400">
                        <i class="fas fa-inbox text-4xl mb-3 opacity-50"></i>
                        <p class="italic">La cola de trabajo está vacía.</p>
                        <p class="text-xs mt-1">Ingrese los datos del primer servidor arriba para iniciar la secuenciación.</p>
                    </td>
                </tr>
            `;
        } else {
            procesados.forEach((item, index) => {
                let isFirst = index === 0;
                let filaEstilo = isFirst ? "bg-red-50 hover:bg-red-100 border-l-4 border-red-500" : "hover:bg-slate-50 border-l-4 border-transparent";
                let numeroEstilo = isFirst ? "bg-red-500 text-white shadow-md" : "bg-slate-200 text-slate-600";

                html += `
                    <tr class="transition-colors group ${filaEstilo}">
                        <td class="p-4 text-center w-16">
                            <span class="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${numeroEstilo}">
                                ${index + 1}
                            </span>
                        </td>
                        <td class="p-4 font-mono text-sm font-bold text-slate-700">${item.id}</td>
                        <td class="p-4 text-sm text-center text-slate-600">${item.tiempoProcesamiento} días</td>
                        <td class="p-4 text-sm text-center text-slate-600">${item.diasRestantes} días</td>
                        <td class="p-4 text-center">
                            <span class="font-mono text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                                ${item.rc.toFixed(2)}
                            </span>
                        </td>
                        <td class="p-4">
                            <span class="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold border ${item.colorClass} shadow-sm">
                                <i class="fas ${item.icon} mr-1.5"></i> ${item.estado}
                            </span>
                        </td>
                    </tr>
                `;
            });
        }

        html += `
                    </tbody>
                </table>
            </div>
        `;

        contenedor.innerHTML = html;

        // 6. Asignar el evento al formulario
        document.getElementById('form-nuevo-servidor').addEventListener('submit', function(e) {
            e.preventDefault(); 

            let maxId = 0;
            if (servidores.length > 0) {
                servidores.forEach(s => {
                    let num = parseInt(s.id.replace('SRV-', ''));
                    if(num > maxId) maxId = num;
                });
            }
            let nextId = maxId + 1;
            let nuevoIdAutomático = "SRV-" + nextId.toString().padStart(3, '0'); 

            const nuevoTiempo = parseInt(document.getElementById('in-tiempo').value);
            const nuevaPromesa = parseInt(document.getElementById('in-promesa').value);
            const nuevoActual = parseInt(document.getElementById('in-actual').value);

            const nuevoServidor = {
                id: nuevoIdAutomático,
                tiempoProcesamiento: nuevoTiempo,
                fechaPrometida: nuevaPromesa,
                fechaActual: nuevoActual
            };

            servidores.push(nuevoServidor);
            StorageManager.saveServidores(servidores);
            
            // Limpiar formulario para ingresar el siguiente rápido
            document.getElementById('in-tiempo').value = '';
            document.getElementById('in-promesa').value = '';
            
            renderSecuenciacion();
        });
    }

    renderSecuenciacion();
});