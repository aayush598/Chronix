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
version: "1.1"
likes: 0
shares: 0
---

# 📝 1. Introduction

When you press the **power button** on your computer, a fascinating journey begins. The CPU doesn’t magically know how to load your operating system — instead, it follows a **step-by-step boot process**.  

At the heart of this process lies a small but powerful piece of software: the **bootloader**.  
In this project, we’ll build our own **simple bootloader in x86 Assembly** that can **print messages** and **read data from the disk** using BIOS interrupts.  

---

## 🔹 1.1 What is a Bootloader?

A **bootloader** is the very first program that runs after the computer is powered on.  
It lives in the **boot sector** of a storage device (like a hard disk, floppy disk, or USB drive).

👉 **Key facts about bootloaders:**
- It is only **512 bytes** in size (fits into one disk sector).
- The last two bytes must be the special **boot signature** `0xAA55`.
- Loaded into memory at **address 0x7C00** by the BIOS.
- Its job is to prepare the system and load the next stage (e.g., an operating system or another bootloader).

💡 **Analogy:**  
Think of the bootloader as the **table of contents** of a book.  
It’s the very first page you see, and it tells the system **where to go next**.

---

## 🔹 1.2 Why Do We Need Bootloaders?

Without a bootloader, the CPU wouldn’t know:
- **Where the operating system is stored**
- **How to load it into memory**
- **What to execute next**

Since the BIOS is very limited (it can only perform basic hardware initialization), the bootloader **bridges the gap**:
1. BIOS powers up → runs hardware checks.
2. BIOS loads the **boot sector (first 512 bytes)** from the disk.
3. Bootloader takes over → tells the CPU what to do next.

👉 In modern terms:  
The bootloader is like the **link between your computer’s hardware and your operating system**.

---

## 🔹 1.3 What This Project Will Do (Big Picture)

In this project, we will create a **Stage-1 Bootloader** in Assembly.  
It will:

1. Print a message to the screen.  
   - Example: `"Reading sector 2..."`

2. Use BIOS disk services (`INT 0x13`) to **read one sector from the disk** (other than the boot sector).

3. Print the contents of the loaded sector (which could be text or other data).

📌 **Workflow in Simple Steps:**
```

BIOS  →  Bootloader  →  Reads Sector 2  →  Prints Sector Data

````

👉 By the end, you’ll have a working bootloader that you can run in an emulator and see in action!

---

## 🔹 1.4 Tools Required (NASM, QEMU, Optional: Bochs)

Before we start coding, let’s set up the tools you’ll need.

### 🛠  NASM (Netwide Assembler)
- A popular **assembler** for writing low-level assembly code.
- Converts `.asm` files into raw **binary machine code** that can run directly on hardware/emulators.
- Install:
  - **Linux:** `sudo apt install nasm`
  - **Mac (Homebrew):** `brew install nasm`
  - **Windows:** [Download NASM](https://www.nasm.us/)

---

### 🖥 QEMU (Quick Emulator)
- A **hardware emulator** that lets us run our bootloader in a safe, virtual environment.
- Instead of risking your real computer, you can test everything in QEMU.
- Install:
  - **Linux:** `sudo apt install qemu-system`
  - **Mac:** `brew install qemu`
  - **Windows:** [QEMU Downloads](https://www.qemu.org/)

To run our bootloader:
```bash
qemu-system-i386 -fda boot.bin
````

---

### 🔍 Optional: Bochs

* Another emulator designed for **low-level OS development**.
* Provides detailed debugging features (step-by-step execution, memory inspection).
* Recommended if you want to deeply understand what’s happening inside the CPU.

---

✅ With these tools ready, we can **assemble, run, and debug** our bootloader without touching real hardware.

---


# 📚 2. Background Knowledge (For Beginners)

Before we dive into the actual bootloader code, it’s important to understand some **foundational concepts**.  
If you’re new to low-level programming or operating systems, this section will guide you step by step.

---

## 🔹 2.1 How a Computer Boots: Step-by-Step

When you press the power button:

1. **Power-On Self Test (POST)**  
   - The BIOS (Basic Input/Output System) runs a quick hardware check.  
   - It makes sure memory, CPU, and peripherals are functioning.

2. **BIOS Loads Boot Sector**  
   - BIOS looks for a bootable device (hard disk, floppy, USB).  
   - It reads the **first sector (512 bytes)** from the chosen device into memory at address `0x7C00`.

3. **Bootloader Executes**  
   - CPU jumps to `0x7C00`.  
   - The bootloader takes control and decides what to load next.

4. **Bootloader Loads OS**  
   - The bootloader loads the operating system (or another stage of the bootloader).  

📌 **Boot Sequence Flow**:
```

Power On → BIOS → Boot Sector → Bootloader → Operating System

````

💡 **Analogy:**  
Think of BIOS as a librarian who opens the library in the morning.  
They always fetch the **first page (boot sector)** of a special book and hand it to you.  
That first page (the bootloader) then tells you **which chapter (OS) to go to next**.

---

## 🔹 2.2 Real Mode and 16-bit Assembly Basics

When the CPU first starts, it runs in **Real Mode**:
- **16-bit mode** (only 16-bit instructions and registers are available).
- Memory is accessed using **segment:offset addressing**.
- Limited to the **first 1 MB** of memory (called the "Real Mode memory space").

👉 Registers you’ll see often:
- **AX, BX, CX, DX** → general purpose 16-bit registers.
- **SI, DI, BP, SP** → index and pointer registers.
- **DS, ES, SS, CS** → segment registers (Data, Extra, Stack, Code).
- **IP** → Instruction Pointer (tells CPU the next instruction to execute).

📌 Example:
```asm
mov ax, 0x1234
mov bx, 0x5678
````

