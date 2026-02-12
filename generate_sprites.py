"""
Generate pixel art character spritesheets (32x48 per frame, 4 cols × 4 rows).
Rows: Down, Up, Left, Right — 4 walking frames each.
"""
from PIL import Image, ImageDraw

def draw_character(draw, x, y, direction, frame, palette):
    """Draw a single character frame at (x, y) with the given palette and direction."""
    skin = palette['skin']
    hair = palette['hair']
    body = palette['body']
    body2 = palette['body2']
    legs = palette['legs']
    shoes = palette['shoes']
    accent = palette.get('accent', body)
    
    # Walking bounce
    bounce = -1 if frame % 2 == 0 else 0
    leg_offset = 2 if frame % 2 == 0 else -2
    arm_swing = 1 if frame % 2 == 0 else -1
    
    facing_down = direction == 0
    facing_up = direction == 1
    facing_left = direction == 2
    facing_right = direction == 3
    
    # === HEAD (centered at top) ===
    head_y = y + 4 + bounce
    # Hair back (behind head)
    if facing_down or facing_left or facing_right:
        draw.rectangle([x+10, head_y-2, x+22, head_y+2], fill=hair)
    
    # Head shape
    draw.rectangle([x+10, head_y, x+22, head_y+12], fill=skin)
    
    # Hair on top
    draw.rectangle([x+9, head_y-1, x+23, head_y+3], fill=hair)
    
    if facing_down:
        # Eyes
        draw.rectangle([x+12, head_y+5, x+14, head_y+7], fill=(30, 30, 30))
        draw.rectangle([x+18, head_y+5, x+20, head_y+7], fill=(30, 30, 30))
        # Mouth
        draw.rectangle([x+14, head_y+9, x+18, head_y+10], fill=(180, 100, 100))
    elif facing_up:
        # Just hair from behind
        draw.rectangle([x+9, head_y-1, x+23, head_y+8], fill=hair)
    elif facing_left:
        draw.rectangle([x+10, head_y+5, x+12, head_y+7], fill=(30, 30, 30))
        draw.rectangle([x+10, head_y+9, x+14, head_y+10], fill=(180, 100, 100))
    elif facing_right:
        draw.rectangle([x+20, head_y+5, x+22, head_y+7], fill=(30, 30, 30))
        draw.rectangle([x+18, head_y+9, x+22, head_y+10], fill=(180, 100, 100))
    
    # === BODY / TORSO ===
    body_y = head_y + 13
    draw.rectangle([x+8, body_y, x+24, body_y+14], fill=body)
    # Body accent (belt, collar, etc.)
    draw.rectangle([x+8, body_y+12, x+24, body_y+14], fill=accent)
    
    # Arms
    if facing_down or facing_up:
        # Left arm
        draw.rectangle([x+5, body_y+2+arm_swing, x+8, body_y+12+arm_swing], fill=body2)
        # Right arm  
        draw.rectangle([x+24, body_y+2-arm_swing, x+27, body_y+12-arm_swing], fill=body2)
    elif facing_left:
        draw.rectangle([x+6, body_y+2+arm_swing, x+10, body_y+12+arm_swing], fill=body2)
    elif facing_right:
        draw.rectangle([x+22, body_y+2+arm_swing, x+26, body_y+12+arm_swing], fill=body2)

    # Hands
    if facing_down or facing_up:
        draw.rectangle([x+5, body_y+11+arm_swing, x+8, body_y+13+arm_swing], fill=skin)
        draw.rectangle([x+24, body_y+11-arm_swing, x+27, body_y+13-arm_swing], fill=skin)
    
    # === LEGS ===
    leg_y = body_y + 15
    if facing_down or facing_up:
        # Left leg
        draw.rectangle([x+10+leg_offset, leg_y, x+15+leg_offset, leg_y+8], fill=legs)
        draw.rectangle([x+10+leg_offset, leg_y+7, x+15+leg_offset, leg_y+10], fill=shoes)
        # Right leg
        draw.rectangle([x+17-leg_offset, leg_y, x+22-leg_offset, leg_y+8], fill=legs)
        draw.rectangle([x+17-leg_offset, leg_y+7, x+22-leg_offset, leg_y+10], fill=shoes)
    elif facing_left:
        draw.rectangle([x+10+leg_offset, leg_y, x+16+leg_offset, leg_y+8], fill=legs)
        draw.rectangle([x+10+leg_offset, leg_y+7, x+16+leg_offset, leg_y+10], fill=shoes)
        draw.rectangle([x+12-leg_offset, leg_y, x+18-leg_offset, leg_y+8], fill=legs)
        draw.rectangle([x+12-leg_offset, leg_y+7, x+18-leg_offset, leg_y+10], fill=shoes)
    elif facing_right:
        draw.rectangle([x+14+leg_offset, leg_y, x+20+leg_offset, leg_y+8], fill=legs)
        draw.rectangle([x+14+leg_offset, leg_y+7, x+20+leg_offset, leg_y+10], fill=shoes)
        draw.rectangle([x+16-leg_offset, leg_y, x+22-leg_offset, leg_y+8], fill=legs)
        draw.rectangle([x+16-leg_offset, leg_y+7, x+22-leg_offset, leg_y+10], fill=shoes)


