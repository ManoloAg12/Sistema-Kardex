// ==========================================
// LÓGICA DE LA PESTAÑA: CONTROL DE INVENTARIO Y MODAL KARDEX
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('contenedor-inventario');

    // Función para calcular los saldos actuales de un repuesto según su historial
    function calcularSaldos(movimientos) {
        let saldoCant = 0;
        let saldoTotal = 0;
        let saldoVU = 0;

        movimientos.forEach(mov => {
            if (mov.tipo === "entrada") {
                saldoCant += mov.cant;
                saldoTotal += (mov.cant * mov.vu);
                saldoVU = saldoTotal / saldoCant;
            } else {
                saldoCant -= mov.cant;
                saldoTotal -= (mov.cant * saldoVU);
            }
        });

        return { cant: saldoCant, vu: saldoVU, total: saldoTotal };
    }

    function renderInventario() {
        const inventario = StorageManager.getInventario();
        const kardexData = StorageManager.getKardex();

        // 1. Formulario Superior y Tabla Principal
        let html = `
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold text-slate-800 uppercase tracking-wide">Control de Inventario</h2>
                <button onclick="StorageManager.resetData()" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded transition-colors border border-slate-300">
                    <i class="fas fa-sync-alt"></i> Reset
                </button>
            </div>

            <div class="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-8 shadow-sm">
                <form id="form-movimiento" class="grid grid-cols-1 md:grid-cols-7 gap-3 items-end">
                    <div class="md:col-span-2">
                        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Repuesto</label>
                        <select id="mov-repuesto" class="w-full p-2 text-sm border border-slate-300 rounded focus:border-blue-500 outline-none font-semibold text-slate-700">
                            ${inventario.map(item => `<option value="${item.id}">${item.id} - ${item.desc}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fecha</label>
                        <input type="date" id="mov-fecha" required class="w-full p-2 text-sm border border-slate-300 rounded focus:border-blue-500 outline-none">
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Detalle / Cliente</label>
                        <input type="text" id="mov-detalle" placeholder="Ej: Consumo SRV-003" required class="w-full p-2 text-sm border border-slate-300 rounded focus:border-blue-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Movimiento</label>
                        <select id="mov-tipo" class="w-full p-2 text-sm border border-slate-300 rounded focus:border-blue-500 outline-none text-slate-700 font-bold bg-white">
                            <option value="entrada">Entrada (+)</option>
                            <option value="salida">Salida (-)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cant / <span id="label-vu">Costo</span></label>
                        <div class="flex gap-1">
                            <input type="number" id="mov-cant" min="1" placeholder="N°" required class="w-1/2 p-2 text-sm border border-slate-300 rounded focus:border-blue-500 outline-none text-center">
                            <input type="number" id="mov-vu" step="0.01" min="0" placeholder="$" required class="w-1/2 p-2 text-sm border border-slate-300 rounded focus:border-blue-500 outline-none text-center">
                        </div>
                    </div>
                    <div class="md:col-span-7 flex justify-end mt-2">
                        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded text-xs transition-colors shadow-md uppercase tracking-widest">
                            <i class="fas fa-save mr-2"></i> Registrar Movimiento
                        </button>
                    </div>
                </form>
            </div>

            <div class="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-900 text-white text-[10px] uppercase tracking-wider text-center">
                            <th class="p-3 font-semibold border-r border-slate-700">Código</th>
                            <th class="p-3 font-semibold border-r border-slate-700 text-left">Descripción</th>
                            <th class="p-3 font-semibold border-r border-slate-700 text-blue-300">Costo U.</th>
                            <th class="p-3 font-semibold border-r border-slate-700 text-emerald-300">Existencia</th>
                            <th class="p-3 font-semibold border-r border-slate-700 text-purple-300">Margen Seg.</th>
                            <th class="p-3 font-semibold border-r border-slate-700 text-yellow-300">Punto de Reorden</th>
                            <th class="p-3 font-semibold border-r border-slate-700">Valor Total</th>
                            <th class="p-3 font-semibold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
        `;

        // 2. Procesamos cada fila de la tabla maestra
        inventario.forEach(item => {
            const movimientos = kardexData[item.id] || [];
            const saldos = calcularSaldos(movimientos);
            // FÓRMULA ROP: (Demanda Diaria * Lead Time) + Margen de Seguridad
            const rop = (item.demandaDiaria * item.leadTime) + item.safetyStock;
            
            // Alerta visual si la existencia cae por debajo del ROP
            const alertaExistencia = saldos.cant <= rop ? "text-red-600 font-extrabold bg-red-50 px-2 py-1 rounded" : "font-bold text-slate-700";

            html += `
                <tr class="hover:bg-slate-50 transition-colors group text-sm text-center">
                    <td class="p-3 font-mono font-semibold text-slate-600 border-r border-slate-100">${item.id}</td>
                    <td class="p-3 text-left font-medium text-slate-800 border-r border-slate-100">${item.desc}</td>
                    <td class="p-3 text-slate-600 border-r border-slate-100">$${saldos.vu.toFixed(2)}</td>
                    <td class="p-3 border-r border-slate-100"><span class="${alertaExistencia}">${saldos.cant}</span></td>
                    <td class="p-3 font-semibold text-purple-600 bg-purple-50/30 border-r border-slate-100">${item.safetyStock}</td>
                    <td class="p-3 text-slate-600 border-r border-slate-100">${rop}</td>
                    <td class="p-3 font-bold text-blue-800 border-r border-slate-100">$${saldos.total.toFixed(2)}</td>
                    <td class="p-2">
                        <button onclick="abrirModalKardex('${item.id}', '${item.desc}')" class="bg-slate-800 hover:bg-slate-700 text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded shadow-sm transition-colors">
                            <i class="fas fa-list mr-1"></i> Ver Registro
                        </button>
                    </td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>

            <div id="modal-kardex" class="fixed inset-0 z-[110] hidden bg-slate-900/80 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300 opacity-0">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col transform scale-95 transition-transform duration-300" id="modal-box">
                    <div class="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                        <div>
                            <h3 class="font-bold text-lg text-slate-800">Registro de Consumo</h3>
                            <p class="text-sm font-mono text-blue-600 font-bold" id="modal-item-name"></p>
                        </div>
                        <button id="btn-close-modal" class="text-slate-400 hover:text-red-500 text-3xl leading-none transition-colors">&times;</button>
                    </div>
                    <div class="p-4 overflow-auto flex-grow bg-slate-50">
                        <div class="overflow-x-auto rounded-lg border border-slate-200 shadow-sm bg-white">
                            <table class="w-full text-right border-collapse text-[12px]">
                                <thead>
                                    <tr class="bg-slate-800 text-white uppercase tracking-wider text-[10px] text-center">
                                        <th rowspan="2" class="p-2 border border-slate-600 text-left">Fecha</th>
                                        <th rowspan="2" class="p-2 border border-slate-600 text-left">Detalle</th>
                                        <th colspan="3" class="p-2 border border-slate-600 text-emerald-300 bg-emerald-900/40">Entradas</th>
                                        <th colspan="3" class="p-2 border border-slate-600 text-red-300 bg-red-900/40">Salidas</th>
                                        <th colspan="3" class="p-2 border border-slate-600 text-blue-300 bg-blue-900/40">Existencias</th>
                                    </tr>
                                    <tr class="bg-slate-700 text-slate-200 text-[9px] uppercase text-center">
                                        <th class="p-1 border border-slate-600">Cant</th><th class="p-1 border border-slate-600">Costo U</th><th class="p-1 border border-slate-600">Total</th>
                                        <th class="p-1 border border-slate-600">Cant</th><th class="p-1 border border-slate-600">Costo U</th><th class="p-1 border border-slate-600">Total</th>
                                        <th class="p-1 border border-slate-600">Cant</th><th class="p-1 border border-slate-600">Costo U</th><th class="p-1 border border-slate-600">Total</th>
                                    </tr>
                                </thead>
                                <tbody id="modal-kardex-body" class="divide-y divide-slate-200">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;

        contenedor.innerHTML = html;

        // 3. Lógica Interactiva del Formulario
        const inputTipo = document.getElementById('mov-tipo');
        const inputVU = document.getElementById('mov-vu');
        const labelVU = document.getElementById('label-vu');

        // Si es salida, el sistema calcula el precio solo
        inputTipo.addEventListener('change', (e) => {
            if (e.target.value === 'salida') {
                inputVU.disabled = true;
                inputVU.value = '';
                inputVU.classList.add('bg-slate-200', 'cursor-not-allowed', 'opacity-50');
                labelVU.innerText = 'Costo (Automático)';
            } else {
                inputVU.disabled = false;
                inputVU.classList.remove('bg-slate-200', 'cursor-not-allowed', 'opacity-50');
                labelVU.innerText = 'Costo U.';
            }
        });

        // Guardar movimiento
        document.getElementById('form-movimiento').addEventListener('submit', function(e) {
            e.preventDefault();
            const itemId = document.getElementById('mov-repuesto').value;
            const tipoMov = document.getElementById('mov-tipo').value;
            
            // Calculamos el costo actual por si es una salida
            const saldosActuales = calcularSaldos(kardexData[itemId] || []);

            const nMov = {
                fecha: document.getElementById('mov-fecha').value,
                detalle: document.getElementById('mov-detalle').value,
                tipo: tipoMov,
                cant: parseFloat(document.getElementById('mov-cant').value),
                vu: tipoMov === 'salida' ? saldosActuales.vu : parseFloat(inputVU.value)
            };

            if (!kardexData[itemId]) kardexData[itemId] = [];
            kardexData[itemId].push(nMov);
            
            StorageManager.saveKardex(kardexData);
            renderInventario(); // Recarga la tabla maestra
        });

        // Evento para cerrar el modal
        document.getElementById('btn-close-modal').addEventListener('click', cerrarModal);
    }

    // ==========================================
    // 4. FUNCIONES GLOBALES PARA EL MODAL
    // ==========================================
    window.abrirModalKardex = function(itemId, desc) {
        const kardexData = StorageManager.getKardex();
        const movimientos = kardexData[itemId] || [];
        const tbody = document.getElementById('modal-kardex-body');
        
        document.getElementById('modal-item-name').innerText = `${itemId} - ${desc}`;
        
        let htmlFilas = "";
        let saldoCant = 0, saldoTotal = 0, saldoVU = 0;

        if(movimientos.length === 0) {
            htmlFilas = `<tr><td colspan="11" class="p-8 text-center text-slate-400 italic">No hay historial de movimientos registrados.</td></tr>`;
        } else {
            movimientos.forEach(mov => {
                let eC = "-", eU = "-", eT = "-";
                let sC = "-", sU = "-", sT = "-";

                if (mov.tipo === "entrada") {
                    let vt = mov.cant * mov.vu;
                    eC = mov.cant; eU = `$${mov.vu.toFixed(2)}`; eT = `$${vt.toFixed(2)}`;
                    saldoCant += mov.cant; saldoTotal += vt;
                    saldoVU = saldoTotal / saldoCant;
                } else {
                    let vt = mov.cant * saldoVU;
                    sC = mov.cant; sU = `$${saldoVU.toFixed(2)}`; sT = `$${vt.toFixed(2)}`;
                    saldoCant -= mov.cant; saldoTotal -= vt;
                }

                htmlFilas += `
                    <tr class="hover:bg-slate-50 text-center">
                        <td class="p-2 border border-slate-200 text-left font-mono text-slate-500">${mov.fecha}</td>
                        <td class="p-2 border border-slate-200 text-left font-semibold text-slate-700">${mov.detalle}</td>
                        <td class="p-2 border border-slate-200 text-emerald-600 bg-emerald-50/20">${eC}</td>
                        <td class="p-2 border border-slate-200 text-emerald-600 bg-emerald-50/20">${eU}</td>
                        <td class="p-2 border border-slate-200 font-bold text-emerald-700 bg-emerald-50/20">${eT}</td>
                        <td class="p-2 border border-slate-200 text-red-600 bg-red-50/20">${sC}</td>
                        <td class="p-2 border border-slate-200 text-red-600 bg-red-50/20">${sU}</td>
                        <td class="p-2 border border-slate-200 font-bold text-red-700 bg-red-50/20">${sT}</td>
                        <td class="p-2 border border-slate-200 font-bold text-blue-600 bg-blue-50/20">${saldoCant}</td>
                        <td class="p-2 border border-slate-200 text-blue-600 bg-blue-50/20">$${saldoVU.toFixed(2)}</td>
                        <td class="p-2 border border-slate-200 font-black text-blue-800 bg-blue-50/20">$${saldoTotal.toFixed(2)}</td>
                    </tr>
                `;
            });
        }

        tbody.innerHTML = htmlFilas;

        // Animar entrada del modal
        const modal = document.getElementById('modal-kardex');
        const box = document.getElementById('modal-box');
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            box.classList.remove('scale-95');
        }, 10);
    };

    function cerrarModal() {
        const modal = document.getElementById('modal-kardex');
        const box = document.getElementById('modal-box');
        modal.classList.add('opacity-0');
        box.classList.add('scale-95');
        setTimeout(() => { modal.classList.add('hidden'); }, 300);
    }

    // Arrancar la tabla al cargar la página
    renderInventario();
});