Here, `AX` and `BX` hold **different values** that can be used for math, memory addressing, or BIOS calls.

---

## 🔹 2.3 Memory Segmentation and Addressing (DS\:SI, ES\:BX, etc.)

In Real Mode, memory is addressed using a **Segment\:Offset** pair.

👉 Formula:

```
Physical Address = (Segment × 16) + Offset
```

For example:

* `DS = 0x1000` and `SI = 0x0020`
* Physical Address = `(0x1000 × 16) + 0x0020 = 0x10000 + 0x20 = 0x10020`

📌 Common register pairs:

* **DS\:SI** → often used for **strings/data**.
* **ES\:BX** → often used for **disk/memory operations**.
* **CS\:IP** → always points to the **next instruction**.

💡 **Analogy:**
Think of **Segment** as a **building** and **Offset** as a **room number**.
To reach the right room (address), you need both the building number and the room number.

---

## 🔹 2.4 BIOS Interrupts

The BIOS provides ready-made services through **interrupts**.
We can "call" these services using the `int` instruction.

### 📺 INT 0x10 → Display Services

* Used for **printing text** and controlling the screen.
* Example:

  ```asm
  mov ah, 0x0E   ; Teletype output
  mov al, 'A'    ; Character to print
  int 0x10
  ```

  👉 This prints the letter `A` on the screen.

---

### 💾 INT 0x13 → Disk Services

* Used for **reading and writing sectors** on disk.
* Example (Read Sector):

  ```asm
  mov ah, 0x02   ; Read sector function
  mov al, 0x01   ; Number of sectors to read (1)
  mov ch, 0x00   ; Cylinder number
  mov cl, 0x02   ; Sector number (starts at 1)
  mov dh, 0x00   ; Head number
  mov dl, 0x00   ; Drive number (0x00 = floppy, 0x80 = HDD)
  mov bx, 0x0500 ; Buffer offset
  mov es, 0x0000 ; Buffer segment
  int 0x13       ; BIOS call
  ```

👉 This reads **sector 2** into memory at `0000:0500`.

---

## 🔹 2.5 The Boot Sector Layout

A boot sector is the **first 512 bytes** of a storage device.

### 📌 Rules for a valid boot sector:

1. Must be **exactly 512 bytes** (or less, padded with zeros).
2. The **last two bytes** must be the boot signature: `0xAA55`.

```
+---------------------------+
| Bootloader code (510 B)   |
+---------------------------+
| Boot Signature (0xAA55)   |
+---------------------------+
```

👉 Without this signature, the BIOS will **not** treat it as bootable.

---

## 🔹 2.6 Disk Structure (Cylinder, Head, Sector)

Early BIOS disk operations use **CHS (Cylinder-Head-Sector)** addressing.

* **Cylinder (CH):** Vertical stack of tracks.
* **Head (DH):** The read/write head (like the arm of a record player).
* **Sector (CL):** Smallest readable unit on a disk (usually 512 bytes).

📌 Example:
To locate data → BIOS needs (Cylinder, Head, Sector).

---

### 📊 Visual Representation:

**Disk as Cylinders and Heads:**

```
Cylinder 0:
   Head 0 → Sector 1 | Sector 2 | Sector 3 | ...
   Head 1 → Sector 1 | Sector 2 | Sector 3 | ...
Cylinder 1:
   Head 0 → Sector 1 | Sector 2 | Sector 3 | ...
   Head 1 → Sector 1 | Sector 2 | Sector 3 | ...
```

👉 When we say *"Read sector 2 from Cylinder 0, Head 0"* → we mean:

* First cylinder
* First head
* Second sector

💡 Modern disks use **LBA (Logical Block Addressing)**, but BIOS in real mode still works with CHS.

---

✅ With this background knowledge, you’re now ready to dive into the actual source code of the bootloader!


# 💻 3. Source Code Overview

Now that we understand the **boot process** and the **basic concepts**, let’s look at the **source code structure** of our project.  
We’ve split the bootloader into multiple files to make it **modular** and easier to understand.

---

## 🔹 3.1 Project File Structure

Our project consists of **three assembly files**:

```

asm/
├── print.asm           # Printing functions (text output using BIOS)
├── disk\_read.asm       # Disk read function (read sectors using BIOS)
└── stage1\_bootloader.asm  # The main bootloader (entry point, orchestrates everything)

```

### 📄 `print.asm`
- Contains reusable functions for printing:
  - `print_char` → prints a single character.  
  - `print_string` → prints a null-terminated string.  
- Uses **BIOS interrupt 0x10**.

---

### 📄 `disk_read.asm`
- Handles reading data from the disk:
  - Uses **BIOS interrupt 0x13**.
  - Reads a sector into memory at `ES:BX`.
  - Includes simple **error handling** (`"Disk Read Error"`).

---

### 📄 `stage1_bootloader.asm`
- The **boot sector file** (this is the one BIOS loads at `0x7C00`).  
- Responsibilities:
  1. Initialize data segments.
  2. Display a startup message.
  3. Set up parameters for a disk read.
  4. Call `read_sector` (from `disk_read.asm`).
  5. Print the contents of the loaded sector (using `print.asm`).
  6. Loop forever.

---

## 🔹 3.2 How Each File Fits Into the Boot Process

Let’s see how these pieces work together in the bigger picture.

### 🖥 Boot Process Flow with Our Files
```

BIOS
↓ (loads boot sector into memory at 0x7C00)
stage1\_bootloader.asm
↓ (calls print functions)
print.asm
↓ (calls disk read function)
disk\_read.asm
↓
Data from disk loaded into memory (e.g., 0x0500)

```

---

### ⚡ Step-by-Step Explanation
1. **BIOS**  
   - Reads the boot sector (which is our `stage1_bootloader.asm`) into memory at `0x7C00`.

