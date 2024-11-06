import { useEffect, useMemo, useRef, useState } from "react";

export default function Canvas() {

    let URLs = [
        "images/20221010_085000.png",
        "images/dRONE.png",
        "images/ice cave.png",
        "images/Purple Flower.png",
        "images/Tree in Cyberpunk.png"
    ]

    const [images, setImages] = useState([]);

    const canvasReference = useRef(null);
    const contextReference = useRef(null);
    const mousePosition = useRef({ x: 0, y: 0 })
    const TransitionValue = useRef(1);

    const tileSize = 20;
    const A = 1, B = 0.008;
    const TransitionTime = 800, VisibilityDuration = 2000;


    const clearCanvas = () => {
        const canvas = canvasReference.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    const updateMouse = (e) => {
        mousePosition.current.x = e.clientX;
        mousePosition.current.y = e.clientY + window.scrollY;
        // console.log(window.scrollY)
    };
    const drawImage = (ctx, img, reverse = false) => {

        let w = img.width, h = img.height;
        let W = canvasReference.current.width;
        let H = canvasReference.current.height;
        if (!reverse) {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, W, H);
        }
        if (w / h > W / H) {
            ctx.drawImage(img, (W - w * H / h) / 2, 0, w * H / h, H)
        }
        else {
            ctx.drawImage(img, 0, (H - h * W / w) / 2, W, h * W / w);
        }
        if (reverse) {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, W, H);
        }
    }

    useEffect(() => {
        for (let url of URLs) {
            let img = new Image();
            img.src = url;
            img.onload = () => {
                setImages((prevImages) => [...prevImages, img]);
            }
        }
    }, [])
    useEffect(() => {
        const canvas = canvasReference.current;
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", updateMouse);

        const ctx = canvas.getContext("2d");
        contextReference.current = ctx;

        let Time = 0, lastTime = 0;
        let current_index = 1;
        let anim_id;

        const draw = (t) => {
            let dt = t - lastTime;
            if (!dt) dt = 0
            lastTime = t;
            Time += dt;

            clearCanvas();


            ctx.fillStyle = "white";
            if (Time > VisibilityDuration && Time - VisibilityDuration < TransitionTime) {
                TransitionValue.current = Math.pow(1 - (Time - VisibilityDuration) / TransitionTime, 5);
            }
            else if (Time - VisibilityDuration > TransitionTime) {
                Time = 0;
                TransitionValue.current = 1;
                current_index = (current_index + 1) % images.length;
            }

            for (let x = 0; x <= canvas.width + tileSize; x += tileSize) {
                for (let y = 0; y <= canvas.height + tileSize; y += tileSize) {
                    let distance = Math.hypot(mousePosition.current.x - x, mousePosition.current.y - y);
                    let r = tileSize * A * Math.exp(-B * distance * TransitionValue.current);
                    ctx.fillRect(
                        x - r / 2,
                        y - r / 2,
                        r,
                        r
                    );
                }
            }

            try {
                ctx.globalCompositeOperation = "source-atop";
                drawImage(ctx, images[current_index])
                ctx.globalCompositeOperation = "destination-over";
                drawImage(ctx, images[(((current_index - 1) % images.length) + images.length) % images.length], true)
            }
            catch (err) {

            }

            ctx.globalCompositeOperation = "source-over";

            anim_id = window.requestAnimationFrame(draw)
        }

        draw()

        return () => {
            window.cancelAnimationFrame(anim_id);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", updateMouse);

        }

    }, [images]);


    return (
        <canvas
            ref={canvasReference}
        />

    );
}