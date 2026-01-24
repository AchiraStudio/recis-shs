import React, { useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import "./ticket.css";

// Google Apps Script URL
const API_URL = "https://script.google.com/macros/s/AKfycbyE8H_B8Tj-wwVYcZJtKQvwCH_e11QYTRyQ6NpBBnuX7BlzYO6IYxQL6zIGYtQJSHCH/exec";

function normalizeName(s) {
    return (s || "").trim().toUpperCase().replace(/\s+/g, " ");
}

// UPDATED: Removes non-digits AND removes leading '0'
// 0812 -> 812
// 812  -> 812
function normalizePhone(s) {
    let clean = (s || "").replace(/\D/g, ""); 
    if (clean.startsWith("0")) {
        clean = clean.substring(1);
    }
    return clean;
}

function normalizeClass(s) {
    return (s || "").trim().toUpperCase().replace(/\s+/g, "");
}

export default function TicketQR() {
    const canvasRef = useRef(null);

    const [sheetData, setSheetData] = useState([]);
    const [loading, setLoading] = useState(true);

    // We still store these, but they are filled automatically now
    const [fullName, setFullName] = useState("");
    const [kelas, setKelas] = useState("");
    
    // Only Phone is entered by user
    const [phone, setPhone] = useState("");
    
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

    // UPDATED: Index by Phone Number ONLY
    const phoneIndex = useMemo(() => {
        const m = new Map();
        for (const row of sheetData) {
            // Normalize the sheet phone (remove 0, remove non-digits)
            const key = normalizePhone(row.phone);
            // Store the whole row, keyed by the clean number
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
        const DPI = 300;
        const widthPx = Math.round(2.75 * DPI);
        const heightPx = Math.round(8.5 * DPI);

        const canvas = canvasRef.current;
        canvas.width = widthPx;
        canvas.height = heightPx;
        const ctx = canvas.getContext("2d");

        try {
            const bg = await loadImage("/ticket-bg.png");
            ctx.drawImage(bg, 0, 0, widthPx, heightPx);
        } catch (e) {
            ctx.fillStyle = "#1b263b";
            ctx.fillRect(0, 0, widthPx, heightPx);
        }

        await ensureFontLoaded();
        const fontName = "NSEC";
        const fontSizePx = (14 * DPI) / 72;

        ctx.fillStyle = "#ffffff"; 
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 4;
        ctx.textAlign = "center";

        const centerX = widthPx / 2;

        // NAME
        ctx.font = `bold ${fontSizePx}px "${fontName}", serif`;
        const nameY = heightPx * 0.78;
        const name = normalizeName(row.name);

        let scaledFontSize = fontSizePx;
        let textWidth = ctx.measureText(name).width;
        const maxTextWidth = widthPx * 0.8;
        if (textWidth > maxTextWidth) {
            scaledFontSize = fontSizePx * (maxTextWidth / textWidth);
            ctx.font = `bold ${scaledFontSize}px "${fontName}", serif`;
        }

        ctx.fillText(name, centerX, nameY);

        // CLASS
        ctx.font = `${fontSizePx * 0.8}px "${fontName}", serif`;
        const classY = nameY + (scaledFontSize * 1.5);
        ctx.fillText(`CLASS: ${normalizeClass(row.class)}`, centerX, classY);

        // QR CODE
        const qrSize = widthPx * 0.55; 
        
        ctx.shadowBlur = 0;

        const qrFinalY = heightPx - qrSize - (0.5 * DPI); 
        const qrFinalX = (widthPx - qrSize) / 2;

        // QR Payload: Use the database phone number (or normalized)
        const payload = normalizePhone(row.phone);
        const qrDataUrl = await QRCode.toDataURL(payload, {
            margin: 1,
            color: { dark: "#000000", light: "#ffffff" } 
        });

        const qrImg = await loadImage(qrDataUrl);
        ctx.drawImage(qrImg, qrFinalX, qrFinalY, qrSize, qrSize);

        setReady(true);
    }

    const [otpSent, setOtpSent] = useState(false);
    const [otpCode, setOtpCode] = useState("");
    const [maskedEmail, setMaskedEmail] = useState("");

    // 1. Request OTP (UPDATED LOGIC)
    async function handleRequestOtp() {
        setReady(false);
        setMatchedRow(null);
        setStatus({ type: "idle", msg: "" });

        // 1. Clean the user input (remove 0, remove non-digits)
        const inputPhoneClean = normalizePhone(phone);

        if (!inputPhoneClean) {
            setStatus({ type: "error", msg: "Please enter a phone number." });
            return;
        }

        // 2. Look up in the Map
        const row = phoneIndex.get(inputPhoneClean);

        if (!row) {
            setStatus({ type: "error", msg: "Phone number not found in database." });
            return;
        }

        // 3. Auto-fill state for API use
        const n = normalizeName(row.name);
        const p = normalizePhone(row.phone); // Send the database version or normalized version
        const k = normalizeClass(row.class);

        // Update visual state (optional, just to show found user)
        setFullName(row.name);
        setKelas(row.class);

        setStatus({ type: "loading", msg: `Found ${row.name}. Sending code...` });

        try {
            const res = await fetch(`${API_URL}?action=send_code&name=${encodeURIComponent(n)}&phone=${encodeURIComponent(p)}&kelas=${encodeURIComponent(k)}`);
            const data = await res.json();

            if (data.ok) {
                setMatchedRow(row); 
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

        // Use the matched row data, not manual input
        if (!matchedRow) {
             setStatus({ type: "error", msg: "Session expired. Search again." });
             return;
        }

        const n = normalizeName(matchedRow.name);
        const p = normalizePhone(matchedRow.phone);
        const k = normalizeClass(matchedRow.class);

        try {
            const res = await fetch(`${API_URL}?action=verify_code&name=${encodeURIComponent(n)}&phone=${encodeURIComponent(p)}&kelas=${encodeURIComponent(k)}&code=${encodeURIComponent(otpCode)}`);
            const data = await res.json();

            if (data.ok) {
                setStatus({ type: "success", msg: "Verified! Generating Ticket..." });
                await generateTicketCanvas(matchedRow);
                setStatus({ type: "success", msg: "Ticket Ready!" });
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
            <div className="ticket-content">
                <h1 className="ticket-title">ASCENSION</h1>
                <p className="ticket-subtitle">GET YOUR TICKET NOW</p>

                <div className="ticket-form-card">
                    {loading && <div style={{ textAlign: 'center', marginBottom: 10, color: '#ffd700' }}>Loading Database...</div>}
                    
                    {/* ONLY PHONE INPUT VISIBLE */}
                    <div className="form-group">
                        <label className="form-label">PHONE NUMBER</label>
                        <input
                            className="form-input"
                            value={phone} 
                            onChange={e => setPhone(e.target.value)}
                            placeholder="e.g. 08123456789"
                            autoComplete="tel"
                        />
                    </div>

                    {/* Show Found Name (Optional Feedback) */}
                    {matchedRow && otpSent && (
                        <div style={{textAlign:'center', marginBottom: '15px', color: '#fff'}}>
                            <small>Found: {matchedRow.name} ({matchedRow.class})</small>
                        </div>
                    )}

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
                            <button 
                                className="btn-link" 
                                style={{background:'none', border:'none', color:'#ccc', marginTop:'10px', cursor:'pointer'}}
                                onClick={() => { setOtpSent(false); setOtpCode(""); setMatchedRow(null); }}
                            >
                                Wrong number? Go back
                            </button>
                        </div>
                    ) : (
                        <button className="btn-generate" onClick={handleRequestOtp} disabled={status.type === 'loading'}>
                            {status.type === 'loading' ? 'SEARCHING...' : 'FIND MY TICKET'}
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