2. **stage1_bootloader.asm (Main Bootloader)**  
   - Runs first.  
   - Prints: `"Reading sector 2..."`.  
   - Sets registers for disk read.  
   - Calls `read_sector`.

3. **disk_read.asm (Disk Function)**  
   - Uses `INT 0x13` to fetch sector data from disk.  
   - Loads it into memory (at address `0x0500`).  
   - Returns control to bootloader.

4. **stage1_bootloader.asm (Back Again)**  
   - Now points `SI` to `0x0500`.  
   - Calls `print_string` from `print.asm`.

5. **print.asm (Print Functions)**  
   - Iterates through characters of the string.  
   - Prints them one by one on the screen using `INT 0x10`.

6. **User Sees Output**  
   - Bootloader message → followed by contents of sector 2.  

---

### 📊 Visual Overview

**Disk Layout:**
```

+-------------+-------------+-------------+
\| Sector 1    | Sector 2    | Sector 3... |
\| Bootloader  | Data/String | More Data   |
+-------------+-------------+-------------+

```

**Memory Layout After Boot:**
```

0x7C00  → stage1\_bootloader.asm  (Bootloader)
0x0500  → Sector 2 loaded here   (Data/String to print)

```

---

✅ At this point, you know:
- The **role of each file**.  
- How they interact during the **boot process**.  
- What happens in both **disk** and **memory** during execution.

Next, we’ll dive **deep into each file** starting with `print.asm` (our printing utilities).


# 🖨 4. Printing Functions (`print.asm`)

One of the first things any programmer wants from their bootloader is the ability to **print text** on the screen.  
In low-level assembly, we don’t have `printf` or `console.log` — instead, we rely on the **BIOS video interrupt (INT 0x10)**.  

To make our code clean and reusable, we separate text output into a dedicated file: **`print.asm`**.

---

## 🔹 4.1 Purpose of Having Reusable Print Functions

Why not just write the printing code directly inside the bootloader?

👉 **Reasons for reusability:**
- Keeps the **bootloader clean** and focused on logic.
- Printing is a **common operation** — we’ll need it for messages, errors, and debugging.
- If we ever want to improve printing (e.g., add colors), we only modify `print.asm`.

💡 Think of `print.asm` as our **toolbox** for text output.

---

## 🔹 4.2 `print_char` Explained (Character Printing with INT 0x10)

The `print_char` function prints a **single character** on the screen.

```asm
print_char:
    ; Input: AL = character to print
    mov ah, 0x0E   ; Teletype output function
    mov bh, 0x00   ; Page number (always 0 in text mode)
    mov bl, 0x07   ; Text attribute (color: light gray on black)
    int 0x10       ; BIOS video interrupt
    ret
````

### 📝 Explanation:

* **AH = 0x0E** → Tells BIOS: *"Use teletype mode (print a character and move cursor forward)"*.
* **AL** → Holds the character we want to print.
* **BH = 0x00** → Page number (we usually stick to page 0).
* **BL = 0x07** → Attribute byte (text color: white/gray on black).
* **INT 0x10** → BIOS service that actually prints the character.

👉 Example:

```asm
mov al, 'H'
call print_char
```

This prints the character **H** on the screen.

---

## 🔹 4.3 `print_string` Explained (String Printing Loop with LODSB)

Printing a single character is nice, but often we want to print **entire messages**.
That’s where `print_string` comes in.

```asm
print_string:
    ; Input: DS:SI → points to null-terminated string
.print_loop:
    lodsb              ; Load byte at DS:SI into AL, then SI++
    cmp al, 0          ; Check if it's the null terminator
    je .done           ; If zero → end of string
    call print_char    ; Otherwise print the character
    jmp .print_loop    ; Repeat for next character
.done:
    ret
```

### 📝 Explanation:

* **DS\:SI** → Points to the string in memory.
* **lodsb** → Loads the current byte into `AL` and automatically advances `SI`.
* **cmp al, 0** → Checks if we reached the end (null terminator).
* **je .done** → If yes, exit.
* **call print\_char** → Otherwise, print the character.
* **jmp .print\_loop** → Continue until finished.

👉 Example:

```asm
mov si, msg        ; Load address of message into SI
call print_string  ; Print the whole string

msg db "Hello, Bootloader!", 0
```

This will print:

```
Hello, Bootloader!
```

---

## 🔹 4.4 Step-by-Step Flow of Printing a Message

Let’s walk through an example:

```asm
mov si, my_message
call print_string

