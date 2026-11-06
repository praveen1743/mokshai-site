"""Build the downloadable Word templates in public/templates/.

Run after editing the text below:  python3 scripts/build-templates.py
Needs python-docx (pip install python-docx). The same text appears in the
matching articles; keep both in step:
  - src/content/insights/ai-acceptable-use-policy-template.md
  - src/content/insights/ai-governance-framework-small-business.md
"""
from pathlib import Path
from docx import Document
from docx.shared import Pt, RGBColor

OUT = Path(__file__).resolve().parent.parent / "public" / "templates"
INK = RGBColor(0x0E, 0x1A, 0x2B)
NOTE = "Template from mokshai.net. Replace everything in [square brackets], delete what does not apply, and have it reviewed by whoever handles your HR and legal matters before you publish it. This is not legal advice."


def base(title: str) -> Document:
    doc = Document()
    st = doc.styles["Normal"]
    st.font.name = "Calibri"
    st.font.size = Pt(11)
    h = doc.add_heading(title, level=0)
    for r in h.runs:
        r.font.color.rgb = INK
    p = doc.add_paragraph(NOTE)
    p.runs[0].italic = True
    p.runs[0].font.size = Pt(9)
    return doc


def section(doc, heading, paras=(), bullets=()):
    doc.add_heading(heading, level=1)
    for t in paras:
        doc.add_paragraph(t)
    for b in bullets:
        doc.add_paragraph(b, style="List Bullet")


def table(doc, header, rows):
    t = doc.add_table(rows=1, cols=len(header))
    t.style = "Light Grid Accent 1"
    for i, h in enumerate(header):
        t.rows[0].cells[i].text = h
    for row in rows:
        cells = t.add_row().cells
        for i, v in enumerate(row):
            cells[i].text = v
    doc.add_paragraph()


def acceptable_use():
    doc = base("[Company name] AI acceptable use policy")
    doc.add_paragraph("Owner: [name, role]   ·   Effective: [date]   ·   Next review: [date, at most 12 months later]")
    section(doc, "1. Purpose and scope", [
        "This policy sets out how staff, contractors and anyone working on our behalf may use AI tools at work. It covers chat assistants, AI features inside software we already use, browser extensions, transcription and note-taking tools, and AI agents connected to our systems.",
        "It applies on company devices and on personal devices used for work.",
    ])
    section(doc, "2. Approved tools")
    doc.add_paragraph("Use only the tools below for work, signed in with your company account. Personal or free accounts are not approved for company or client information.")
    table(doc, ["Tool", "Approved for", "Account"], [
        ["[e.g. Microsoft 365 Copilot]", "[Drafting, summarising internal documents]", "Company account only"],
        ["[e.g. ChatGPT Business / Claude Team]", "[Drafting, research with no client data]", "Company workspace only"],
        ["[Tool]", "[Use]", "[Account]"],
    ])
    section(doc, "3. Information you must never enter into an AI tool", bullets=[
        "Passwords, API keys, MFA codes or any other credentials.",
        "Client data, unless the tool is approved for client data in section 2 and the client contract allows it.",
        "Personal data about staff, clients or the public beyond what the task strictly needs.",
        "Payment card, bank, health or government ID information.",
        "Contracts, pricing, source code or other confidential material in any tool not approved for it.",
    ])
    section(doc, "4. Using what AI produces", bullets=[
        "You are responsible for anything you send, publish or act on, whether or not AI helped produce it.",
        "Check facts, figures, names, links and code before you use them. AI tools state wrong things confidently.",
        "Do not let AI make final decisions about people, such as hiring, discipline, credit or pricing for an individual. A person decides.",
        "Tell the recipient when a client deliverable was substantially produced by AI, if the client contract or [Company name] guidance requires it.",
    ])
    section(doc, "5. AI features inside software we already use", [
        "Many tools now include AI features that can be switched on by any user. Do not switch on a new AI feature, connector or plug-in that reads company data without approval from [role].",
    ])
    section(doc, "6. Asking for a new tool", [
        "Ask [role / channel] before you use any AI tool not listed in section 2. Include what you want to use it for and what information it would see. We aim to answer within [number] working days.",
    ])
    section(doc, "7. Mistakes and incidents", [
        "If you entered information you should not have, or an AI tool produced something that caused harm, tell [role / channel] the same day. Reporting quickly matters more than blame.",
    ])
    section(doc, "8. Breaches", [
        "Breaking this policy may lead to loss of access to AI tools and, for serious or repeated cases, action under [disciplinary policy].",
    ])
    section(doc, "9. Acknowledgement", [
        "I have read this policy and will follow it.",
        "Name: ____________________   Signature: ____________________   Date: __________",
    ])
    doc.save(OUT / "ai-acceptable-use-policy-template.docx")


def governance():
    doc = base("[Company name] AI governance: one-page framework")
    doc.add_paragraph("Owner: [name, role]   ·   Approved by: [leadership]   ·   Reviewed: [quarterly]")
    section(doc, "1. Who is accountable", bullets=[
        "AI owner: [name]. Keeps the register, approves new tools, chairs the quarterly review.",
        "System owners: the person responsible for each workflow that uses AI.",
        "Security / IT: [name or provider]. Reviews access, accounts and logging.",
    ])
    section(doc, "2. The AI register")
    doc.add_paragraph("Every AI tool, feature or agent that touches company data is listed here before it is used.")
    table(doc, ["Tool or agent", "Owner", "Purpose", "Data it can see", "Risk", "Who approves its output", "Next review"], [
        ["[e.g. Ticket triage agent]", "[Service desk lead]", "[Categorise and route tickets]", "[PSA tickets, client names]", "[Medium]", "[Technician on borderline cases]", "[date]"],
        ["[Tool]", "", "", "", "", "", ""],
    ])
    section(doc, "3. Risk levels", bullets=[
        "Low: no confidential or personal data, output reviewed before use. Example: drafting internal text.",
        "Medium: reads company or client data, or its output reaches a client. Needs an owner, a named approval step and a log.",
        "High: acts in systems, affects money, access or decisions about people. Needs a pilot with a stop rule, least-privilege accounts, human approval on every action until the pilot is signed off, and a documented way to switch it off.",
    ])
    section(doc, "4. Rules for every AI use", bullets=[
        "Staff follow the AI acceptable use policy.",
        "Each integration has its own least-privilege account. No shared admin credentials.",
        "We keep a record of what each agent read, decided and changed.",
        "We know where the vendor processes our data and whether it is used to train models.",
        "Anyone can pause an agent. The switch-off route is written down.",
    ])
    section(doc, "5. Review", bullets=[
        "Quarterly: walk the register, check accuracy and incidents, retire unused tools, re-check vendor terms.",
        "After any incident: record what happened, what changed, and who approved the change.",
    ])
    section(doc, "6. How this maps to NIST AI RMF", [
        "Govern: sections 1, 4 and 5.   Map: section 2.   Measure: accuracy and incident checks in section 5.   Manage: risk levels and controls in section 3.",
    ])
    doc.save(OUT / "ai-governance-one-page-template.docx")


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    acceptable_use()
    governance()
    print("Wrote", *sorted(p.name for p in OUT.glob("*.docx")))
