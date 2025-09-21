/**
 * Sistema de Pago con QR
 * Utiliza la API pública QR Server para generar códigos QR
 */

class QRPaymentManager {
    constructor() {
        this.qrApiUrl = 'https://api.qrserver.com/v1/create-qr-code/';
        this.paymentUrl = 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=';
        this.modal = null;
    }

    /**
     * Genera un QR para el pago usando fetch
     * @param {number} total - Total a pagar
     * @param {string} orderId - ID de la orden
     */
    async generatePaymentQR(total, orderId) {
        try {
            // Crear URL de pago (simulada)
            const paymentData = {
                amount: total,
                orderId: orderId,
                timestamp: Date.now(),
                merchant: 'Urban Vibes'
            };

            // URL de pago simulada (en producción sería una URL real de pago)
            const paymentUrl = `https://urbanvibes-payment.vercel.app/pay?data=${encodeURIComponent(JSON.stringify(paymentData))}`;
            
            // Generar QR usando fetch a la API pública
            const qrSize = '300x300';
            const qrApiUrl = `${this.qrApiUrl}?size=${qrSize}&data=${encodeURIComponent(paymentUrl)}`;
            
            // Usar fetch para obtener el QR
            const response = await fetch(qrApiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'image/png,image/jpeg,image/*,*/*',
                }
            });

            if (!response.ok) {
                throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
            }

            // Convertir la respuesta a blob y crear URL
            const blob = await response.blob();
            const qrUrl = URL.createObjectURL(blob);
            
