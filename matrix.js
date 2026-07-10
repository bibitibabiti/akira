
        const canvas = document.getElementById('matrix-canvas');
        const ctx = canvas.getContext('2d');

        const chars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const charArray = chars.split('');
        const fontSize = 14;
        let width = 0;
        let height = 0;
        let dpr = Math.min(window.devicePixelRatio || 1, 2);
        let columns = 0;
        let rainDrops = [];

        function resizeCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;
            dpr = Math.min(window.devicePixelRatio || 1, 2);

            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            columns = Math.ceil(width / fontSize);
            rainDrops = Array.from({ length: columns }, () => Math.floor(Math.random() * -height / fontSize));
        }

        function draw() {
            const styles = getComputedStyle(document.body);
            const fade = styles.getPropertyValue('--matrix-fade').trim() || 'rgba(0,0,0,0.08)';
            const headColor = styles.getPropertyValue('--matrix-head').trim() || '#ffffff';
            const tail1 = styles.getPropertyValue('--matrix-tail1').trim() || '#1013ba';
            const tail2 = styles.getPropertyValue('--matrix-tail2').trim() || '#1f38dd';

            ctx.fillStyle = fade;
            ctx.fillRect(0, 0, width, height);
            ctx.font = `${fontSize}px monospace`;
            ctx.textBaseline = 'top';

            for (let i = 0; i < rainDrops.length; i++) {
                const x = i * fontSize;
                const y = rainDrops[i] * fontSize;
                const text = charArray[Math.floor(Math.random() * charArray.length)];
                const isHead = Math.random() > 0.985;

                if (isHead) ctx.fillStyle = headColor;
                else ctx.fillStyle = (Math.random() > 0.5 ? tail1 : tail2);

                ctx.fillText(text, x, y);

                if (y > height * 1.2 && Math.random() > 0.98) {
                    rainDrops[i] = 0;
                }

                rainDrops[i] += 1 + Math.random() * 0.2;
            }

            requestAnimationFrame(draw);
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        draw();