my_message db "Booting from sector...", 0
```

### Execution Flow:

1. `SI` points to the string `"Booting from sector..."`.
2. `lodsb` loads `'B'` into `AL`.

   * `print_char` prints `'B'`.
   * Cursor moves forward.
3. Next iteration → `'o'`, `'o'`, `'t'`, ... until the final `0`.
4. When `AL = 0`, loop ends.

📌 Output on screen:

```
Booting from sector...
```

---

## 🔹 4.5 Example Output in Emulator

If we assemble and run the bootloader in **QEMU**, and it calls our print functions, you should see something like:

```
Reading sector 2...
Disk Read Error (if sector load fails)
```

✅ This confirms that our **printing functions work correctly**.

---

📌 **Summary of This Section**

* `print_char` → prints a single character using `INT 0x10`.
* `print_string` → prints an entire null-terminated string using a loop.
* These functions are reusable across the bootloader and make our code much cleaner.

Next, we’ll look at **disk reading (`disk_read.asm`)**, which allows us to load data from other sectors of the disk.


# 💾 5. Disk Reading Function (`disk_read.asm`)

The bootloader itself fits into the **first sector (512 bytes)** of the disk.  
But what if we want to load more data (like the second sector, which may contain extra code or data)?  

That’s where **BIOS Disk Services** come into play.  
We use **`INT 0x13` (Function 02h)** to **read sectors from disk** into memory.

---

## 🔹 5.1 Introduction to BIOS Disk Read (INT 0x13, Function 02h)

BIOS provides disk operations through **interrupt 0x13**.  
We can use it to read/write sectors using **CHS (Cylinder, Head, Sector) addressing**.

- **AH = 0x02** → Read Sector(s) from Disk  
- **AL** → Number of sectors to read (1–128)  
- **CH, CL, DH** → Identify where on the disk the sector is located  
- **ES:BX** → Destination address in memory  

📌 In short:
> *Tell BIOS which sector you want, and where to put it in memory.*

---

## 🔹 5.2 Inputs and Outputs

Here’s the breakdown of registers for `INT 0x13, AH=0x02`:

| Register | Purpose |
|----------|---------|
| **AH**   | Function number (0x02 = read sector) |
| **AL**   | Number of sectors to read (1 = just one sector) |
| **CH**   | Cylinder number (0–1023) |
| **CL**   | Sector number (1–63) |
| **DH**   | Head number (0–255) |
| **DL**   | Drive number (0x00 = floppy, 0x80 = first hard disk) |
| **ES:BX**| Destination address in memory where data will be loaded |

📌 **On Success:** Carry Flag (CF) is **clear**.  
📌 **On Failure:** Carry Flag (CF) is **set**.

---

## 🔹 5.3 Code Walkthrough Line by Line

Here’s the implementation from our `disk_read.asm`:

```asm
read_sector:
    ; Inputs:
    ;   ES:BX -> destination address
    ;   DL    -> drive number (0x00 = floppy, 0x80 = HDD)
    ;   CH    -> cylinder number (0-1023)
    ;   DH    -> head number
    ;   CL    -> sector number (1-63)
    ; Outputs:
    ;   CF set on failure

    mov ah, 0x02        ; BIOS: Read sector
    mov al, 0x01        ; Read 1 sector
    int 0x13            ; Call BIOS disk interrupt
    jc .fail            ; If Carry Flag set → error
    ret

.fail:
    ; Print "Disk Read Error"
    mov si, read_error_msg
    call print_string
    jmp $               ; Halt forever

read_error_msg db "Disk Read Error", 0
````

### 📝 Step-by-Step:

1. **`mov ah, 0x02`** → Select the “read sector” function.
2. **`mov al, 0x01`** → Request to read **1 sector only**.
3. **`int 0x13`** → BIOS handles the disk access.
4. **`jc .fail`** → If BIOS sets the Carry Flag (CF), something went wrong.
5. On success → `ret` (return to bootloader).
6. On failure → Print `"Disk Read Error"` and halt execution (`jmp $`).

---

## 🔹 5.4 Error Handling (Carry Flag, Printing `"Disk Read Error"`)

The **Carry Flag (CF)** acts as an error indicator:

* **CF = 0** → Success (sector read correctly).
* **CF = 1** → Failure (disk read error).

In case of failure:

```asm
.fail:
    mov si, read_error_msg
    call print_string
    jmp $
```

This displays the message:

```
Disk Read Error
```

…and stops execution forever.

👉 This prevents the CPU from running with **invalid/uninitialized memory data**.

---

## 🔹 5.5 Why Sector Numbering Starts at 1

One confusing thing for beginners:

* Memory addresses start at **0**.
* But disk **sector numbers start at 1** (not 0).

📌 So:

* **Sector 1** = Boot sector (our bootloader).
* **Sector 2** = Next data sector.

👉 If you mistakenly use `CL=0`, the BIOS call will fail.

---

## 🔹 5.6 Practical Example: Reading 1 Sector

Suppose we want to load **sector 2** (from Cylinder 0, Head 0) into memory at `0x0000:0x0500`.

### Example Setup in Bootloader:

```asm
mov dl, 0x00     ; Drive = floppy (0x00)
mov ch, 0x00     ; Cylinder = 0
mov cl, 0x02     ; Sector = 2
mov dh, 0x00     ; Head = 0
mov ax, 0x0000   ; Segment = 0x0000
mov es, ax
mov bx, 0x0500   ; Offset = 0x0500
call read_sector
```

### What happens:

1. BIOS loads sector 2 into **address 0000:0500**.
2. Bootloader can then **read or print** from that memory location.

📌 If sector 2 contains the string `"Hello from sector 2!"`, the bootloader can display it like this:

```asm
mov si, 0x0500
call print_string
```

---

✅ **Summary of This Section**

* `INT 0x13, AH=0x02` lets us read disk sectors.
* We provide CH, CL, DH, DL (location) + ES\:BX (destination).
* BIOS sets **CF flag** to signal success or error.
* **Sector numbering starts at 1**, not 0.
* Our bootloader uses this to load **sector 2 into memory at 0x0500** and then print it.


---

## 🔹 5.7 Memory Layout After Disk Read (Visualization)

When the computer boots:

- BIOS loads the **boot sector** (sector 1) into **`0x7C00`**.
- Our bootloader then calls `read_sector` to load **sector 2** into **`0x0500`**.

Here’s an ASCII diagram of memory after a successful read:

```

+-----------------------------+
\| BIOS Data / IVT (0x0000)    |
+-----------------------------+
\| Sector 2 Data (0x0500)      | ← loaded by read\_sector
\| e.g., "Hello from sector 2" |
+-----------------------------+
\| ...                         |
+-----------------------------+
\| Bootloader (Sector 1)       |
\| Loaded at 0x7C00            |
\| Executes first              |
+-----------------------------+
\| Free memory / stack space   |
\| ...                         |
+-----------------------------+
\| Top of real-mode memory     |

```

