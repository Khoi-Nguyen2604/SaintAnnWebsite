// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = './scripts/pdfjs/pdf.worker.min.js';

async function renderBulletinPreview(url, canvas) {
    try {
        canvas.width = 200;
        canvas.height = 280;
        const ctx = canvas.getContext('2d');
        
        // Show loading state
        ctx.fillStyle = '#f6f7fb';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.font = '14px system-ui';
        ctx.fillText('Loading...', canvas.width/2, canvas.height/2);

        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        
        // Calculate scale to fit our target dimensions
        const viewport = page.getViewport({ scale: 1.0 });
        const scaleX = canvas.width / viewport.width;
        const scaleY = canvas.height / viewport.height;
        const scale = Math.min(scaleX, scaleY);
        
        const scaledViewport = page.getViewport({ scale });
        
        // Center the PDF preview in the canvas
        const offsetX = (canvas.width - scaledViewport.width) / 2;
        const offsetY = (canvas.height - scaledViewport.height) / 2;
        
        // Clear the loading message
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        await page.render({
            canvasContext: ctx,
            viewport: scaledViewport,
            transform: [1, 0, 0, 1, offsetX, offsetY]
        }).promise;
    } catch (error) {
        console.error('Error rendering PDF:', error);
        // Show error state
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#f6f7fb';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.font = '14px system-ui';
        ctx.fillText('Preview not available', canvas.width/2, canvas.height/2);
    }
}

async function loadBulletins() {
    try {
        const bulletins = [
            { date: 'Oct 19th', filename: '2025 October 19 Bulletin.pdf' },
            { date: 'Oct 12th', filename: '2025 October 12 Bulletin.pdf' },
            { date: 'Oct 5th', filename: '2025 October 5 Bulletin.pdf' },
            { date: 'Sep 28th', filename: '2025 September 28 Bulletin.pdf' },
            { date: 'Sep 21st', filename: '2025 September 21 Bulletin.pdf' }
        ];

        const footerContainer = document.querySelector('.site-footer .container');
        const bulletinSection = document.createElement('section');
        bulletinSection.className = 'bulletin-preview';
        bulletinSection.setAttribute('aria-labelledby', 'bulletin-title');

        bulletinSection.innerHTML = `
            <h2 id="bulletin-title" style="color: var(--text); font-size: 2rem; margin: 1rem 0;">Bulletins</h2>
            <div class="bulletin-grid">
                ${bulletins.map(bulletin => `
                    <div class="bulletin-item">
                        <a href="./bulletin/${bulletin.filename}" target="_blank" rel="noopener" class="bulletin-link">
                            <canvas class="bulletin-preview-canvas" 
                                    style="border: 1px solid var(--border); border-radius: 0.5rem;">
                            </canvas>
                            <div class="bulletin-date">Sun, ${bulletin.date}</div>
                        </a>
                    </div>
                `).join('')}
                <div class="bulletin-item">
                    <a href="#" class="bulletin-link">
                        <canvas class="bulletin-preview-canvas" 
                                style="border: 1px solid var(--border); border-radius: 0.5rem;">
                        </canvas>
                        <div class="bulletin-date">Older Publications »</div>
                    </a>
                </div>
            </div>
        `;

        footerContainer.appendChild(bulletinSection);

        // Render all bulletin PDFs except the last one (Older Publications)
        const allCanvases = bulletinSection.querySelectorAll('.bulletin-preview-canvas');
        
        // Render the actual bulletin PDFs (all except the last canvas)
        for (let i = 0; i < bulletins.length; i++) {
            const canvas = allCanvases[i];
            const pdfUrl = `./bulletin/${bulletins[i].filename}`;
            try {
                await renderBulletinPreview(pdfUrl, canvas);
            } catch (err) {
                console.error(`Error rendering bulletin ${bulletins[i].filename}:`, err);
                // Show error state for this specific bulletin
                canvas.width = 200;
                canvas.height = 280;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#f6f7fb';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#666';
                ctx.textAlign = 'center';
                ctx.font = '14px system-ui';
                ctx.fillText('Preview not available', canvas.width/2, canvas.height/2);
            }
        }

        // Fill the last canvas (Older Publications) with placeholder
        const lastCanvas = allCanvases[allCanvases.length - 1];
        if (lastCanvas) {
            lastCanvas.width = 200;
            lastCanvas.height = 280;
            const ctx = lastCanvas.getContext('2d');
            ctx.fillStyle = '#f6f7fb';
            ctx.fillRect(0, 0, lastCanvas.width, lastCanvas.height);
            ctx.fillStyle = '#666';
            ctx.textAlign = 'center';
            ctx.font = '14px system-ui';
            ctx.fillText('View Archive', lastCanvas.width/2, lastCanvas.height/2);
        }
    } catch (error) {
        console.error('Error loading bulletins:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadBulletins);        