            return {
                success: true,
                qrUrl: qrUrl,
                paymentUrl: paymentUrl,
                orderId: orderId,
                total: total,
                blob: blob // Guardar blob para limpiar memoria después
            };

        } catch (error) {
            console.error('Error generando QR con fetch:', error);
            return {
                success: false,
                error: `Error al generar el código QR: ${error.message}`
            };
        }
    }

    /**
     * Muestra el modal de pago con QR
     * @param {Object} qrData - Datos del QR generado
     */
    showPaymentModal(qrData) {
        // Crear modal si no existe
        if (!this.modal) {
            this.createPaymentModal();
        }

        // Actualizar contenido del modal
        const qrImage = document.getElementById('qrImage');
        const orderId = document.getElementById('orderId');
        const totalAmount = document.getElementById('totalAmount');
        const paymentUrl = document.getElementById('paymentUrl');
        const copyButton = document.getElementById('copyPaymentUrl');

        qrImage.src = qrData.qrUrl;
        qrImage.alt = `QR Code para pago de $${qrData.total}`;
        orderId.textContent = `Orden #${qrData.orderId}`;
        totalAmount.textContent = `$${qrData.total.toLocaleString()}`;
        paymentUrl.href = qrData.paymentUrl;
        paymentUrl.textContent = 'Abrir enlace de pago';

        // Configurar botón de copiar
        copyButton.onclick = () => this.copyToClipboard(qrData.paymentUrl);

        // Mostrar modal
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    /**
     * Crea el modal de pago
     */
    createPaymentModal() {
        const modalHTML = `
            <div id="paymentModal" class="payment-modal">
                <div class="payment-modal-content">
                    <div class="payment-header">
                        <h2>💳 Proceder al Pago</h2>
                        <button class="close-modal" onclick="qrPaymentManager.closePaymentModal()">&times;</button>
                    </div>
                    
                    <div class="payment-body">
                        <div class="qr-section">
                            <div class="qr-container">
                                <img id="qrImage" src="" alt="QR Code" class="qr-image">
                                <div class="qr-loading" id="qrLoading">
                                    <div class="spinner"></div>
                                    <p>Generando código QR...</p>
                                </div>
                            </div>
                            
                            <div class="payment-info">
                                <div class="order-info">
                                    <h3>📋 Información de la Orden</h3>
                                    <p><strong>Orden:</strong> <span id="orderId"></span></p>
                                    <p><strong>Total:</strong> <span id="totalAmount"></span></p>
                                </div>
                                
                                <div class="payment-instructions">
                                    <h3>📱 Instrucciones de Pago</h3>
                                    <ol>
                                        <li>Escanea el código QR con tu teléfono</li>
                                        <li>O haz clic en el enlace de pago</li>
                                        <li>Completa el pago en la plataforma</li>
                                        <li>Recibirás confirmación por email</li>
                                    </ol>
                                </div>
                                
                                <div class="payment-actions">
                                    <a id="paymentUrl" href="#" target="_blank" class="payment-link-btn">
                                        🔗 Abrir enlace de pago
                                    </a>
                                    <button id="copyPaymentUrl" class="copy-btn">
                                        📋 Copiar enlace
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="payment-footer">
                        <button class="cancel-payment" onclick="qrPaymentManager.closePaymentModal()">
                            ❌ Cancelar
                        </button>
                        <button class="confirm-payment" onclick="qrPaymentManager.confirmPayment()">
                            ✅ Confirmar Pago
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('paymentModal');
    }

    /**
     * Cierra el modal de pago
     */
    closePaymentModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Limpiar memoria del QR generado
            const qrImage = document.getElementById('qrImage');
            if (qrImage && qrImage.src.startsWith('blob:')) {
                URL.revokeObjectURL(qrImage.src);
            }
        }
    }

    /**
     * Copia texto al portapapeles
     * @param {string} text - Texto a copiar
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            
            // Mostrar feedback visual
            const button = document.getElementById('copyPaymentUrl');
            const originalText = button.textContent;
            button.textContent = '✅ Copiado!';
            button.style.background = '#28a745';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 2000);
            
        } catch (error) {
            console.error('Error copiando al portapapeles:', error);
            alert('No se pudo copiar el enlace. Por favor, cópialo manualmente.');
        }
    }

    /**
     * Confirma el pago (simulado)
     */
    confirmPayment() {
        // En una implementación real, aquí se verificaría el estado del pago
        alert('¡Pago confirmado! Recibirás un email de confirmación en breve.');
        this.closePaymentModal();
        
        // Limpiar carrito después del pago
        if (typeof limpiarCarrito === 'function') {
            limpiarCarrito();
        }
    }

    /**
     * Genera un ID único para la orden
     */
    generateOrderId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return `UV${timestamp}${random}`.toUpperCase();
    }
}

// Crear instancia global
window.qrPaymentManager = new QRPaymentManager();

/**
 * Función principal para proceder al pago
 * Esta función será llamada desde el botón "Proceder al Pago"
 */
async function procederAlPagoConQR() {
    try {
        // Obtener total del carrito
        const totalElement = document.getElementById('total');
        if (!totalElement) {
            throw new Error('No se encontró el total del carrito');
        }

        const totalText = totalElement.textContent.replace(/[^\d]/g, '');
        const total = parseInt(totalText);

        if (!total || total <= 0) {
            alert('El carrito está vacío o el total es inválido');
            return;
        }

        // Generar ID de orden
        const orderId = window.qrPaymentManager.generateOrderId();

        // Crear modal si no existe y mostrar loading
        if (!window.qrPaymentManager.modal) {
            window.qrPaymentManager.createPaymentModal();
        }
        
        // Mostrar modal con loading
        window.qrPaymentManager.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Mostrar loading y ocultar QR
        const loading = document.getElementById('qrLoading');
        const qrImage = document.getElementById('qrImage');
        if (loading) loading.style.display = 'flex';
        if (qrImage) qrImage.style.display = 'none';

        console.log('🔄 Generando QR con fetch...');
        
        // Generar QR usando fetch
        const qrResult = await window.qrPaymentManager.generatePaymentQR(total, orderId);

        if (qrResult.success) {
            console.log('✅ QR generado exitosamente');
            
            // Ocultar loading y mostrar QR
            if (loading) loading.style.display = 'none';
            if (qrImage) qrImage.style.display = 'block';

            // Mostrar modal con QR
            window.qrPaymentManager.showPaymentModal(qrResult);
        } else {
            throw new Error(qrResult.error || 'Error generando el código QR');
        }

    } catch (error) {
        console.error('❌ Error en el proceso de pago:', error);
        
        // Mostrar error en el modal
        const loading = document.getElementById('qrLoading');
        if (loading) {
            loading.innerHTML = `
                <div class="error-icon">⚠️</div>
                <h3>Error al generar QR</h3>
                <p>${error.message}</p>
                <button class="retry-btn" onclick="procederAlPagoConQR()">🔄 Reintentar</button>
            `;
        } else {
            alert('Error al procesar el pago: ' + error.message);
            window.qrPaymentManager.closePaymentModal();
        }
    }
}

// Cerrar modal al hacer clic fuera de él
document.addEventListener('click', (event) => {
    const modal = document.getElementById('paymentModal');
    if (modal && event.target === modal) {
        window.qrPaymentManager.closePaymentModal();
    }
});

// Cerrar modal con tecla Escape
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        window.qrPaymentManager.closePaymentModal();
    }
});