📌 Notice how the **bootloader (0x7C00)** and the **loaded sector (0x0500)** are kept in separate locations so they don’t overwrite each other.

This way:
1. The bootloader runs from `0x7C00`.
2. Data/code from sector 2 is safely placed in `0x0500`.
3. The bootloader can **jump to** or **print from** `0x0500`.

---

# ⚙️ 6. Bootloader Logic (`stage1_bootloader.asm`)

The file **`stage1_bootloader.asm`** is the **main bootloader**.  
It is the **first piece of code BIOS executes after loading the boot sector (512 bytes)** into memory at `0x7C00`.

This file orchestrates the flow:
1. Set up memory segments.  
2. Print a startup message.  
3. Read **sector 2** from the disk.  
4. Print the contents of the loaded sector.  
5. Stay in an infinite loop (so CPU doesn’t run into garbage).  

---

## 🔹 6.1 Bootloader Entry Point (`ORG 0x7C00`)

At the top of the file:

```asm
[BITS 16]
[ORG 0x7C00]
````

* **`[BITS 16]`** → We are in **16-bit real mode**.
* **`[ORG 0x7C00]`** → Tells the assembler that BIOS loads this code into memory at address **0x7C00**.

📌 Why `0x7C00`?
That’s the **standard memory address** where BIOS loads the boot sector (first 512 bytes of the disk).

---

## 🔹 6.2 Setting Up Data Segments (DS, ES)

After boot, segment registers are not guaranteed to be `0`.
So, we **clear them** to point to the start of memory (segment `0x0000`):

```asm
xor ax, ax
mov ds, ax
mov es, ax
```

* `xor ax, ax` → Quick way to set `AX = 0`.
* `mov ds, ax` → Data Segment = 0.
* `mov es, ax` → Extra Segment = 0.

📌 This ensures our string addresses and disk buffer will be accessible correctly.

---

## 🔹 6.3 Printing the Startup Message ("Reading sector 2...")

Before reading from disk, we display a helpful message:

```asm
mov si, msg
call print_string

msg db "Reading sector 2...", 0
```

* `mov si, msg` → `SI` points to the string.
* `call print_string` → Calls the function from **`print.asm`**.
* The message is displayed using BIOS **INT 0x10**.

✅ At this point, you’ll see:

```
Reading sector 2...
```

---

## 🔹 6.4 Preparing Registers for Disk Read (Drive, Cylinder, Head, Sector)

Now we tell BIOS which sector to load:

```asm
mov dl, 0x00     ; Drive = floppy disk (0x00)
mov ch, 0x00     ; Cylinder = 0
mov cl, 0x02     ; Sector = 2 (important: starts at 1, not 0)
mov dh, 0x00     ; Head = 0
```

📌 Meaning:

* We want to load **sector 2** from the first floppy disk (`DL=0`).
* This is where we placed our **data/string**.

---

## 🔹 6.5 Loading Sector 2 into Memory (Destination = 0x0000:0500)

Next, we prepare the memory location to load into:

```asm
mov ax, 0x0000   ; Segment = 0x0000
mov es, ax
mov bx, 0x0500   ; Offset = 0x0500
call read_sector
```

* `ES:BX = 0x0000:0500` → Destination in memory.
* Calls `read_sector` from **`disk_read.asm`**.

👉 BIOS loads **sector 2** into **address 0000:0500**.

---

## 🔹 6.6 Printing the Loaded Data (from 0x0500)

Now that sector 2 is in memory, we print it:

```asm
mov si, 0x0500
call print_string
```

* `SI = 0x0500` → Points to the loaded data.
* `print_string` → Displays it character by character.

✅ If sector 2 contained `"Hello from sector 2!"`, the screen shows:

```
Reading sector 2...
Hello from sector 2!
```

---

## 🔹 6.7 Endless Loop at End (`jmp $`) and Why It’s Needed

At the end of the bootloader:

```asm
jmp $
```

* `jmp $` → Jumps to the **current instruction**, forever.
* This creates an **infinite loop**.

📌 Why?
Without this, the CPU would continue executing whatever bytes come after the bootloader in memory (random garbage).
That would cause crashes or unpredictable behavior.

---

## 🔹 6.8 Boot Signature (`dw 0xAA55`)

The very last line:

```asm
times 510 - ($ - $$) db 0
dw 0xAA55
```

* **`times ... db 0`** → Pads the file with zeroes until it’s **510 bytes** long.
* **`dw 0xAA55`** → Writes the magic **boot signature** at the last 2 bytes.

📌 Why is this important?

* BIOS checks the last two bytes of the first sector.
* If it finds `0x55AA` (note little-endian order), it knows the sector is bootable.
* Otherwise, BIOS skips it and tries another device.

---

## 📊 Visual Summary of Bootloader Flow

```
BIOS loads boot sector (512 bytes) → 0x7C00
          ↓
stage1_bootloader.asm starts
          ↓
Print "Reading sector 2..."
          ↓
Setup registers for disk read
          ↓
Load sector 2 → Memory 0x0500
          ↓
Print contents at 0x0500
          ↓
