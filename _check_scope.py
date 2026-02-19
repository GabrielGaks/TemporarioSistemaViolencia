lines = open(r'c:\Users\Nitro V15\Documents\Projeto NAAM\FormularioRegistroV2\painel-casos.html', encoding='utf-8').readlines()

# Find the scope of setupEscolaAutocomplete at ~line 6042
print("=== Local setupEscolaAutocomplete (around line 6042) ===")
for i in range(6035, 6050):
    print(f"{i+1}: {lines[i].rstrip()[:120]}")

# Check what wraps line 6042 - look backwards for enclosing function/script
print("\n=== Looking for enclosing scope of line 6042 ===")
indent_level = len(lines[6041]) - len(lines[6041].lstrip())
print(f"Indent level at 6042: {indent_level} chars")
for i in range(6041, 4000, -1):
    l = lines[i]
    cur_indent = len(l) - len(l.lstrip())
    stripped = l.strip()
    if cur_indent < indent_level and ('function ' in stripped or '<script' in stripped.lower()):
        print(f"Enclosing scope at {i+1} (indent {cur_indent}): {stripped[:120]}")
        break

# Find window.setupEscolaAutocomplete
print("\n=== window.setupEscolaAutocomplete wrapper ===")
for i, l in enumerate(lines):
    if 'window.setupEscolaAutocomplete' in l:
        for j in range(max(0,i-2), min(len(lines), i+6)):
            print(f"{j+1}: {lines[j].rstrip()[:120]}")
        print()

# Check indent of window.setupEscolaAutocomplete
for i, l in enumerate(lines):
    if 'window.setupEscolaAutocomplete' in l:
        indent_w = len(l) - len(l.lstrip())
        print(f"Indent of window.setup at line {i+1}: {indent_w}")
        # Look for enclosing scope
        for j in range(i, max(0, i-200), -1):
            ll = lines[j]
            ci = len(ll) - len(ll.lstrip())
            s = ll.strip()
            if ci < indent_w and ('function ' in s or '<script' in s.lower()):
                print(f"Enclosing scope at {j+1} (indent {ci}): {s[:120]}")
                break
        break
