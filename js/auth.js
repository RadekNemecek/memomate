import supabase from './supabaseClient';

// Funkce pro registraci uživatele
export async function registerUser(email, password) {  // Přidání exportu
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    console.error("Chyba při registraci:", error.message);
    return;
  }

  console.log("Úspěšná registrace:", data);
  // Po registraci můžeš přesměrovat nebo ukázat uživateli nějaký výsledek
}

// Funkce pro přihlášení uživatele
export async function loginUser(email, password) {  // Přidání exportu
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.error("Chyba při přihlášení:", error.message);
    return;
  }

  console.log("Úspěšné přihlášení:", data);
  // Po přihlášení můžeš přesměrovat uživatele na jinou stránku nebo ukázat jeho data
}
