<div align="center">

# 🍎 Fruity Nutrition App

_Scopri il potere nutrizionale dei migliori frutti della natura_

[![Angular](https://img.shields.io/badge/Angular-18+-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PrimeNG](https://img.shields.io/badge/PrimeNG-18+-00c851?style=for-the-badge&logo=primeng&logoColor=white)](https://primeng.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[🚀 Demo Live](https://your-demo-url.web.app) • [📖 Documentazione](https://github.com/maxange-developer/fruity-nutrition-app/wiki) • [🐛 Segnala Bug](https://github.com/maxange-developer/fruity-nutrition-app/issues) • [💡 Richiedi Feature](https://github.com/maxange-developer/fruity-nutrition-app/issues)

</div>

---

## 🎯 Panoramica

**Fruity Nutrition App** è un'applicazione Angular all'avanguardia che trasforma il modo in cui scopri ed esplori le informazioni nutrizionali sui frutti. Costruita con tecnologie web moderne e alimentata dalle API di FruityVice, offre un'interfaccia elegante e responsive per individui attenti alla salute che cercano approfondimenti nutrizionali dettagliati.

### ✨ Perché Fruity Nutrition App?

🌱 **Approccio Salute-Centrico** - Promuove la nutrizione plant-based con dati completi sui frutti  
🎨 **UX Eccezionale** - PrimeNG con animazioni fluide e navigazione intuitiva  
⚡ **Ottimizzazione Performance** - Zoneless change detection e strategie di caching avanzate  
🔍 **Scoperta Intelligente** - Capacità avanzate di ricerca e filtraggio  
📱 **Accesso Universale** - Design completamente responsive per tutti i dispositivi

---

## 🌟 Caratteristiche Principali

<div align="center">

| Caratteristica                  | Descrizione                                                 | Stato |
| ------------------------------- | ----------------------------------------------------------- | ----- |
| 🍓 **Database Completo Frutti** | Naviga tra 50+ frutti con profili nutrizionali dettagliati  | ✅    |
| 🔍 **Ricerca Intelligente**     | Ricerca in tempo reale con autocompletamento e suggerimenti | ✅    |
| 📊 **Analisi Nutrizionale**     | Analisi visiva di calorie, macro e micronutrienti           | ✅    |
| 🏷️ **Filtraggio Avanzato**      | Filtra per famiglia, calorie, contenuto di zuccheri e altro | ✅    |
| 🌍 **Supporto Multilingue**     | Disponibile in italiano e inglese                           | ✅    |
| 📱 **PWA Ready**                | Installa come app nativa con capacità offline               | 🚧    |
| 🎨 **Temi Personalizzati**      | Schemi di colori multipli e modalità scura                  | 🚧    |

</div>

---

## 🛠️ Stack Tecnologico

<div align="center">

### Frontend Core

![Angular](https://img.shields.io/badge/-Angular-DD0031?style=flat-square&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![RxJS](https://img.shields.io/badge/-RxJS-B7178C?style=flat-square&logo=reactivex&logoColor=white)
![PrimeNG](https://img.shields.io/badge/-PrimeNG-009688?style=flat-square&logo=primeng&logoColor=white)

### Strumenti di Sviluppo

![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![npm](https://img.shields.io/badge/-npm-CB3837?style=flat-square&logo=npm&logoColor=white)
![ESLint](https://img.shields.io/badge/-ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/-Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=white)

### Testing & Qualità

![Jasmine](https://img.shields.io/badge/-Jasmine-8A4182?style=flat-square&logo=jasmine&logoColor=white)
![Karma](https://img.shields.io/badge/-Karma-429539?style=flat-square&logo=karma&logoColor=white)
![Coverage](https://img.shields.io/badge/Coverage-87.7%25-brightgreen?style=flat-square)

</div>

### 🏗️ Highlights Architetturali

- **🚫 Zoneless Change Detection** - Performance di nuova generazione Angular
- **🎯 Standalone Components** - Architettura modulare e tree-shakeable
- **⚡ Angular Signals** - Gestione stato reattiva senza complessità RxJS
- **🎨 PrimeNG** - Libreria UI moderna e completa
- **📊 Testing Completo** - 87.7% coverage test con 140+ suite test

---

## 🚀 Avvio Rapido

### 📋 Prerequisiti

Prima di iniziare, assicurati di avere installato:

```bash
node -v    # Node.js 18.0+ richiesto
npm -v     # npm 9.0+ richiesto
ng version # Angular CLI 18.0+ richiesto
```

### ⚡ Installazione

1. **Clona il repository**

   ```bash
   git clone https://github.com/maxange-developer/fruity-nutrition-app.git
   cd fruity-nutrition-app
   ```

2. **Installa le dipendenze**

   ```bash
   npm install
   ```

3. **Avvia il server di sviluppo**

   ```bash
   npm start
   ```

   🌐 Apri [http://localhost:4200](http://localhost:4200) nel tuo browser

### 🔧 Comandi di Sviluppo

| Comando         | Descrizione                | Utilizzo    |
| --------------- | -------------------------- | ----------- |
| `npm start`     | Server di sviluppo con HMR | Sviluppo    |
| `npm run build` | Build di produzione        | Deploy      |
| `npm test`      | Test unitari con coverage  | Testing     |
| `npm run lint`  | Controllo qualità codice   | Code Review |
| `npm run e2e`   | Test end-to-end            | QA          |

---

## 📁 Struttura Progetto

```
src/
├── 📱 app/
│   ├── 🧩 components/
│   │   ├── 🎴 fruit-card/         # Card visualizzazione singolo frutto
│   │   ├── 📋 fruit-list/         # Lista principale frutti con filtri
│   │   ├── 🔍 fruit-search/       # Funzionalità di ricerca
│   │   ├── 📊 fruit-detail/       # Vista dettagliata nutrizionale
│   │   └── 🌐 language-selector/  # Supporto multilingue
│   ├── 🏗️ services/
│   │   ├── 🍎 fruit.service.ts    # Layer comunicazione API
│   │   └── 🌍 translation.service.ts # Internazionalizzazione
│   ├── 📝 models/
│   │   └── 🍓 fruit.model.ts      # Interfacce TypeScript
│   ├── ⚙️ app.config.ts           # Configurazione applicazione
│   └── 🎯 app.routes.ts           # Routing navigazione
├── 🎨 assets/                     # Risorse statiche
├── 🌍 environments/               # Configurazioni ambiente
└── 📐 styles.scss                 # Styling globale
```

### 🎯 Architettura Componenti

- **🎴 FruitCard**: Componente card riutilizzabile con supporto emoji per 50+ frutti
- **📋 FruitList**: Vista principale con capacità avanzate di filtraggio e ordinamento
- **🔍 FruitSearch**: Ricerca in tempo reale con input debounced e suggerimenti
- **📊 FruitDetail**: Analisi nutrizionale completa con indicatori visivi
- **🌐 LanguageSelector**: Supporto multilingue con persistenza localStorage

---

## 🛡️ Configurazione API

### 🌐 Setup Proxy

L'applicazione usa una configurazione proxy per gestire i problemi CORS con l'API FruityVice:

```json
{
  "/api/*": {
    "target": "https://fruityvice.com",
    "secure": true,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

### 📡 Endpoints Disponibili

| Endpoint            | Metodo | Descrizione              | Risposta  |
| ------------------- | ------ | ------------------------ | --------- |
| `/api/fruit/all`    | GET    | Recupera tutti i frutti  | `Fruit[]` |
| `/api/fruit/{name}` | GET    | Ottieni frutto specifico | `Fruit`   |

### 🍎 Modello Dati Frutto

```typescript
interface Fruit {
  id: number;
  name: string;
  family: string;
  order: string;
  genus: string;
  nutritions: {
    calories: number;
    fat: number;
    sugar: number;
    carbohydrates: number;
    protein: number;
  };
}
```

---

## 🏆 Best Practices & Qualità Codice

### 🎯 Eccellenza Angular

<div align="center">

| Pratica                          | Implementazione                       | Stato |
| -------------------------------- | ------------------------------------- | ----- |
| 🚫 **Zoneless Change Detection** | Ottimizzazione performance next-gen   | ✅    |
| 🎯 **Standalone Components**     | Architettura modulare, tree-shakeable | ✅    |
| ⚡ **Angular Signals**           | Stato reattivo senza complessità RxJS | ✅    |
| 🔄 **OnPush Strategy**           | Change detection ottimizzata          | ✅    |
| 🏗️ **Lazy Loading**              | Code splitting basato su route        | ✅    |
| 🛡️ **TypeScript Strict**         | Massima type safety                   | ✅    |
| ♿ **Accessibilità**             | Conformità WCAG 2.1 AA                | ✅    |

</div>

### ⚡ Ottimizzazioni Performance

- **🚀 Caching Intelligente** - Cache intelligente risposte API con scadenza
- **🎭 Skeleton Loading** - Stati di caricamento fluidi per UX migliore
- **⏱️ Ricerca Debounced** - Performance di ricerca ottimizzata
- **🖼️ Ottimizzazione Immagini** - NgOptimizedImage per caricamento veloce
- **📦 Ottimizzazione Bundle** - Tree-shaking e code splitting
- **💾 Gestione Memoria** - Pulizia corretta delle subscription

### 🧪 Eccellenza Testing

```bash
# Coverage test completo
Statements   : 87.7% (214/244)
Branches     : 73.21% (41/56)
Functions    : 84.52% (71/84)
Lines        : 88.39% (198/224)

# Breakdown suite test
✅ Test Unitari: 140 superati
✅ Test Integrazione: Interazioni componenti
✅ Test Servizi: Validazione layer API
✅ Test E2E: Validazione percorsi utente
```

---

## 🚢 Deploy

### 🔥 Firebase Hosting (Raccomandato)

```bash
# Installa Firebase CLI
npm install -g firebase-tools

# Login e inizializza
firebase login
firebase init hosting

# Build e deploy
npm run build:prod
firebase deploy

# 🎉 La tua app è live!
```

### 🌍 Netlify

```bash
# Build per produzione
npm run build:prod

# Deploy via Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist

# O trascina e rilascia cartella dist su dashboard Netlify
```

### 🐳 Docker

```dockerfile
# Dockerfile incluso per deploy containerizzato
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🧪 Testing & Quality Assurance

### 🔬 Esecuzione Test

```bash
# Test unitari con coverage
npm test

# Modalità watch per sviluppo
npm run test:watch

# Generazione report coverage
npm run test:coverage

# Test end-to-end
npm run e2e

# Lint e controllo formato
npm run lint
npm run format:check
```

### 📊 Metriche Qualità

- **🎯 Coverage Test**: 87.7% statements, 140+ suite test
- **🏆 Score Performance**: 95+ su Lighthouse
- **♿ Accessibilità**: Conforme WCAG 2.1 AA
- **📱 Score PWA**: 90+ caratteristiche Progressive Web App
- **🔒 Sicurezza**: Nessuna vulnerabilità nota

---

## 🤝 Contribuire

Accogliamo contributi dalla community! Ecco come puoi aiutare:

### 🛠️ Workflow di Sviluppo

1. **🍴 Fork** il repository
2. **🌟 Crea** un branch feature: `git checkout -b feature/funzionalita-fantastica`
3. **💻 Sviluppa** con i nostri standard di codice
4. **🧪 Testa** le tue modifiche: `npm test`
5. **📝 Commit** con conventional commits: `git commit -m 'feat: aggiungi funzionalità fantastica'`
6. **🚀 Push** al tuo branch: `git push origin feature/funzionalita-fantastica`
7. **📋 Invia** una Pull Request

### 📏 Standard Codice

- Segui la guida di stile Angular
- Usa messaggi commit convenzionali
- Mantieni coverage test sopra 85%
- Assicura conformità accessibilità
- Scrivi documentazione significativa

### 🐛 Segnalazioni Bug

Trovato un bug? Per favore [crea un issue](https://github.com/maxange-developer/fruity-nutrition-app/issues) con:

- Descrizione chiara del problema
- Passi per riprodurre
- Comportamento atteso vs reale
- Screenshot se applicabili
- Dettagli ambiente

---

## 🛠️ Troubleshooting

<details>
<summary>🚨 Problemi Comuni & Soluzioni</summary>

### Errori CORS

```bash
# Assicurati che la configurazione proxy sia attiva
ng serve --proxy-config proxy.conf.json
```

### Problemi Node Modules

```bash
# Installazione pulita
rm -rf node_modules package-lock.json
npm install
```

### Fallimenti Build

```bash
# Controlla compatibilità versione Angular
ng update @angular/core @angular/cli
npm audit fix
```

### Problemi Performance

```bash
# Analizza dimensione bundle
npm run build:analyze
# Controlla memory leak in DevTools
```

</details>

---

## 📄 Licenza

Questo progetto è rilasciato sotto **Licenza MIT** - vedi il file [LICENSE](LICENSE) per dettagli.

### 🎯 Filosofia Open Source

- ✅ **Libero di usare** per progetti personali e commerciali
- ✅ **Modifica e distribuisci** secondo necessità
- ✅ **Contribuisci** per aiutare la community
- ✅ **Impara e insegna** sviluppo Angular moderno

---

## 🙏 Riconoscimenti

<div align="center">

### 🌟 Ringraziamenti Speciali

**🍎 [API FruityVice](https://fruityvice.com/)** - Database completo nutrizione frutti  
**🅰️ [Team Angular](https://angular.io/)** - Framework eccezionale ed ecosistema  
**🎨 [PrimeNG](https://primeng.org/)** - Libreria UI moderna e completa  
**👥 [Community Angular](https://angular.io/community)** - Supporto infinito e risorse  
**🧪 [Testing Library](https://testing-library.com/)** - Best practices testing

</div>

---

## 📞 Connettiti & Supporto

<div align="center">

### 💬 Rimani in Contatto

[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:your-email@example.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/your-profile)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/your-handle)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=todoist&logoColor=white)](https://your-portfolio.com)

### ⭐ Mostra il Tuo Supporto

Se questo progetto ti ha aiutato, considera di:

- ⭐ **Stellare** questo repository
- 🍴 **Forkare** per i tuoi progetti
- 📢 **Condividere** con la tua rete
- 🐛 **Segnalare** bug o **💡 richiedere** feature

</div>

---

<div align="center">

### 🎉 Demo Live

**[🌐 Prova Fruity Nutrition App](https://)**

_Scopri il potere nutrizionale dei migliori frutti della natura_

---

_Costruito con ❤️ usando Angular 18+ • Realizzato per sviluppatori attenti alla salute e appassionati di frutta_

![Fruit Animation](https://via.placeholder.com/800x200/4CAF50/white?text=🍎🍌🍓🥝🍊+Promuovendo+Nutrizione+Sana+🥭🍇🍑🍍🥑)

</div>
