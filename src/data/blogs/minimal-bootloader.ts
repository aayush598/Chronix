import { Blog } from '../../types/blog';
import { authors } from '../authors';

export const interactiveReactTypescriptComponents: Blog = {
  id: '1',
  title: 'Writing a Minimal x86 Bootloader: Disk Reads with BIOS Interrupts',
  slug: 'simple-bootloader',
  excerpt: 'Step-by-step guide to building a simple bootloader in x86 assembly that prints messages and reads disk sectors using BIOS interrupts.',
  content: [
    { id: '1', type: 'heading', content: { level: 1, text: '1. Introduction' } },
    {
      id: '2',
      type: 'text',
      content:
        'When you press the power button, the CPU does not automatically know how to load your operating system. Instead, it follows a defined boot process. At the heart of this process is a small but powerful program: the bootloader. In this project, you will build a simple Stage-1 bootloader in x86 assembly that prints messages and reads a disk sector via BIOS interrupts.'
    },
    { id: '3', type: 'heading', content: { level: 2, text: '1.1 What is a Bootloader?' } },
    {
      id: '4',
      type: 'text',
      content:
        'A bootloader is the first program that runs after power-on. It resides in the boot sector (the first 512-byte sector) of a bootable device and is loaded by the BIOS to 0x7C00. A valid boot sector ends with the signature 0xAA55. Its role is to prepare the system and load the next stage (e.g., an OS or another bootloader).'
    },
    {
      id: '5',
      type: 'callout',
      content: {
        type: 'info',
        title: 'Analogy',
        message:
          'Think of the bootloader as the table of contents of a book—it’s the first thing you see and it points the system to what comes next.'
      }
    },
    { id: '6', type: 'heading', content: { level: 2, text: '1.2 Why Bootloaders Matter' } },
    {
      id: '7',
      type: 'text',
      content:
        'Without a bootloader, the CPU would not know where the operating system is stored, how to load it into memory, or what to execute next. The BIOS performs basic hardware initialization and loads the boot sector; the bootloader then takes over and directs execution.'
    },
    { id: '8', type: 'heading', content: { level: 2, text: '1.3 What You Will Build' } },
    {
      id: '9',
      type: 'text',
      content:
        'You will create a Stage-1 bootloader that prints a message, uses BIOS disk services (INT 0x13) to read one sector (not the boot sector), and then prints the loaded sector’s contents.'
    },
    {
      id: '10',
      type: 'list',
      content: {
        type: 'unordered',
        items: [
          'BIOS → loads boot sector to 0x7C00',
          'Bootloader → reads Sector 2 using INT 0x13',
          'Bootloader → prints data from memory'
        ]
      }
    },
    { id: '11', type: 'heading', content: { level: 2, text: '1.4 Tools Required' } },
    {
      id: '12',
      type: 'list',
      content: {
        type: 'unordered',
        items: [
          'NASM (assembler): Linux `sudo apt install nasm`, macOS `brew install nasm`, Windows: download NASM.',
          'QEMU (emulator): Linux `sudo apt install qemu-system`, macOS `brew install qemu`, Windows: QEMU downloads.',
          'Optional: Bochs for detailed low-level debugging.'
        ]
      }
    },
    {
      id: '13',
      type: 'code',
      content: {
        language: 'bash',
        code: 'qemu-system-i386 -fda boot.bin'
      }
    },

    { id: '20', type: 'heading', content: { level: 1, text: '2. Background Knowledge (For Beginners)' } },
    { id: '21', type: 'heading', content: { level: 2, text: '2.1 How a Computer Boots' } },
    {
      id: '22',
      type: 'list',
      content: {
        type: 'unordered',
        items: [
          'POST: BIOS performs hardware checks.',
          'BIOS loads the first 512-byte sector to 0x7C00.',
          'CPU jumps to 0x7C00 and executes the bootloader.',
          'Bootloader prepares and loads the next stage or OS.'
        ]
      }
    },
    { id: '23', type: 'heading', content: { level: 2, text: '2.2 Real Mode and 16-bit Basics' } },
    {
      id: '24',
      type: 'text',
      content:
        'At reset, the CPU runs in 16-bit Real Mode with segment:offset addressing and access to the first 1 MB. Common registers include AX, BX, CX, DX, SI, DI, BP, SP, and segment registers DS, ES, SS, CS with IP as the instruction pointer.'
    },
    { id: '25', type: 'heading', content: { level: 2, text: '2.3 Segmentation and Addressing' } },
    {
      id: '26',
      type: 'text',
      content:
        'Physical Address = (Segment × 16) + Offset. Common pairs: DS:SI for strings/data, ES:BX for disk/memory buffers, CS:IP for code.'
    },
    { id: '27', type: 'heading', content: { level: 2, text: '2.4 BIOS Interrupts Overview' } },
    {
      id: '28',
      type: 'text',
      content:
        'INT 0x10 (video) for printing characters; INT 0x13 (disk) for sector I/O. These services are invoked via the `int` instruction with function parameters in registers.'
    },
    {
      id: '29',
      type: 'code',
      content: {
        language: 'asm',
        code:
          "; Print 'A'\nmov ah, 0x0E\nmov al, 'A'\nint 0x10\n\n; Read one sector\nmov ah, 0x02\nmov al, 0x01\nmov ch, 0x00\nmov cl, 0x02\nmov dh, 0x00\nmov dl, 0x00\nmov bx, 0x0500\nmov es, 0x0000\nint 0x13"
      }
    },
    { id: '30', type: 'heading', content: { level: 2, text: '2.5 Boot Sector Rules and Disk Structure' } },
    {
      id: '31',
      type: 'text',
      content:
        'A boot sector is 512 bytes and must end with 0xAA55. Legacy BIOS uses CHS (Cylinder, Head, Sector) addressing; sector numbering starts at 1. Modern disks use LBA, but we will use CHS with BIOS services in Real Mode.'
    },

    { id: '40', type: 'heading', content: { level: 1, text: '3.Source Code Overview' } },
    { id: '41', type: 'heading', content: { level: 2, text: '3.1  Structure' } },
    {
      id: '42',
      type: 'code',
      content: {
        language: 'text',
        code:
          'asm/\n├── print.asm              # BIOS-based text output\n├── disk_read.asm          # Reads sectors via INT 13h\n└── stage1_bootloader.asm  # Entry point boot sector'
      }
    },
    {
      id: '43',
      type: 'text',
      content:
        '• print.asm provides reusable `print_char` and `print_string` using INT 0x10. • disk_read.asm implements `read_sector` using INT 0x13 with minimal error handling. • stage1_bootloader.asm initializes segments, prints a message, reads sector 2 into memory (e.g., 0x0500), prints its contents, then loops forever.'
    },

    { id: '50', type: 'heading', content: { level: 1, text: '4.Printing Functions (print.asm)' } },
    { id: '51', type: 'heading', content: { level: 2, text: '4.1 Why Reusable Print Routines' } },
    {
      id: '52',
      type: 'text',
      content:
        'Separating printing keeps the bootloader focused, enables reuse for messages and errors, and makes future enhancements (like colors) localized.'
    },
    { id: '53', type: 'heading', content: { level: 2, text: '4.2 print_char (INT 0x10 Teletype)' } },
    {
      id: '54',
      type: 'code',
      content: {
        language: 'asm',
        code:
          'print_char:\n    ; AL = character\n    mov ah, 0x0E\n    mov bh, 0x00\n    mov bl, 0x07\n    int 0x10\n    ret'
      }
    },
    { id: '55', type: 'heading', content: { level: 2, text: '4.3 print_string (Null-Terminated Strings)' } },
    {
      id: '56',
      type: 'code',
      content: {
        language: 'asm',
        code:
          'print_string:\n    ; DS:SI -> null-terminated string\n.print_loop:\n    lodsb\n    cmp al, 0\n    je .done\n    call print_char\n    jmp .print_loop\n.done:\n    ret'
      }
    },

    { id: '60', type: 'heading', content: { level: 1, text: '5.Disk Reading Function (disk_read.asm)' } },
    { id: '61', type: 'heading', content: { level: 2, text: '5.1 INT 0x13, AH=0x02' } },
    {
      id: '62',
      type: 'text',
      content:
        'INT 0x13 (AH=0x02) reads sectors using CHS. Inputs: AL (count), CH/CL/DH (location), DL (drive), ES:BX (destination). CF clear on success, set on failure.'
    },
    { id: '63', type: 'heading', content: { level: 2, text: '5.2 Implementation and Error Handling' } },
    {
      id: '64',
      type: 'code',
      content: {
        language: 'asm',
        code:
          'read_sector:\n    ; ES:BX dest, DL drive, CH cyl, DH head, CL sector (1-based)\n    mov ah, 0x02\n    mov al, 0x01\n    int 0x13\n    jc .fail\n    ret\n.fail:\n    mov si, read_error_msg\n    call print_string\n    jmp $\n\nread_error_msg db "Disk Read Error", 0'
      }
    },
    {
      id: '65',
      type: 'callout',
      content: {
        type: 'info',
        title: 'Important',
        message:
          'Sector numbering starts at 1. Using CL=0 will fail. Keep the bootloader at 0x7C00 and load data (e.g., sector 2) into a safe buffer like 0x0500.'
      }
    },

    { id: '70', type: 'heading', content: { level: 1, text: '6.Bootloader Logic (stage1_bootloader.asm)' } },
    { id: '71', type: 'heading', content: { level: 2, text: '6.1 Entry, Segments, and Message' } },
    {
      id: '72',
      type: 'code',
      content: {
        language: 'asm',
        code:
          '[BITS 16]\n[ORG 0x7C00]\nstart:\n    xor ax, ax\n    mov ds, ax\n    mov es, ax\n    mov si, msg\n    call print_string\nmsg db "Reading sector 2...", 0'
      }
    },
    { id: '73', type: 'heading', content: { level: 2, text: '6.2 Read Sector 2 → 0x0000:0x0500, Print, Loop' } },
    {
      id: '74',
      type: 'code',
      content: {
        language: 'asm',
        code:
          '    mov ax, 0x0000\n    mov es, ax\n    mov bx, 0x0500\n    mov dl, 0x00\n    mov ch, 0x00\n    mov cl, 0x02\n    mov dh, 0x00\n    call read_sector\n    mov si, 0x0500\n    call print_string\n    jmp $\n\n%include "asm/print.asm"\n%include "asm/disk_read.asm"\n\ntimes 510 - ($ - $$) db 0\n dw 0xAA55'
      }
    },

    { id: '80', type: 'heading', content: { level: 1, text: '7.How It All Fits Together' } },
    {
      id: '81',
      type: 'text',
      content:
        'Boot flow: BIOS loads sector 1 at 0x7C00 → bootloader prints a message → sets CHS and buffer → calls `read_sector` to load sector 2 at 0x0500 → prints data → halts in an infinite loop.'
    },

    { id: '90', type: 'heading', content: { level: 1, text: '8.Running the Project' } },
    { id: '91', type: 'heading', content: { level: 2, text: '8.1 Assemble with NASM' } },
    {
      id: '92',
      type: 'code',
      content: { language: 'bash', code: 'nasm -f bin asm/stage1_bootloader.asm -o boot.bin' }
    },
    { id: '93', type: 'heading', content: { level: 2, text: '8.2 Run in QEMU' } },
    {
      id: '94',
      type: 'code',
      content: { language: 'bash', code: 'qemu-system-i386 -fda boot.bin' }
    },
    {
      id: '95',
      type: 'text',
      content:
        'Expected output: first line from the bootloader (“Reading sector 2...”), followed by the contents of sector 2. If you see “Disk Read Error”, the read failed or the target sector is empty.'
    },
    { id: '96', type: 'heading', content: { level: 2, text: '8.3 Modify and Rebuild' } },
    {
      id: '97',
      type: 'list',
      content: {
        type: 'unordered',
        items: [
          'Change the boot message by editing `msg` and reassembling.',
          'Change the sector by updating `mov cl, 0x02` to another valid sector.',
          'Write your own string to sector 2 and print it from 0x0500.'
        ]
      }
    },

    { id: '100', type: 'heading', content: { level: 1, text: '9.Troubleshooting & Common Errors' } },
    { id: '101', type: 'heading', content: { level: 2, text: '9.1 Black Screen in QEMU' } },
    {
      id: '102',
      type: 'list',
      content: {
        type: 'unordered',
        items: [
          'Ensure `boot.bin` is exactly 512 bytes.',
          'Verify the boot signature: `times 510 - ($ - $$) db 0` then `dw 0xAA55`.'
        ]
      }
    },
    { id: '103', type: 'heading', content: { level: 2, text: '9.2 “Disk Read Error”' } },
    {
      id: '104',
      type: 'list',
      content: {
        type: 'unordered',
        items: [
          'CL must be ≥ 1 (sector numbering is 1-based).',
          'Ensure the target sector actually contains data.'
        ]
      }
    },
    { id: '105', type: 'heading', content: { level: 2, text: '9.3 Loaded Message Not Showing' } },
    {
      id: '106',
      type: 'list',
      content: {
        type: 'unordered',
        items: [
          'Confirm the disk image has a valid string in sector 2.',
          'Point SI to 0x0500 before calling `print_string`.'
        ]
      }
    },
    { id: '107', type: 'heading', content: { level: 2, text: '9.4 NASM Path/Include Errors' } },
    {
      id: '108',
      type: 'code',
      content: {
        language: 'text',
        code:
          'asm/\n ├── print.asm\n ├── disk_read.asm\n └── stage1_bootloader.asm\n\n%include "asm/print.asm"\n%include "asm/disk_read.asm"'
      }
    },

    { id: '120', type: 'heading', content: { level: 1, text: '10.Conclusion' } },
    {
      id: '121',
      type: 'text',
      content:
        'You built a functional 512-byte Stage-1 bootloader, learned BIOS interrupts (INT 0x10 for output, INT 0x13 for disk), wrote reusable print routines, handled disk reads and errors, and understood the boot sector signature and memory layout at 0x7C00 and 0x0500.'
    },
    { id: '122', type: 'heading', content: { level: 2, text: '10.1 Relevance to Modern Systems' } },
    {
      id: '123',
      type: 'text',
      content:
        'Even with modern UEFI and 64-bit CPUs, all OSes must bootstrap from small, simple code. The principles you used here—initialization, loading, and control transfer—underpin modern boot chains (e.g., GRUB, UEFI stubs).'
    },
    { id: '124', type: 'heading', content: { level: 2, text: '10.2 Next Steps' } },
    {
      id: '125',
      type: 'list',
      content: {
        type: 'unordered',
        items: [
          'Load multiple sectors for larger programs.',
          'Implement a Stage-2 bootloader and then load a kernel.',
          'Add keyboard input via INT 0x16 for simple menus.',
          'Explore protected mode and 32/64-bit transitions.'
        ]
      }
    },

    { id: '130', type: 'heading', content: { level: 1, text: '11.Appendix' } },
    { id: '131', type: 'heading', content: { level: 2, text: '11.1 Full Source Listings' } },
    {
      id: '132',
      type: 'code',
      content: {
        language: 'asm',
        code:
          '; print.asm\n[BITS 16]\nprint_char:\n    mov ah, 0x0E\n    mov bh, 0x00\n    mov bl, 0x07\n    int 0x10\n    ret\n\nprint_string:\n.print_loop:\n    lodsb\n    cmp al, 0\n    je .done\n    call print_char\n    jmp .print_loop\n.done:\n    ret'
      }
    },
    {
      id: '133',
      type: 'code',
      content: {
        language: 'asm',
        code:
          '; disk_read.asm\n[BITS 16]\nread_sector:\n    mov ah, 0x02\n    mov al, 0x01\n    int 0x13\n    jc .fail\n    ret\n.fail:\n    mov si, read_error_msg\n    call print_string\n    jmp $\nread_error_msg db \"Disk Read Error\", 0'
      }
    },
    {
      id: '134',
      type: 'code',
      content: {
        language: 'asm',
        code:
          '; stage1_bootloader.asm\n[BITS 16]\n[ORG 0x7C00]\nstart:\n    xor ax, ax\n    mov ds, ax\n    mov es, ax\n\n    mov si, msg\n    call print_string\n\n    mov ax, 0x0000\n    mov es, ax\n    mov bx, 0x0500\n\n    mov dl, 0x00\n    mov ch, 0x00\n    mov cl, 0x02\n    mov dh, 0x00\n    call read_sector\n\n    mov si, 0x0500\n    call print_string\n    jmp $\n\nmsg db \"Reading sector 2...\", 0\n\n%include \"asm/print.asm\"\n%include \"asm/disk_read.asm\"\n\ntimes 510 - ($ - $$) db 0\n dw 0xAA55'
      }
    },
    { id: '135', type: 'heading', content: { level: 2, text: '11.2 Quick BIOS Interrupt Reference' } },
    {
      id: '136',
      type: 'list',
      content: {
        type: 'unordered',
        items: [
          'INT 0x10, AH=0x0E: Teletype output (AL=char, BH=page, BL=color).',
          'INT 0x13, AH=0x02: Read sectors (AL=count, CH/CL/DH=CHS, DL=drive, ES:BX=buffer).',
          'INT 0x16, AH=0x00: Wait for keypress (returns key in AL).'
        ]
      }
    },
    { id: '137', type: 'heading', content: { level: 2, text: '11.3 Glossary' } },
    {
      id: '138',
      type: 'list',
      content: {
        type: 'unordered',
        items: [
          'Bootloader: First code executed from the boot sector.',
          'Sector: Smallest disk unit (typically 512 bytes).',
          'CHS: Cylinder-Head-Sector addressing used by legacy BIOS.',
          'Segment:Offset: Real-mode addressing scheme (e.g., DS:SI, ES:BX).',
          'BIOS: Firmware that initializes hardware and loads the boot sector.',
          'Boot Signature (0xAA55): Required 2-byte marker at end of the boot sector.'
        ]
      }
    },
    { id: '139', type: 'heading', content: { level: 2, text: '11.4 Further Reading' } },
    {
      id: '140',
      type: 'list',
      content: {
        type: 'unordered',
        items: [
          'OSDev Wiki',
          'NASM Documentation',
          "Ralf Brown’s Interrupt List",
          'QEMU Manual',
          'Little OS Book',
          'Operating Systems: From 0 to 1 (GitHub)'
        ]
      }
    }
  ],
  author: authors.aayush,
  publishedAt: '2025-08-18T00:00:00Z',
  updatedAt: '2025-08-23T00:00:00Z',
  readingTime: 15,
  tags: ['bootloader', 'assembly', 'x86', 'osdev', 'bios', 'low-level'],
  coverImage: 'src/assets/images/simple-bootloader.png',
  featured: true
};
