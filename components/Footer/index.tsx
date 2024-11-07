import React, { useEffect, useState } from "react";
import styles from './Footer.module.css';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
      >
        Footer V.0.0.1
        <span className={styles.logo}>
          <Image
            src="/icons/icon16.png" // Lưu ý: Đường dẫn phải bắt đầu bằng "/"
            alt="Logo"
            width={16}
            height={16}
          />
        </span>
      </a>
    </footer>
  );
}
