import sys
import json
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def build_pdf(input_json_path, output_pdf_path):
    with open(input_json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    project_name = data.get("project_name", "Project")
    summary = data.get("summary", {})
    results = data.get("results", [])
    recommendations = data.get("recommendations", [])
    
    # letter page is 612 x 792 pt. Margins of 36pt leaves 540pt width.
    doc = SimpleDocTemplate(
        output_pdf_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontSize=11,
        leading=13,
        textColor=colors.HexColor('#64748b'),
        spaceAfter=15
    )
    
    sec_heading_style = ParagraphStyle(
        'SecHeading',
        parent=styles['Heading2'],
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#334155')
    )
    
    bold_body_style = ParagraphStyle(
        'BoldBody',
        parent=body_style,
        fontName='Helvetica-Bold'
    )
    
    th_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontSize=8.5,
        leading=10,
        fontName='Helvetica-Bold',
        textColor=colors.HexColor('#475569')
    )

    story = []
    
    # Header block
    story.append(Paragraph(f"<b>{project_name}</b>", title_style))
    story.append(Paragraph("CatBoost ML Risk Analysis Report — Ingestion Deliverable", subtitle_style))
    
    # Meta Info Grid
    import datetime
    date_str = datetime.datetime.now().strftime("%b %d, %Y")
    
    meta_data = [
        [
            Paragraph("<b>Date Generated:</b>", body_style),
            Paragraph(date_str, body_style),
            Paragraph("<b>Total Dependencies:</b>", body_style),
            Paragraph(str(summary.get("total", 0)), body_style)
        ],
        [
            Paragraph("<b>Bypassed (Dev/Unused):</b>", body_style),
            Paragraph(str(summary.get("filtered", 0)), body_style),
            Paragraph("<b>Risky Packages:</b>", body_style),
            Paragraph(f"<font color='#ef4444'><b>{summary.get('risky', 0)}</b></font>", body_style)
        ]
    ]
    
    meta_table = Table(meta_data, colWidths=[140, 130, 140, 130])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#e2e8f0')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#f1f5f9')),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    
    story.append(meta_table)
    story.append(Spacer(1, 10))
    
    # Section: Threat Assessment
    story.append(Paragraph("Production Package Threat Assessment", sec_heading_style))
    
    if len(results) == 0:
        story.append(Paragraph("<i>No production dependencies analyzed for this project.</i>", body_style))
    else:
        table_data = [[
            Paragraph("Library", th_style),
            Paragraph("Version", th_style),
            Paragraph("License", th_style),
            Paragraph("Maintenance", th_style),
            Paragraph("CVSS", th_style),
            Paragraph("Prediction", th_style),
            Paragraph("Probability", th_style)
        ]]
        
        for d in results:
            maint_val = d.get("maintenance_score", 10)
            maint_rating = "Poor" if maint_val >= 60 else "Fair" if maint_val >= 30 else "Healthy"
            maint_text = f"{maint_rating} ({maint_val})"
            
            label = d.get("risk_label", "Safe")
            label_color = "#ef4444" if label == "Risky" else "#22c55e"
            label_text = f"<b><font color='{label_color}'>{label}</font></b>"
            
            prob_pct = f"{int(round(d.get('risk_probability', 0) * 100))}%"
            cvss_val = d.get("cvss_score", 0)
            cvss_text = f"{cvss_val:.1f}" if cvss_val > 0 else "—"
            
            table_data.append([
                Paragraph(f"<b>{d.get('library', 'unknown')}</b>", body_style),
                Paragraph(d.get("version", "—"), body_style),
                Paragraph(d.get("license", "—"), body_style),
                Paragraph(maint_text, body_style),
                Paragraph(cvss_text, body_style),
                Paragraph(label_text, body_style),
                Paragraph(prob_pct, body_style)
            ])
        
        # 540 total width
        dep_table = Table(table_data, colWidths=[120, 50, 70, 85, 45, 85, 85])
        dep_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e2e8f0')),
            ('BOTTOMPADDING', (0,0), (-1,0), 5),
            ('TOPPADDING', (0,0), (-1,0), 5),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')]),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
            ('PADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(dep_table)
        
    story.append(Spacer(1, 10))
    
    # Section: Recommendations
    story.append(Paragraph("Remediation & Compliance Recommendations", sec_heading_style))
    
    if len(recommendations) == 0:
        story.append(Paragraph("<font color='#22c55e'><b>✓ Excellent! No active vulnerabilities, license violations, or stale packages detected. No action required.</b></font>", body_style))
    else:
        for r in recommendations:
            r_type = r.get("type", "Info")
            r_title = r.get("title", "")
            r_desc = r.get("desc", "")
            r_action = r.get("action", "")
            
            type_color = "#ef4444" if r_type == "Security" else "#f59e0b" if r_type == "Compliance" else "#3b82f6"
            
            rec_content = [
                [Paragraph(f"<b><font color='{type_color}'>{r_type.upper()} ALERT</font> — {r_title}</b>", bold_body_style)],
                [Paragraph(r_desc, body_style)],
                [Paragraph(f"<b>Recommended Action:</b> {r_action}", body_style)]
            ]
            
            rec_table = Table(rec_content, colWidths=[540])
            rec_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
                ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
                ('LINELEFT', (0,0), (0,-1), 4, colors.HexColor(type_color)),
                ('PADDING', (0,0), (-1,-1), 5),
                ('TOPPADDING', (0,0), (-1,0), 6),
                ('BOTTOMPADDING', (0,2), (-1,2), 6),
            ]))
            story.append(rec_table)
            story.append(Spacer(1, 6))
            
    doc.build(story)

if __name__ == '__main__':
    import sys
    if len(sys.argv) < 3:
        sys.exit(1)
    build_pdf(sys.argv[1], sys.argv[2])
