from pathlib import Path
import json

try:
    from docx import Document
except ImportError:
    Document = None

posts_dir = Path(__file__).resolve().parent
output_path = posts_dir / "posts.json"


def parse_text_post(filepath: Path):
    text = filepath.read_text(encoding="utf-8").strip()
    lines = [line.rstrip() for line in text.splitlines()]

    title = filepath.stem.replace("-", " ").title()
    content_lines = lines

    if lines and lines[0].startswith("# "):
        title = lines[0][2:].strip()
        content_lines = lines[1:]
    elif lines:
        first_nonempty = next((line.strip() for line in lines if line.strip()), "")
        if first_nonempty:
            title = first_nonempty
            content_lines = [line for line in lines if line.strip() != first_nonempty]

    paragraphs = [block.strip() for block in "\n".join(content_lines).split("\n\n") if block.strip()]
    return {"title": title, "paragraphs": paragraphs}


posts = []

for filepath in sorted(posts_dir.glob("*.txt")):
    if filepath.name == "posts.json":
        continue
    posts.append(parse_text_post(filepath))

if Document is not None:
    for filepath in sorted(posts_dir.glob("*.docx")):
        document = Document(filepath)
        paragraphs = [paragraph.text.strip() for paragraph in document.paragraphs if paragraph.text.strip()]
        title = paragraphs[0] if paragraphs else filepath.stem.replace("-", " ").title()
        body = paragraphs[1:] if len(paragraphs) > 1 else []
        posts.append({"title": title, "paragraphs": body})

output_path.write_text(json.dumps(posts, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"Converted {len(posts)} posts to {output_path.name}")
