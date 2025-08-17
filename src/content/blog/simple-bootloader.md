---
title: "Writing a Minimal x86 Bootloader: Disk Reads with BIOS Interrupts"
description: "Step-by-step guide to building a simple bootloader in x86 assembly that prints messages and reads disk sectors using BIOS interrupts."
pubDate: "2025-08-18"
category: "Bootloader"
author:
  name: "Aayush Gid"
  bio: "Systems Programmer & Low-Level Computing Enthusiast"
  avatar: "/author.jpg"
tags: ["bootloader", "assembly", "x86", "osdev", "bios", "low-level"]
readTime: 15
version: "1.0"
likes: 0
shares: 0
---

# Building a Minimal x86 Bootloader (with BIOS Disk Read)

This project demonstrates how to write a **simple bootloader in x86 assembly** that:
- Prints messages to the screen using BIOS interrupts.
- Reads a sector from disk using BIOS **INT 13h**.
- Displays the contents of that sector.

It’s a great starting point for anyone exploring **low-level OS development** and understanding how a computer boots from raw assembly.

---

## 📂 Project Structure

```

asm/
├── stage1\_bootloader.asm   # The actual bootloader (512 bytes, loaded at 0x7C00)
├── print.asm               # Reusable printing functions
└── disk\_read.asm           # BIOS disk read routine

````

---

## ⚙️ Boot Process Recap

When a computer boots:
1. The BIOS runs and looks for a **bootable device** (floppy, HDD, USB, etc.).
2. It loads the **first 512 bytes** (the boot sector) of that device into memory at `0x7C00`.
3. Execution begins at that address.

Our bootloader lives in those **512 bytes**. It must end with the **boot signature** `0xAA55`.

---

## 📝 Code Walkthrough

### 1. `print.asm` – Printing to Screen
This file provides two helper routines:

- **print_char**
  ```asm
  mov ah, 0x0E      ; BIOS teletype mode
  int 0x10          ; Print character in AL
  ```

Prints a single character using BIOS interrupt `INT 10h`.

* **print_string**

  ```asm
  lodsb             ; Load byte from DS:SI into AL
  cmp al, 0         ; End of string?
  je .done
  call print_char   ; Print character
  jmp .print_loop
  ```

  Loops through a null-terminated string and prints it character by character.

---

### 2. `disk_read.asm` – Reading a Sector

This file defines `read_sector`, which uses **BIOS INT 13h** to read disk sectors.

Key registers:

* `AH = 0x02` → Read function.
* `AL = 0x01` → Number of sectors to read.
* `ES:BX` → Memory destination for data.
* `DL` → Drive number (`0x00` = floppy, `0x80` = HDD).
* `CH, DH, CL` → Cylinder, Head, Sector (CHS addressing).

If an error occurs:

```asm
jc .fail        ; Jump if carry flag set
```

It prints **"Disk Read Error"** using `print_string`.

---

### 3. `stage1_bootloader.asm` – The Bootloader

This is the main boot sector (loaded at `0x7C00`).

Steps:

1. **Setup segments**

   ```asm
   xor ax, ax
   mov ds, ax
   mov es, ax
   ```

2. **Print message**

   ```asm
   mov si, msg
   call print_string
   ```

3. **Prepare memory buffer (0x0000:0x0500)**

   ```asm
   mov es, 0x0000
   mov bx, 0x0500
   ```

4. **Read sector 2 from floppy**

   ```asm
   mov dl, 0x00   ; Drive 0 (floppy for QEMU)
   mov ch, 0x00   ; Cylinder
   mov cl, 0x02   ; Sector 2
   mov dh, 0x00   ; Head 0
   call read_sector
   ```

5. **Print what was loaded**

   ```asm
   mov si, 0x0500
   call print_string
   ```

6. **Endless loop**

   ```asm
   jmp $
   ```

7. **Boot signature**

   ```asm
   times 510 - ($ - $$) db 0
   dw 0xAA55
   ```

---

## 🛠️ Building & Running

### 1. Assemble

Use **NASM** to assemble the bootloader:

```bash
nasm -f bin asm/stage1_bootloader.asm -o bootloader.bin
```

### 2. Run with QEMU

Boot the binary in an emulator:

```bash
qemu-system-i386 -fda bootloader.bin
```

This emulates a floppy (`-fda`) with your bootloader.

---

## 🎯 What You’ll See

1. The bootloader prints:

   ```
   Reading sector 2...
   ```
2. It then attempts to load **sector 2** into memory at `0x0500`.
3. If that sector contains a string (e.g., `"Hello from sector 2!"`), it will be printed.
4. If the read fails, you’ll see:

   ```
   Disk Read Error
   ```

---

## 🔮 Next Steps

Now that you can:

* Print messages with BIOS.
* Read raw disk sectors.

You can extend the bootloader by:

* Loading multiple sectors.
* Implementing a simple filesystem parser (e.g., FAT12).
* Jumping to loaded code (second stage bootloader).
* Eventually booting your own mini OS kernel.

---

## 📚 References

* [OSDev Wiki – Bootloaders](https://wiki.osdev.org/Bootloader)
* [BIOS Interrupts](https://wiki.osdev.org/BIOS)
* [NASM Manual](https://www.nasm.us/doc/)

---

## ⚡ Summary

This project shows how little code is required to:

* Boot a computer.
* Print text using BIOS.
* Read data from disk.

From here, you have the **foundation of an operating system** 🎉