Stay in infinite loop (jmp $)
```

✅ That’s the complete flow of our **stage 1 bootloader**.

---



# 🔗 7. How It All Fits Together

Now that we’ve studied each part of the code separately, let’s put it all together.  
This section will show the **full flow of execution** with diagrams of **disk layout**, **memory layout**, and an **execution flowchart**.

---

## 🔹 7.1 Flow of Execution

Here’s the high-level step-by-step process:

1. **BIOS starts**  
   - Runs after power-on.  
   - Loads the **first sector** (boot sector) from the boot device (floppy/HDD) into **memory at 0x7C00**.  
   - Jumps to that memory location.

2. **Bootloader (`stage1_bootloader.asm`) runs**  
   - Sets up segment registers (`DS`, `ES`).  
   - Prints a startup message (`"Reading sector 2..."`).  
   - Prepares registers for disk read (Drive, Cylinder, Head, Sector).  
   - Calls the `read_sector` function.

3. **Disk read function (`disk_read.asm`)**  
   - Uses BIOS **INT 0x13** to read **sector 2** from disk.  
   - Loads it into memory at **0x0500**.  
   - Returns control to bootloader.

4. **Back to Bootloader**  
   - Sets `SI` to `0x0500`.  
   - Calls `print_string` from `print.asm`.

5. **Print function (`print.asm`)**  
   - Iterates through characters at `0x0500`.  
   - Prints them one by one using BIOS **INT 0x10**.  

6. **Endless loop**  
   - Bootloader enters `jmp $`.  
   - Prevents CPU from running into random memory.

✅ At this point, the user sees:
```

Reading sector 2...
\<contents of sector 2>

```

---

## 🔹 7.2 Disk Layout Diagram

Let’s visualize how the disk is structured:

```

+-----------------------+-----------------------+-----------------------+
\| Sector 1 (Bootloader) | Sector 2 (Data/Text) | Sector 3+ (Unused...) |
\| stage1\_bootloader.asm | "Hello from sector 2" | ...                   |
+-----------------------+-----------------------+-----------------------+

```

- **Sector 1** → Bootloader (512 bytes, ends with `0xAA55`).  
- **Sector 2** → The data we want to load and display.  

---

## 🔹 7.3 Memory Layout Diagram

When BIOS and our bootloader run, memory looks like this:

```

+----------------------------------------------------+
\| 0x7C00 → Bootloader (Sector 1, stage1\_bootloader)  |
\|                                                    |
\| 0x0500 → Loaded Data (Sector 2, string to print)   |
\|                                                    |
\| Other memory (free / unused)                       |
+----------------------------------------------------+

```

- Bootloader always starts at **0x7C00**.  
- We tell BIOS to load sector 2 into **0x0500**.  
- Later, we print the string stored at `0x0500`.

---

## 🔹 7.4 Execution Flowchart

Here’s a simplified flowchart to tie it all together:

```

┌──────────┐
│   Power  │
│   On     │
└─────┬────┘
↓
┌────────────┐
│    BIOS    │
│ Loads 1st  │
│ sector @   │
│   0x7C00   │
└─────┬──────┘
↓
┌───────────────┐
│ Bootloader @  │
│ 0x7C00        │
│ Print msg     │
└─────┬─────────┘
↓
┌───────────────┐
│ Disk Read fn  │
│ INT 13h →     │
│ Load sector 2 │
│ → 0x0500      │
└─────┬─────────┘
↓
┌───────────────┐
│ Print Data    │
│ from 0x0500   │
└─────┬─────────┘
↓
┌───────────────┐
│ Endless Loop  │
│ (jmp \$)       │
└───────────────┘

```

---

✅ With this, you can now **see the entire journey**:  
From **power-on → BIOS → boot sector → bootloader → disk read → print → loop**.  

This is the **essence of how bootloaders work** at a very low level.


# ⚙️ 8. Running the Project

Now that we’ve written and understood the bootloader, let’s **assemble it and run it** inside an emulator.  
We’ll use **NASM** to compile the assembly code and **QEMU** to run it.  

---

## 🔹 8.1 Assembling with NASM

Our bootloader is written in assembly (`.asm`), so we need to convert it into a **raw binary file** (`.bin`) that BIOS can load.

Run this command in your terminal:

```bash
nasm -f bin asm/stage1_bootloader.asm -o boot.bin
````

Explanation:

* `nasm` → The assembler we’re using.
* `-f bin` → Output format is **flat binary** (no headers, exactly what BIOS expects).
* `asm/stage1_bootloader.asm` → The source file (our bootloader).
* `-o boot.bin` → Output file will be `boot.bin`.

👉 `boot.bin` is exactly **512 bytes**, containing both the code and the boot signature (`0xAA55`).

---

## 🔹 8.2 Running in QEMU

To test the bootloader, run:

```bash
qemu-system-i386 -fda boot.bin
```

Explanation:

* `qemu-system-i386` → Runs QEMU in 32-bit x86 emulation mode.
* `-fda boot.bin` → Loads `boot.bin` as a **floppy disk image**.

👉 QEMU will start as if a real PC is booting from a floppy containing our bootloader.

---

## 🔹 8.3 Expected Output

If everything worked, you should see this in the QEMU window:

```
Reading sector 2...
Hello from sector 2!
```

* First line → Printed by the bootloader itself.
* Second line → Loaded from **disk sector 2** into memory and then printed.

If you see **“Disk Read Error”**, it means:

* The sector read failed, OR
* The image doesn’t contain valid data in sector 2.

---

## 🔹 8.4 Modifying and Rebuilding

Now comes the fun part 🎉 — **experimenting!**

### ✏️ Change the Boot Message

Open `stage1_bootloader.asm` and modify:

```asm
msg db "Reading sector 2...", 0
```

to:

```asm
msg db "Custom Bootloader Message!", 0
```

Reassemble and rerun:

```bash
nasm -f bin asm/stage1_bootloader.asm -o boot.bin
qemu-system-i386 -fda boot.bin
```

---

### ✏️ Change Sector Number

Currently, the bootloader reads **sector 2**:

```asm
mov cl, 0x02   ; Sector number
```

Change it to `0x03` to read sector 3 instead.

⚠️ Remember: If you change the sector number, you must put data in that sector using a disk image editor or custom tools.

---

### ✏️ Experiment with Data in Sector 2

* You can write your own string into **sector 2** of the disk image.
* When the bootloader runs, it will print whatever you placed there.