def draw_wizard_extras(draw, x, y, direction, frame, bounce):
    """Add wizard-specific details: tall hat, staff, beard."""
    head_y = y + 4 + bounce
    
    # Tall pointy hat
    hat_color = (100, 50, 160)
    hat_band = (200, 170, 50)
    draw.rectangle([x+8, head_y-2, x+24, head_y+3], fill=hat_color)
    draw.rectangle([x+10, head_y-6, x+22, head_y-1], fill=hat_color)
    draw.rectangle([x+12, head_y-10, x+20, head_y-5], fill=hat_color)
    draw.rectangle([x+14, head_y-13, x+18, head_y-9], fill=hat_color)
    draw.rectangle([x+8, head_y+1, x+24, head_y+3], fill=hat_band)
    
    # Beard (only facing down or sides)
    if direction == 0:  # down
        draw.rectangle([x+12, head_y+10, x+20, head_y+18], fill=(220, 220, 220))
        draw.rectangle([x+14, head_y+18, x+18, head_y+21], fill=(200, 200, 200))
    elif direction == 2:  # left
        draw.rectangle([x+8, head_y+10, x+14, head_y+18], fill=(220, 220, 220))
    elif direction == 3:  # right
        draw.rectangle([x+18, head_y+10, x+24, head_y+18], fill=(220, 220, 220))
    
    # Staff
    staff_x = x + 26 if direction != 2 else x + 4
    body_y = head_y + 13
    draw.rectangle([staff_x, head_y-8, staff_x+2, body_y+20], fill=(139, 90, 43))
    # Orb on top
    draw.ellipse([staff_x-2, head_y-12, staff_x+4, head_y-6], fill=(100, 200, 255))


def draw_blacksmith_extras(draw, x, y, direction, frame, bounce):
    """Add blacksmith-specific details: apron, hammer, bald head."""
    head_y = y + 4 + bounce
    body_y = head_y + 13
    
    # Apron over body
    draw.rectangle([x+9, body_y+4, x+23, body_y+16], fill=(139, 90, 43))
    draw.rectangle([x+12, body_y+2, x+20, body_y+5], fill=(139, 90, 43))
    
    # Hammer (in hand)
    if direction in [0, 3]:  # down or right
        hx = x + 25
        draw.rectangle([hx, body_y+2, hx+2, body_y+14], fill=(100, 80, 60))
        draw.rectangle([hx-2, body_y, hx+4, body_y+4], fill=(160, 160, 170))
    elif direction == 2:  # left
        hx = x + 3
        draw.rectangle([hx, body_y+2, hx+2, body_y+14], fill=(100, 80, 60))
        draw.rectangle([hx-2, body_y, hx+4, body_y+4], fill=(160, 160, 170))


