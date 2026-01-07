// src/ts/roboha/main_session_guard.ts
// 🔐 ПЕРЕВІРКА GOOGLE СЕСІЇ для main.html

import { supabase } from "../vxid/supabaseClient";
import { isEmailAllowed } from "../../../constants";

console.log("🔒 [Main] Перевірка Google сесії...");

async function checkMainPageSession() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      console.warn("⛔ [Main] Немає Google сесії");
      alert("Сесія закінчилась. Увійдіть знову.");
      window.location.replace("https://crmsto.github.io/STO/index.html");
      return;
    }

    const email = session.user.email;

    if (!isEmailAllowed(email)) {
      console.warn("⛔ [Main] Email не в whitelist:", email);
      await supabase.auth.signOut();
      window.location.replace("https://crmsto.github.io/STO/");
      return;
    }

    console.log("✅ [Main] Доступ дозволено:", email);
  } catch (err) {
    console.error("❌ [Main] Помилка перевірки:", err);
    window.location.replace("https://crmsto.github.io/STO/index.html");
  }
}

// Запускаємо перевірку
checkMainPageSession();