This makes it feel like a **tiny file system** — though very primitive.

---

✅ At this point, you’ve not only **built a bootloader**, but you’ve also **run it on an emulator** and started customizing it.
This is the **foundation of OS development** 🚀


# 🛠️ 9. Troubleshooting & Common Errors

Even though our bootloader is small, beginners often run into a few common problems when assembling or running it.  
Here’s a quick **guide to debugging** so you don’t get stuck.

---

## 🔹 9.1 Black Screen in QEMU
**Problem:** QEMU opens but shows nothing (just a black window).  

✅ Possible Causes:
- The bootloader didn’t assemble correctly.  
- The final `boot.bin` is not exactly **512 bytes**.  
- Missing boot signature (`0xAA55`).  

🔧 Fix:
1. Check file size:
   ```bash
   ls -l boot.bin
````

It should be **512 bytes**.
2\. If it’s not, make sure the last lines in your `stage1_bootloader.asm` are:

```asm
times 510 - ($ - $$) db 0
dw 0xAA55
```

---

## 🔹 9.2 “Disk Read Error” Message

**Problem:** You see:

```
Disk Read Error
```

✅ Possible Causes:

* The sector you’re trying to read doesn’t exist.
* Wrong sector number (`CL` must be ≥ 1, not 0).
* No data in that sector.

🔧 Fix:

* Double-check:

  ```asm
  mov cl, 0x02   ; Sector 2 (must start from 1)
  ```
* Ensure your disk actually contains data in sector 2.
  By default, `boot.bin` only has the boot sector (sector 1). You’ll need to append or create more sectors with data.

---

## 🔹 9.3 “Hello from sector 2!” Not Showing

**Problem:** Bootloader runs, but doesn’t print the second message.

✅ Possible Causes:

* The memory pointer isn’t correct.
* Nothing valid in memory at `0x0500`.

🔧 Fix:

* Confirm that your disk image actually has text at **sector 2**.
* You can add a string to sector 2 by creating a file like this:

  ```bash
  echo -n "Hello from sector 2!" > sector2.bin
  ```

  Then merge it with your bootloader:

  ```bash
  cat boot.bin sector2.bin > floppy.img
  qemu-system-i386 -fda floppy.img
  ```

---

## 🔹 9.4 NASM: “file not found” Errors

**Problem:** NASM says:

```
asm/print.asm: No such file or directory
```

✅ Fix:

* Make sure your folder structure is:

  ```
  asm/
   ├── print.asm
   ├── disk_read.asm
   └── stage1_bootloader.asm
  ```
* Use correct relative paths in `stage1_bootloader.asm`:

  ```asm
  %include "asm/print.asm"
  %include "asm/disk_read.asm"
  ```

---

## 🔹 9.5 General Debugging Tips

* Add **extra print messages** to see where code stops.
* Use `jmp $` (infinite loop) to “pause” at checkpoints.
* Remember that BIOS expects **exactly 512 bytes** for a boot sector.

---

✅ With these fixes, you should be able to solve **95% of beginner errors** when running your bootloader!


# 🏁 10. Conclusion

Congratulations 🎉 — you’ve just built and run your very first bootloader!  
Even though it’s small (only **512 bytes**), it contains all the essential ideas that real operating systems are built upon.  

Let’s recap what you’ve learned and look at where you can go from here.

---

## 🔹 10.1 What You’ve Learned

By walking through this project step by step, you now understand:

✅ **BIOS interrupts**  
- `INT 0x10` → Used for screen output (printing characters and strings).  
- `INT 0x13` → Used for disk access (reading sectors into memory).  

✅ **Reusable printing functions**  
- How to write modular assembly routines (`print_char`, `print_string`).  

✅ **Disk reading basics**  
- Reading raw sectors using BIOS services.  
- Error handling with the **carry flag** and custom error messages.  

✅ **Boot sector fundamentals**  
- A boot sector must be **512 bytes**.  
- It must end with the **boot signature** (`0xAA55`).  
- BIOS loads it at memory address **0x7C00** and executes it.  

✅ **Bootloader logic**  
- Setting up data segments.  
- Printing a startup message.  
- Loading sector 2 into memory at `0x0500`.  
- Printing what was read from disk.  

In short, you’ve built a minimal but **fully functional bootloader** — the first step in writing your own operating system.

---

## 🔹 10.2 How This Relates to Modern Operating Systems

You might be wondering: *“But modern computers use UEFI, 64-bit CPUs, SSDs… how does this tiny 16-bit bootloader matter today?”*  

Here’s why it’s still important:

- **All operating systems need to boot somehow.**  
  Even today, the very first instructions (in BIOS or UEFI mode) must load something small and simple into memory.  

- **The bootloader bridges hardware and software.**  
  It’s the critical piece that initializes the system and loads the more complex OS kernel.  

- **Learning fundamentals never goes out of style.**  
  By understanding BIOS interrupts, memory layout, and disk sectors, you’re building a foundation that applies to both **legacy BIOS** and **modern bootloaders** like GRUB or UEFI stubs.

In fact, big projects like Linux and Windows ultimately rely on the **same principles** you’ve just explored — only at a much larger scale.

---

## 🔹 10.3 Next Steps and Extensions

Now that you have a working bootloader, here are some exciting directions to extend it:

### 📖 1. Loading Multiple Sectors
Right now, we only read **one sector**.  
Try modifying the `read_sector` code to load **several sectors** into memory.  
This will let you store more complex programs beyond 512 bytes.

---

### 📖 2. Writing a Stage-2 Bootloader
A typical OS boot process uses:
- **Stage 1 bootloader** (the one you just built).  
- **Stage 2 bootloader** (a bigger, more advanced loader stored in later disk sectors).  

Your Stage-1 can load Stage-2, which can then load your OS kernel.  
This is how Linux, Windows, and GRUB work.

---

### 📖 3. Adding User Input (Keyboard Interrupts)
So far, your bootloader prints text and reads from disk.  
Next, add **keyboard support** using `INT 0x16`.  

Example:
```asm
mov ah, 0x00   ; Wait for keypress
int 0x16       ; Result → AL = key pressed
````