def create_spritesheet(palette, extras_fn, filename):
    """Create a 128x192 spritesheet (4 cols × 4 rows, 32x48 each)."""
    fw, fh = 32, 48
    img = Image.new('RGBA', (fw * 4, fh * 4), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    for direction in range(4):  # down, up, left, right
        for frame in range(4):
            x = frame * fw
            y = direction * fh
            bounce = -1 if frame % 2 == 0 else 0
            draw_character(draw, x, y, direction, frame, palette)
            if extras_fn:
                extras_fn(draw, x, y, direction, frame, bounce)
    
    img.save(filename)
    print(f"✅ Created: {filename} ({img.size[0]}x{img.size[1]})")


# === PLAYER: Green tunic adventurer ===
player_palette = {
    'skin': (255, 210, 170),
    'hair': (120, 70, 30),
    'body': (60, 140, 60),     # green tunic
    'body2': (50, 120, 50),
    'legs': (80, 80, 120),     # dark pants
    'shoes': (100, 60, 30),    # brown boots
    'accent': (180, 140, 50),  # gold belt
}

# === WIZARD: Purple robe, white beard ===
wizard_palette = {
    'skin': (240, 210, 190),
    'hair': (200, 200, 200),   # gray
    'body': (100, 50, 160),    # purple robe
    'body2': (80, 40, 140),
    'legs': (90, 45, 150),     # robe continues
    'shoes': (60, 30, 100),
    'accent': (200, 170, 50),  # gold trim
}

# === BLACKSMITH: Brown apron, strong build ===
blacksmith_palette = {
    'skin': (200, 160, 130),
    'hair': (40, 40, 40),      # very dark / bald
    'body': (180, 80, 50),     # red-brown shirt
    'body2': (160, 70, 40),
    'legs': (70, 60, 50),      # dark work pants
    'shoes': (50, 40, 30),     # dark boots
    'accent': (139, 90, 43),   # leather belt
}

# === HERBALIST: Green dress, nature lover ===
herbalist_palette = {
    'skin': (255, 220, 185),
    'hair': (180, 100, 40),    # auburn
    'body': (50, 160, 80),     # green dress
    'body2': (40, 140, 70),
    'legs': (45, 150, 75),     # dress continues
    'shoes': (120, 80, 40),    # sandals
    'accent': (200, 180, 50),  # gold sash
}

# === GUARD: Silver armor, red cape ===
guard_palette = {
    'skin': (220, 185, 155),
    'hair': (50, 40, 35),      # dark brown
    'body': (140, 150, 165),   # silver armor
    'body2': (120, 130, 145),
    'legs': (100, 110, 125),   # armor greaves
    'shoes': (70, 70, 80),     # metal boots
    'accent': (180, 40, 40),   # red belt/sash
}


def draw_herbalist_extras(draw, x, y, direction, frame, bounce):
    """Add herbalist-specific details: flower crown, potion bottle."""
    head_y = y + 4 + bounce
    body_y = head_y + 13

    # Long hair flowing down
    if direction == 0:  # down
        draw.rectangle([x+8, head_y+2, x+11, head_y+16], fill=(180, 100, 40))
        draw.rectangle([x+21, head_y+2, x+24, head_y+16], fill=(180, 100, 40))
    elif direction == 1:  # up
        draw.rectangle([x+8, head_y+2, x+24, head_y+16], fill=(180, 100, 40))

    # Flower crown
    flowers = [(255, 100, 150), (255, 200, 50), (150, 100, 255)]
    draw.rectangle([x+11, head_y-2, x+14, head_y+1], fill=flowers[0])
    draw.rectangle([x+15, head_y-3, x+18, head_y], fill=flowers[1])
    draw.rectangle([x+19, head_y-2, x+22, head_y+1], fill=flowers[2])

    # Potion bottle in hand
    if direction in [0, 3]:  # down or right
        bx = x + 25
        draw.rectangle([bx, body_y+6, bx+3, body_y+12], fill=(50, 200, 100))
        draw.rectangle([bx+1, body_y+4, bx+2, body_y+7], fill=(200, 200, 200))
    elif direction == 2:  # left
        bx = x + 2
        draw.rectangle([bx, body_y+6, bx+3, body_y+12], fill=(50, 200, 100))
        draw.rectangle([bx+1, body_y+4, bx+2, body_y+7], fill=(200, 200, 200))


def draw_guard_extras(draw, x, y, direction, frame, bounce):
    """Add guard-specific details: helmet, shield, cape."""
    head_y = y + 4 + bounce
    body_y = head_y + 13

    # Helmet
    helmet = (140, 150, 165)
    visor = (100, 110, 125)
    draw.rectangle([x+8, head_y-3, x+24, head_y+2], fill=helmet)
    draw.rectangle([x+7, head_y-1, x+25, head_y+4], fill=helmet)
    # Helmet plume (red)
    draw.rectangle([x+14, head_y-6, x+18, head_y-2], fill=(200, 40, 40))

    if direction == 0:  # down - visor
        draw.rectangle([x+10, head_y+3, x+22, head_y+5], fill=visor)

    # Cape (behind body)
    cape = (180, 40, 40)
    if direction == 1:  # up
        draw.rectangle([x+7, body_y, x+25, body_y+16], fill=cape)
    elif direction == 0:  # down - cape peeks from sides
        draw.rectangle([x+5, body_y+4, x+8, body_y+18], fill=cape)
        draw.rectangle([x+24, body_y+4, x+27, body_y+18], fill=cape)

    # Shield (left side)
    if direction in [0, 2]:
        sx = x + 3 if direction == 2 else x + 4
        draw.rectangle([sx, body_y+2, sx+4, body_y+12], fill=(140, 150, 165))
        draw.rectangle([sx+1, body_y+4, sx+3, body_y+10], fill=(200, 40, 40))
        # Cross on shield
        draw.rectangle([sx+2, body_y+5, sx+2, body_y+9], fill=(255, 220, 50))
        draw.rectangle([sx+1, body_y+7, sx+3, body_y+7], fill=(255, 220, 50))
    elif direction == 3:  # right
        sx = x + 24
        draw.rectangle([sx, body_y+2, sx+4, body_y+12], fill=(140, 150, 165))
        draw.rectangle([sx+1, body_y+4, sx+3, body_y+10], fill=(200, 40, 40))


if __name__ == '__main__':
    import os
    out = r'c:\Python Game\game-ui\public\assets\sprites'
    os.makedirs(out, exist_ok=True)

    create_spritesheet(player_palette, None, os.path.join(out, 'player.png'))
    create_spritesheet(wizard_palette, draw_wizard_extras, os.path.join(out, 'wizard.png'))
    create_spritesheet(blacksmith_palette, draw_blacksmith_extras, os.path.join(out, 'blacksmith.png'))
    create_spritesheet(herbalist_palette, draw_herbalist_extras, os.path.join(out, 'herbalist.png'))
    create_spritesheet(guard_palette, draw_guard_extras, os.path.join(out, 'guard.png'))

    # === DRAGON: Larger boss sprite (48x64 per frame) ===
    dragon_fw, dragon_fh = 48, 64
    dragon_img = Image.new('RGBA', (dragon_fw * 4, dragon_fh * 4), (0, 0, 0, 0))
    dd = ImageDraw.Draw(dragon_img)

    for direction in range(4):
        for frame_i in range(4):
            ox = frame_i * dragon_fw
            oy = direction * dragon_fh
            bounce = -2 if frame_i % 2 == 0 else 0
            wing_flap = 4 if frame_i % 2 == 0 else -2

            # Body
            dd.rectangle([ox+14, oy+22+bounce, ox+34, oy+48+bounce], fill=(160, 30, 30))
            # Belly
            dd.rectangle([ox+18, oy+30+bounce, ox+30, oy+46+bounce], fill=(200, 120, 60))
            # Head
            dd.ellipse([ox+12, oy+10+bounce, ox+36, oy+28+bounce], fill=(180, 40, 40))
            # Horns
            dd.rectangle([ox+14, oy+6+bounce, ox+18, oy+14+bounce], fill=(80, 60, 40))
            dd.rectangle([ox+30, oy+6+bounce, ox+34, oy+14+bounce], fill=(80, 60, 40))
            # Eyes
            if direction != 1:
                dd.rectangle([ox+18, oy+16+bounce, ox+22, oy+20+bounce], fill=(255, 200, 0))
                dd.rectangle([ox+26, oy+16+bounce, ox+30, oy+20+bounce], fill=(255, 200, 0))
                dd.rectangle([ox+19, oy+17+bounce, ox+21, oy+19+bounce], fill=(20, 20, 20))
                dd.rectangle([ox+27, oy+17+bounce, ox+29, oy+19+bounce], fill=(20, 20, 20))
            # Mouth / fire
            if direction == 0 and frame_i % 2 == 0:
                dd.rectangle([ox+20, oy+26+bounce, ox+28, oy+30+bounce], fill=(255, 100, 0))
                dd.rectangle([ox+22, oy+30+bounce, ox+26, oy+34+bounce], fill=(255, 200, 0))
            # Wings
            dd.rectangle([ox+4, oy+18+bounce+wing_flap, ox+14, oy+38+bounce+wing_flap], fill=(140, 25, 25))
            dd.rectangle([ox+34, oy+18+bounce+wing_flap, ox+44, oy+38+bounce+wing_flap], fill=(140, 25, 25))
            dd.rectangle([ox+2, oy+20+bounce+wing_flap, ox+8, oy+30+bounce+wing_flap], fill=(120, 20, 20))
            dd.rectangle([ox+40, oy+20+bounce+wing_flap, ox+46, oy+30+bounce+wing_flap], fill=(120, 20, 20))
            # Tail
            if direction in [2, 0]:
                dd.rectangle([ox+34, oy+40+bounce, ox+44, oy+44+bounce], fill=(160, 30, 30))
                dd.rectangle([ox+42, oy+38+bounce, ox+46, oy+42+bounce], fill=(180, 40, 40))
            elif direction in [3, 1]:
                dd.rectangle([ox+4, oy+40+bounce, ox+14, oy+44+bounce], fill=(160, 30, 30))
                dd.rectangle([ox+2, oy+38+bounce, ox+6, oy+42+bounce], fill=(180, 40, 40))
            # Legs
            leg_off = 2 if frame_i % 2 == 0 else -2
            dd.rectangle([ox+16+leg_off, oy+48+bounce, ox+22+leg_off, oy+58+bounce], fill=(130, 25, 25))
            dd.rectangle([ox+26-leg_off, oy+48+bounce, ox+32-leg_off, oy+58+bounce], fill=(130, 25, 25))
            dd.rectangle([ox+16+leg_off, oy+56+bounce, ox+23+leg_off, oy+60+bounce], fill=(80, 60, 40))
            dd.rectangle([ox+25-leg_off, oy+56+bounce, ox+33-leg_off, oy+60+bounce], fill=(80, 60, 40))

    dragon_img.save(os.path.join(out, 'dragon.png'))
    print(f"✅ Created: dragon.png ({dragon_img.size[0]}x{dragon_img.size[1]})")

    print("\n🎮 All character sprites generated!")
