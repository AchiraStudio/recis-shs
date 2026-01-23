import React, { useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import "./ticket.css";

// Google Apps Script URL
const API_URL = "https://script.google.com/macros/s/AKfycbyE8H_B8Tj-wwVYcZJtKQvwCH_e11QYTRyQ6NpBBnuX7BlzYO6IYxQL6zIGYtQJSHCH/exec";

function normalizeName(s) {
    return (s || "").trim().toUpperCase().replace(/\s+/g, " ");
}
function normalizePhone(s) {
    return (s || "").replace(/\D/g, "");
}
function normalizeClass(s) {
    return (s || "").trim().toUpperCase().replace(/\s+/g, "");
}

export default function TicketQR() {
    const canvasRef = useRef(null);

    const [sheetData, setSheetData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [kelas, setKelas] = useState("");
    const [status, setStatus] = useState({ type: "idle", msg: "" });
    const [matchedRow, setMatchedRow] = useState(null);
    const [ready, setReady] = useState(false);

    // Fetch data on mount
    React.useEffect(() => {
        fetch(`${API_URL}?action=list`)
            .then(res => res.json())
            .then(data => {
                if (data.ok && Array.isArray(data.rows)) {
                    setSheetData(data.rows);
                } else {
                    console.error("Failed to fetch sheet data:", data);
                }
            })
            .catch(err => console.error("API Error:", err))
            .finally(() => setLoading(false));
    }, []);

    // Fast lookup map
    const index = useMemo(() => {
        const m = new Map();
        for (const row of sheetData) {
            const key = [
                normalizeName(row.name),
                normalizePhone(row.phone),
                normalizeClass(row.class),
            ].join("|");
            m.set(key, row);
        }
        return m;
    }, [sheetData]);

    async function ensureFontLoaded() {
        try {
            const fontFace = new FontFace("NSEC", "url(/NotoSerif-VariableFont_wdth,wght.ttf)");
            await fontFace.load();
            document.fonts.add(fontFace);
            await document.fonts.ready;
        } catch {
            // ignore
        }
    }

    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    async function generateTicketCanvas(row) {
        // 2.75in x 8.5in
        const DPI = 300;
        const widthPx = Math.round(2.75 * DPI);
        const heightPx = Math.round(8.5 * DPI);

        const canvas = canvasRef.current;
        canvas.width = widthPx;
        canvas.height = heightPx;
        const ctx = canvas.getContext("2d");

        // 1) Background
        try {
            // Use the new manually uploaded background
            const bg = await loadImage("/ticket-bg.png");
            ctx.drawImage(bg, 0, 0, widthPx, heightPx);
        } catch (e) {
            // Fallback
            ctx.fillStyle = "#1b263b";
            ctx.fillRect(0, 0, widthPx, heightPx);
        }

        await ensureFontLoaded();
        const fontName = "NSEC";
        const fontSizePx = (14 * DPI) / 72; // Slightly larger for readability?

        // We need to place text in the BOTTOM area of the ticket, typically
        // Let's assume the bottom 1/4th is where the personal data goes based on usual designs

        // TEXT CONFIG
        ctx.fillStyle = "#ffffff"; // White text usually pops on dark/gold backgrounds
        // Shadow for text to ensure readability on complex backgrounds
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 4;
        ctx.textAlign = "center";

        const centerX = widthPx / 2;

        // NAME (Approx position: 75% down)
        ctx.font = `bold ${fontSizePx}px "${fontName}", serif`;
        const nameY = heightPx * 0.78;
        const name = normalizeName(row.name);

        // Auto-scale font if name is too long
        let scaledFontSize = fontSizePx;
        let textWidth = ctx.measureText(name).width;
        const maxTextWidth = widthPx * 0.8;
        if (textWidth > maxTextWidth) {
            scaledFontSize = fontSizePx * (maxTextWidth / textWidth);
            ctx.font = `bold ${scaledFontSize}px "${fontName}", serif`;
        }

        ctx.fillText(name, centerX, nameY);

        // CLASS (Approx position: under name)
        ctx.font = `${fontSizePx * 0.8}px "${fontName}", serif`;
        const classY = nameY + (scaledFontSize * 1.5);
        ctx.fillText(`CLASS: ${normalizeClass(row.class)}`, centerX, classY);

        // QR CODE (Bottom area)
        const qrSize = widthPx * 0.55; // 55% of width
        const qrY = heightPx * 0.85; // Very bottom
        // Actually, usually QR is in the middle or specific spot. 
        // Let's guess it's near bottom for "Gate Scan".
        // Or if the design has a specific box.
        // Safe bet: Place it in the bottom 20% area.

        // Let's adjust:
        // Name at 65%
        // Class at 68%
        // QR at 75% -> 95%

        // Reset shadow for QR
        ctx.shadowBlur = 0;

        const qrFinalY = heightPx - qrSize - (0.5 * DPI); // 0.5 inch margin from bottom
        const qrFinalX = (widthPx - qrSize) / 2;

        const payload = normalizePhone(row.phone);
        const qrDataUrl = await QRCode.toDataURL(payload, {
            margin: 1,
            color: { dark: "#000000", light: "#ffffff" } // White bg for QR to ensure contrast
        });

        const qrImg = await loadImage(qrDataUrl);
        ctx.drawImage(qrImg, qrFinalX, qrFinalY, qrSize, qrSize);

        setReady(true);
    }

    const [otpSent, setOtpSent] = useState(false);
    const [otpCode, setOtpCode] = useState("");
    const [maskedEmail, setMaskedEmail] = useState("");

    // 1. Request OTP
    async function handleRequestOtp() {
        setReady(false);
        setMatchedRow(null);
        setStatus({ type: "idle", msg: "" });

        const n = normalizeName(fullName);
        const p = normalizePhone(phone);
        const k = normalizeClass(kelas);

        if (!n || !p || !k) {
            setStatus({ type: "error", msg: "Please fill all fields." });
            return;
        }

        // Local check first (optional, but good for UX)
        const key = [n, p, k].join("|");
        const row = index.get(key);
        if (!row) {
            setStatus({ type: "error", msg: "No match found in list. Check spelling." });
            return;
        }

        setStatus({ type: "loading", msg: "Sending verification code..." });

        try {
            const res = await fetch(`${API_URL}?action=send_code&name=${encodeURIComponent(n)}&phone=${encodeURIComponent(p)}&kelas=${encodeURIComponent(k)}`);
            const data = await res.json();

            if (data.ok) {
                setMatchedRow(row); // Keep the local row data for generation later
                setMaskedEmail(data.sent_to);
                setOtpSent(true);
                setStatus({ type: "success", msg: "Code sent! Check your email." });
            } else {
                setStatus({ type: "error", msg: data.error || "Failed to send code." });
            }
        } catch (e) {
            console.error(e);
            setStatus({ type: "error", msg: "Network error sending code." });
        }
    }

    // 2. Verify OTP & Generate
    async function handleVerify() {
        if (!otpCode || otpCode.length < 6) {
            setStatus({ type: "error", msg: "Enter valid 6-digit code." });
            return;
        }

        setStatus({ type: "loading", msg: "Verifying code..." });

        const n = normalizeName(fullName);
        const p = normalizePhone(phone);
        const k = normalizeClass(kelas);

        try {
            const res = await fetch(`${API_URL}?action=verify_code&name=${encodeURIComponent(n)}&phone=${encodeURIComponent(p)}&kelas=${encodeURIComponent(k)}&code=${encodeURIComponent(otpCode)}`);
            const data = await res.json();

            if (data.ok) {
                setStatus({ type: "success", msg: "Verified! Generating Ticket..." });
                // Generate using the matched Row (or we could fetch fresh data, but local is fine if we trust it matches)
                if (matchedRow) {
                    await generateTicketCanvas(matchedRow);
                    setStatus({ type: "success", msg: "Ticket Ready!" });
                } else {
                    // Should not start here usually, but fallback
                    setStatus({ type: "error", msg: "Session lost. Please try again." });
                }
            } else {
                setStatus({ type: "error", msg: data.error || "Invalid code." });
            }
        } catch (e) {
            console.error(e);
            setStatus({ type: "error", msg: "Network error verifying code." });
        }
    }

    function downloadPng() {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const url = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url;
        a.download = `ticket-${normalizePhone(phone)}.png`;
        a.click();
    }

    function downloadPdf() {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "in",
            format: [2.75, 8.5],
        });
        pdf.addImage(imgData, "PNG", 0, 0, 2.75, 8.5);
        pdf.save(`ticket-${normalizePhone(phone)}.pdf`);
    }

    return (
        <div className="ticket-page-container">
            {/* BACKGROUND ELEMENTS REMOVED */}

            {/* CONTENT */}
            <div className="ticket-content">
                <h1 className="ticket-title">ASCENSION</h1>
                <p className="ticket-subtitle">GET YOUR TICKET NOW</p>

                <div className="ticket-form-card">
                    {loading && <div style={{ textAlign: 'center', marginBottom: 10, color: '#ffd700' }}>Loading data...</div>}
                    <div className="form-group">
                        <label className="form-label">FULL NAME</label>
                        <input
                            className="form-input"
                            value={fullName}
                            onChange={e => {
                                const val = e.target.value;
                                setFullName(val);
                                // Smart Autofill Logic
                                const normVal = normalizeName(val);
                                const match = sheetData.find(r => normalizeName(r.name) === normVal);
                                if (match) {
                                    setPhone(match.phone);
                                    setKelas(match.class);
                                    setStatus({ type: "success", msg: "Data Autofilled!" });
                                }
                            }}
                            placeholder="YOUR FULL NAME"
                            list="name-options"
                            autoComplete="off"
                        />
                        <datalist id="name-options">
                            {sheetData.map((row, idx) => (
                                <option key={idx} value={row.name} />
                            ))}
                        </datalist>
                    </div>
                    <div className="form-group">
                        <label className="form-label">PHONE NUMBER</label>
                        <input
                            className="form-input"
                            value={phone} onChange={e => setPhone(e.target.value)}
                            placeholder="08..."
                            autoComplete="tel"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">CLASS</label>
                        <input
                            className="form-input"
                            value={kelas} onChange={e => setKelas(e.target.value)}
                            placeholder="e.g. X-1"
                        />
                    </div>

                    {/* OTP SECTION */}
                    {otpSent ? (
                        <div className="form-group fade-in">
                            <label className="form-label" style={{ color: '#2ebf91' }}>
                                VERIFICATION CODE SENT TO {maskedEmail}
                            </label>
                            <input
                                className="form-input"
                                value={otpCode}
                                onChange={e => setOtpCode(e.target.value)}
                                placeholder="ENTER 6-DIGIT CODE"
                                style={{ textAlign: 'center', letterSpacing: '5px', fontSize: '1.2rem' }}
                                maxLength={6}
                            />
                            <button className="btn-generate" onClick={handleVerify} disabled={status.type === 'loading'}>
                                {status.type === 'loading' ? 'VERIFYING...' : 'VERIFY & GENERATE'}
                            </button>
                        </div>
                    ) : (
                        <button className="btn-generate" onClick={handleRequestOtp} disabled={status.type === 'loading'}>
                            {status.type === 'loading' ? 'SENDING CODE...' : 'SEND VERIFICATION CODE'}
                        </button>
                    )}

                    {status.type !== "idle" && (
                        <div style={{ marginTop: 15, padding: 10, background: status.type === 'error' ? 'rgba(200,0,0,0.5)' : 'rgba(0,180,0,0.5)', borderRadius: 4 }}>
                            {status.msg}
                        </div>
                    )}
                </div>

                <div className="canvas-container" style={{ display: ready ? 'block' : 'none' }}>
                    <canvas ref={canvasRef} className="canvas-preview" style={{ maxHeight: '50vh' }} onClick={downloadPng} />
                </div>

                {ready && (
                    <div className="download-actions">
                        <button className="btn-download" onClick={downloadPng}>PNG</button>
                        <button className="btn-download" onClick={downloadPdf}>PDF</button>
                    </div>
                )}
            </div>
        </div>
    );
}
