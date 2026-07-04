/* ==========================================================================
   GEMSA - TECHNICAL REPORT GENERATOR JS LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements Selectors
    const inputCliente = document.getElementById('input-cliente');
    const inputCodigo = document.getElementById('input-codigo');
    const inputNombre = document.getElementById('input-nombre');
    const inputFecha = document.getElementById('input-fecha');
    const inputDescripcion = document.getElementById('input-descripcion');
    
    const btnGenCode = document.getElementById('btn-gen-code');
    const btnAddPhoto = document.getElementById('btn-add-photo');
    const btnAddConclusion = document.getElementById('btn-add-conclusion');
    const btnAddRecomendation = document.getElementById('btn-add-recomendation');
    
    const photosContainer = document.getElementById('photos-container');
    const conclusionsContainer = document.getElementById('conclusions-container');
    const recomendationsContainer = document.getElementById('recomendations-container');
    
    const outputText = document.getElementById('output-text');
    const btnCopy = document.getElementById('btn-copy');
    const copyTextSpan = document.getElementById('copy-text');
    const btnDownloadTxt = document.getElementById('btn-download-txt');
    const btnPrint = document.getElementById('btn-print');
    const btnClear = document.getElementById('btn-clear');

    // Tab Switches Selectors
    const tabText = document.getElementById('tab-text');
    const tabDoc = document.getElementById('tab-doc');
    const textContainer = document.getElementById('text-preview-container');
    const docContainer = document.getElementById('doc-preview-container');

    // A4 Sheet DOM Elements
    const sheetCliente = document.getElementById('sheet-cliente');
    const sheetCodigo = document.getElementById('sheet-codigo');
    const sheetNombre = document.getElementById('sheet-nombre');
    const sheetFecha = document.getElementById('sheet-fecha');
    const sheetDescripcion = document.getElementById('sheet-descripcion');
    const sheetPhotos = document.getElementById('sheet-photos');
    const sheetConclusions = document.getElementById('sheet-conclusions');
    const sheetRecomendations = document.getElementById('sheet-recomendations');

    // App State
    let state = {
        cliente: '',
        codigo: '',
        nombre: '',
        fecha: '',
        descripcion: '',
        photos: [],
        conclusions: [],
        recomendations: []
    };

    // Helper: Generate Random Code
    function generateRandomCode() {
        const rand = Math.floor(1000 + Math.random() * 9000);
        return `IT-2026-${rand}`;
    }

    // Helper: Get Current Date/Time in local format DD/MM/AAAA - HH:MM
    function getCurrentFormattedDateTime() {
        const now = new Date();
        const dd = String(now.getDate()).padStart(2, '0');
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const yyyy = now.getFullYear();
        const hh = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        return `${dd}/${mm}/${yyyy} - ${hh}:${min}`;
    }

    // Populate Initial Demo Data
    function loadDemoData() {
        inputCliente.value = 'Mall Aventura Santa Anita';
        inputCodigo.value = generateRandomCode();
        inputNombre.value = 'Mantenimiento correctivo de estructuras metálicas de soporte de plantas';
        
        const now = new Date();
        const dd = String(now.getDate()).padStart(2, '0');
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const yyyy = now.getFullYear();
        inputFecha.value = `${dd} de julio de ${yyyy}`;

        inputDescripcion.value = 'Se ejecutó el servicio de mantenimiento correctivo y preventivo de las estructuras metálicas de soporte de plantas ornamentales en las áreas aledañas. Al inicio de los trabajos, las estructuras presentaban desgaste superficial, picaduras por corrosión localizada y pintura descascarada debido a la humedad del riego y la intemperie. La metodología consistió en delimitación perimetral de seguridad, remoción mecánica de óxido y pintura antigua mediante lijado manual profundo y esmerilado, pasivado con base anticorrosiva industrial de zincromato Anypsa, y aplicación final de dos manos de esmalte epóxico verde de alta resistencia química Anypsa.';
        
        state.conclusions = [
            'Se restableció la integridad estructural y la protección anticorrosiva en las bases y perfiles metálicos tratados.',
            'La aplicación de esmalte epóxico garantiza una impermeabilización de alta resistencia contra los riegos continuos de jardinería.'
        ];
        state.recomendations = [
            'Realizar inspecciones trimestrales de las bases de las estructuras para evaluar posibles desprendimientos mecánicos de pintura.',
            'Evitar el uso de detergentes ácidos o limpiadores corrosivos industriales sobre las zonas pintadas.'
        ];

        // Create Demo Photos
        state.photos = [
            {
                id: Date.now() + 1,
                previewUrl: '',
                description: 'Inspección inicial y detección de picaduras severas por óxido en las bases metálicas de las columnas de soporte.',
                dateTime: getCurrentFormattedDateTime()
            },
            {
                id: Date.now() + 2,
                previewUrl: '',
                description: 'Aplicación uniforme de pintura de acabado tipo esmalte epóxico verde sobre la base anticorrosiva curada.',
                dateTime: getCurrentFormattedDateTime()
            }
        ];

        syncStateFromInputs();
        renderPhotos();
        renderConclusions();
        renderRecomendations();
        updateReportPreview();
        updateA4SheetPreview();
    }

    // Sync State From UI Inputs
    function syncStateFromInputs() {
        state.cliente = inputCliente.value.trim();
        state.codigo = inputCodigo.value.trim();
        state.nombre = inputNombre.value.trim();
        state.fecha = inputFecha.value.trim();
        state.descripcion = inputDescripcion.value.trim();
    }

    // Render Conclusions Input List
    function renderConclusions() {
        conclusionsContainer.innerHTML = '';
        state.conclusions.forEach((text, index) => {
            const li = document.createElement('li');
            li.className = 'dynamic-item';
            li.innerHTML = `
                <span class="item-number">${index + 1}.</span>
                <input type="text" value="${text}" placeholder="Conclusión..." data-index="${index}">
                <button type="button" class="btn-remove-item" data-index="${index}" title="Eliminar conclusión">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            `;

            // Input change handler
            li.querySelector('input').addEventListener('input', (e) => {
                state.conclusions[index] = e.target.value;
                updateReportPreview();
                updateA4SheetPreview();
            });

            // Remove button handler
            li.querySelector('.btn-remove-item').addEventListener('click', () => {
                state.conclusions.splice(index, 1);
                renderConclusions();
                updateReportPreview();
                updateA4SheetPreview();
            });

            conclusionsContainer.appendChild(li);
        });
    }

    // Render Recomendations Input List
    function renderRecomendations() {
        recomendationsContainer.innerHTML = '';
        state.recomendations.forEach((text, index) => {
            const li = document.createElement('li');
            li.className = 'dynamic-item';
            li.innerHTML = `
                <span class="item-number">${index + 1}.</span>
                <input type="text" value="${text}" placeholder="Recomendación..." data-index="${index}">
                <button type="button" class="btn-remove-item" data-index="${index}" title="Eliminar recomendación">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            `;

            // Input change handler
            li.querySelector('input').addEventListener('input', (e) => {
                state.recomendations[index] = e.target.value;
                updateReportPreview();
                updateA4SheetPreview();
            });

            // Remove button handler
            li.querySelector('.btn-remove-item').addEventListener('click', () => {
                state.recomendations.splice(index, 1);
                renderRecomendations();
                updateReportPreview();
                updateA4SheetPreview();
            });

            recomendationsContainer.appendChild(li);
        });
    }

    // Render Photos Input List
    function renderPhotos() {
        photosContainer.innerHTML = '';
        state.photos.forEach((photo, index) => {
            const item = document.createElement('div');
            item.className = 'photo-item';
            item.innerHTML = `
                <div class="photo-uploader" title="Subir o arrastrar imagen">
                    ${photo.previewUrl ? `<img class="photo-preview-img" src="${photo.previewUrl}">` : `
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    `}
                    <input type="file" accept="image/*">
                </div>
                <div class="photo-fields">
                    <div class="photo-header-row">
                        <span class="photo-number">Fotografía #${index + 1}</span>
                        <button type="button" class="btn-remove-photo" title="Eliminar fotografía">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                    <div class="form-group">
                        <input type="text" class="photo-desc" value="${photo.description}" placeholder="Ej. Lijado de perfiles metálicos y remoción mecánica de corrosión.">
                    </div>
                    <div class="form-grid">
                        <div class="form-group">
                            <input type="text" class="photo-datetime" value="${photo.dateTime}" placeholder="DD/MM/AAAA - HH:MM">
                        </div>
                    </div>
                </div>
            `;

            // File selection preview handler
            const fileInput = item.querySelector('input[type="file"]');
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        state.photos[index].previewUrl = event.target.result;
                        renderPhotos();
                        updateReportPreview();
                        updateA4SheetPreview();
                    };
                    reader.readAsDataURL(file);
                }
            });

            // Description input handler
            item.querySelector('.photo-desc').addEventListener('input', (e) => {
                state.photos[index].description = e.target.value;
                updateReportPreview();
                updateA4SheetPreview();
            });

            // DateTime input handler
            item.querySelector('.photo-datetime').addEventListener('input', (e) => {
                state.photos[index].dateTime = e.target.value;
                updateReportPreview();
                updateA4SheetPreview();
            });

            // Remove button handler
            item.querySelector('.btn-remove-photo').addEventListener('click', () => {
                state.photos.splice(index, 1);
                renderPhotos();
                updateReportPreview();
                updateA4SheetPreview();
            });

            photosContainer.appendChild(item);
        });
    }

    // Build Formatted Report Plain Text
    function buildReportText() {
        const clienteText = state.cliente || '[Nombre del Cliente / Empresa]';
        const codigoText = state.codigo || '[IT-2026-XXXX]';
        const nombreText = state.nombre || '[Título o Nombre del Servicio Ejecutado]';
        const fechaText = state.fecha || '[Fecha del Servicio / Reporte]';
        
        let report = `Cliente: ${clienteText}\n`;
        report += `Código: ${codigoText}\n`;
        report += `Nombre: ${nombreText}\n`;
        report += `Fecha: ${fechaText}\n\n`;

        report += `1. Descripción\n`;
        report += `${state.descripcion || '[Detalle de las especificaciones del trabajo...]'}\n\n`;

        report += `2. Reporte Fotográfico\n`;
        if (state.photos.length === 0) {
            report += `[No se han agregado imágenes al reporte]\n\n`;
        } else {
            state.photos.forEach((photo, idx) => {
                const desc = photo.description || '[Descripción técnica y precisa de la fotografía]';
                const dt = photo.dateTime || '[DD/MM/AAAA - HH:MM]';
                report += `Foto ${idx + 1}: ${desc}\n`;
                report += `Fecha / Hora: ${dt}\n\n`;
            });
        }

        report += `3. Conclusiones y Recomendaciones\n`;
        
        // Render Conclusions Sub-section
        report += `Conclusiones\n`;
        if (state.conclusions.length === 0) {
            report += `- [Indique conclusiones del servicio]\n`;
        } else {
            state.conclusions.forEach(c => {
                if (c.trim()) report += `- ${c.trim()}\n`;
            });
        }
        report += `\n`;

        // Render Recomendations Sub-section
        report += `Recomendaciones\n`;
        if (state.recomendations.length === 0) {
            report += `- [Indique recomendaciones de uso preventivo/correctivo]\n`;
        } else {
            state.recomendations.forEach(r => {
                if (r.trim()) report += `- ${r.trim()}\n`;
            });
        }

        return report;
    }

    // Update Report Plain Text Area Preview
    function updateReportPreview() {
        outputText.textContent = buildReportText();
    }

    // Update A4 Document Sheet HTML Preview
    function updateA4SheetPreview() {
        sheetCliente.textContent = state.cliente || '---';
        sheetCodigo.textContent = state.codigo || '---';
        sheetNombre.textContent = state.nombre || '---';
        sheetFecha.textContent = state.fecha || '---';
        sheetDescripcion.textContent = state.descripcion || '---';

        // Render Photos in A4 layout
        sheetPhotos.innerHTML = '';
        if (state.photos.length === 0) {
            sheetPhotos.innerHTML = '<div style="grid-column: span 2; text-align: center; color: #94a3b8; font-style: italic; padding: 1.5rem;">Ninguna fotografía agregada al reporte.</div>';
        } else {
            state.photos.forEach((photo, index) => {
                const card = document.createElement('div');
                card.className = 'sheet-photo-card';
                card.innerHTML = `
                    <div class="sheet-photo-img-wrapper">
                        ${photo.previewUrl ? `<img src="${photo.previewUrl}">` : `
                            <div class="sheet-photo-placeholder">
                                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                <span>Sin Imagen</span>
                            </div>
                        `}
                    </div>
                    <div class="sheet-photo-desc">Foto ${index + 1}: ${photo.description || '---'}</div>
                    <div class="sheet-photo-time">Fecha / Hora: ${photo.dateTime || '---'}</div>
                `;
                sheetPhotos.appendChild(card);
            });
        }

        // Render Conclusions in A4 layout
        sheetConclusions.innerHTML = '';
        if (state.conclusions.length === 0) {
            sheetConclusions.innerHTML = '<li>---</li>';
        } else {
            state.conclusions.forEach(c => {
                if (c.trim()) {
                    const li = document.createElement('li');
                    li.textContent = c.trim();
                    sheetConclusions.appendChild(li);
                }
            });
        }

        // Render Recommendations in A4 layout
        sheetRecomendations.innerHTML = '';
        if (state.recomendations.length === 0) {
            sheetRecomendations.innerHTML = '<li>---</li>';
        } else {
            state.recomendations.forEach(r => {
                if (r.trim()) {
                    const li = document.createElement('li');
                    li.textContent = r.trim();
                    sheetRecomendations.appendChild(li);
                }
            });
        }
    }

    // Tab Switches Event Listeners
    tabText.addEventListener('click', () => {
        tabText.classList.add('active');
        tabDoc.classList.remove('active');
        textContainer.classList.remove('hidden');
        docContainer.classList.add('hidden');
        
        btnCopy.classList.remove('hidden');
        btnDownloadTxt.classList.remove('hidden');
        btnPrint.classList.add('hidden');
    });

    tabDoc.addEventListener('click', () => {
        tabDoc.classList.add('active');
        tabText.classList.remove('active');
        docContainer.classList.remove('hidden');
        textContainer.classList.add('hidden');
        
        btnCopy.classList.add('hidden');
        btnDownloadTxt.classList.add('hidden');
        btnPrint.classList.remove('hidden');
        
        updateA4SheetPreview();
    });

    // Action: Print / PDF
    btnPrint.addEventListener('click', () => {
        window.print();
    });

    // Event Listeners for Dynamic Additions
    btnGenCode.addEventListener('click', () => {
        inputCodigo.value = generateRandomCode();
        syncStateFromInputs();
        updateReportPreview();
        updateA4SheetPreview();
    });

    btnAddPhoto.addEventListener('click', () => {
        state.photos.push({
            id: Date.now(),
            previewUrl: '',
            description: '',
            dateTime: getCurrentFormattedDateTime()
        });
        renderPhotos();
        updateReportPreview();
        updateA4SheetPreview();
    });

    btnAddConclusion.addEventListener('click', () => {
        state.conclusions.push('');
        renderConclusions();
        updateReportPreview();
        updateA4SheetPreview();
    });

    btnAddRecomendation.addEventListener('click', () => {
        state.recomendations.push('');
        renderRecomendations();
        updateReportPreview();
        updateA4SheetPreview();
    });

    // Form Change listeners
    [inputCliente, inputCodigo, inputNombre, inputFecha, inputDescripcion].forEach(input => {
        input.addEventListener('input', () => {
            syncStateFromInputs();
            updateReportPreview();
            updateA4SheetPreview();
        });
    });

    // Copy to Clipboard Action
    btnCopy.addEventListener('click', async () => {
        const textToCopy = buildReportText();
        try {
            await navigator.clipboard.writeText(textToCopy);
            btnCopy.classList.add('copy-success');
            copyTextSpan.textContent = '¡Copiado!';
            
            setTimeout(() => {
                btnCopy.classList.remove('copy-success');
                copyTextSpan.textContent = 'Copiar Texto';
            }, 2000);
        } catch (err) {
            console.error('Error al copiar el texto: ', err);
            alert('No se pudo copiar el texto automáticamente. Por favor selecciónalo manualmente en la vista previa.');
        }
    });

    // Download Plain Text File
    btnDownloadTxt.addEventListener('click', () => {
        const textContent = buildReportText();
        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const filename = `${state.codigo || 'INFORME'}_${state.cliente.replace(/\s+/g, '_') || 'CLIENTE'}.txt`;
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });

    // Reset Form Action
    btnClear.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas vaciar todos los campos del informe?')) {
            inputCliente.value = '';
            inputCodigo.value = '';
            inputNombre.value = '';
            inputFecha.value = '';
            inputDescripcion.value = '';
            
            state = {
                cliente: '',
                codigo: '',
                nombre: '',
                fecha: '',
                descripcion: '',
                photos: [],
                conclusions: [],
                recomendations: []
            };

            renderPhotos();
            renderConclusions();
            renderRecomendations();
            updateReportPreview();
            updateA4SheetPreview();
        }
    });

    // Run Initial Load
    loadDemoData();
});