This opens the door to making **interactive boot menus** or simple text-based programs.

---

✅ From here, you can expand into **protected mode**, **32-bit/64-bit assembly**, and eventually writing your own **tiny operating system kernel**.

Your journey has just begun 🚀


# 📚 11. Appendix (Optional)

This section serves as a handy reference — containing the full source code, quick notes on BIOS interrupts, important terminology, and resources for further study.  

---

## 🔹 11.1 Full Source Code Listing

Here are all the files used in this project:

### `asm/print.asm`
```asm
; print.asm
; Reusable BIOS printing functions

[BITS 16]

print_char:
    ; Input: AL = character to print
    mov ah, 0x0E
    mov bh, 0x00
    mov bl, 0x07
    int 0x10
    ret

print_string:
    ; Input: DS:SI points to null-terminated string
.print_loop:
    lodsb
    cmp al, 0
    je .done
    call print_char
    jmp .print_loop
.done:
    ret
````

---

### `asm/disk_read.asm`

```asm
; disk_read.asm
; Read one sector from disk using BIOS INT 13h

[BITS 16]

read_sector:
    ; Inputs:
    ;   ES:BX -> destination address
    ;   DL    -> drive number (0x00 = floppy, 0x80 = HDD)
    ;   CH    -> cylinder number (0-1023)
    ;   DH    -> head number
    ;   CL    -> sector number (1-63)
    ; Outputs:
    ;   CF set on failure

    mov ah, 0x02        ; BIOS read sector
    mov al, 0x01        ; Read 1 sector
    int 0x13
    jc .fail            ; Jump if carry flag set (error)
    ret

.fail:
    ; Print "Disk Read Error"
    mov si, read_error_msg
    call print_string
    jmp $

read_error_msg db "Disk Read Error", 0
```

---

### `asm/stage1_bootloader.asm`

```asm
[BITS 16]
[ORG 0x7C00]

start:
    xor ax, ax
    mov ds, ax
    mov es, ax

    ; Display message
    mov si, msg
    call print_string

    ; Setup ES:BX = 0x0000:0500
    mov ax, 0x0000
    mov es, ax
    mov bx, 0x0500

    ; Read sector 2 (CH=0, CL=2, DH=0)
    mov dl, 0x00     ; Floppy (for QEMU)
    mov ch, 0x00     ; Cylinder
    mov cl, 0x02     ; Sector number (1-based)
    mov dh, 0x00     ; Head
    call read_sector

    ; Print what was loaded at 0x0500
    mov si, 0x0500
    call print_string

    jmp $

msg db "Reading sector 2...", 0

%include "asm/print.asm"
%include "asm/disk_read.asm"

times 510 - ($ - $$) db 0
dw 0xAA55
```

---

## 🔹 11.2 Quick Reference: BIOS Interrupts Used

### `INT 0x10` → Video Services

* **AH = 0x0E** → Print character (teletype mode).

  * Input: `AL = character`, `BH = page`, `BL = color`.

### `INT 0x13` → Disk Services

* **AH = 0x02** → Read sectors.

  * Input:

    * `AL = number of sectors`
    * `CH = cylinder`
    * `CL = sector number` (1–63)
    * `DH = head`
    * `DL = drive (0x00 = floppy, 0x80 = HDD)`
    * `ES:BX = buffer address`
  * Output: Carry Flag (CF) set on error.

### `INT 0x16` (not used here, but useful later) → Keyboard Services

* **AH = 0x00** → Wait for keypress, return in `AL`.

---

## 🔹 11.3 Glossary of Terms

* **Bootloader** → A small program (usually 512 bytes) that BIOS loads and executes when a computer starts.
* **Sector** → The smallest unit of data on a disk (usually 512 bytes).
* **Cylinder / Head / Sector (CHS)** → Old addressing system for disks:

  * **Cylinder** → Tracks stacked vertically on the platter.
  * **Head** → The read/write head for a specific platter side.
  * **Sector** → A 512-byte slice of a track.
* **Segment\:Offset (e.g., DS\:SI, ES\:BX)** → Memory addressing scheme in real mode.
* **BIOS** → Basic Input/Output System, firmware that initializes hardware and loads the boot sector.
* **Boot Signature (0xAA55)** → The magic number at the end of a boot sector. BIOS requires this to recognize the sector as bootable.

---

## 🔹 11.4 Recommended Reading & Resources

Here are some excellent references if you want to go deeper:

* 📘 **[OSDev Wiki](https://wiki.osdev.org/)** → The go-to resource for OS developers.
* 📘 **[NASM Documentation](https://www.nasm.us/doc/)** → Official NASM assembler docs.
* 📘 **[BIOS Interrupt List (Ralf Brown’s)](http://www.ctyme.com/rbrown.htm)** → Complete list of interrupts.
* 📘 **[QEMU Manual](https://www.qemu.org/docs/master/)** → Learn how to emulate different systems.
* 📘 **[Little OS Book](https://littleosbook.github.io/)** → A beginner-friendly OS development book.
* 📘 **“Operating Systems: From 0 to 1” (GitHub)** → Free book teaching OS development step by step.

---

✅ With this appendix, you now have:

* Full source code in one place,
* A quick interrupt reference,
* Key definitions,
* And links to continue learning.

This ensures your bootloader project guide is **self-contained, practical, and beginner-friendly** 🚀
