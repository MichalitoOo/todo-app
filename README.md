# todo-app
Full-stack app for educational purposes in Express.


## 🧠  Learning notes
- **Express**: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js, providing a schema-based solution to model application data.
- **MongoDB**: A NoSQL database that uses a document-oriented data model, allowing for flexible and scalable data storage.
- **RESTful API**: An architectural style for designing networked applications, using HTTP requests to access and manipulate data.
- **CRUD Operations**: The four basic operations of persistent storage: Create, Read, Update, and Delete.


### Day 1
✅ Vývojové prostredie a nástroje:
Nainštaloval som Node.js + npm a pochopil, ako funguje npm install, node_modules, package.json a package-lock.json.

Pochopil som význam semver (semantic versioning) a rozdiel medzi dependencies a devDependencies.

Naučil som sa pracovať s PowerShell execution policy, aby som mohol spúšťať npm skripty.

🐳 Docker a PostgreSQL:
Vytvoril som lokálnu PostgreSQL databázu cez Docker pomocou:
```bash
docker run --name todo-db -e POSTGRES_PASSWORD=todo123 -e POSTGRES_DB=todoapp -p 5432:5432 -d postgres
```
Naučil som sa, ako funguje Docker a ako používať príkazy na správu kontajnerov.
Naučil som sa pracovať s príkazmi docker ps, docker start, docker stop, docker exec a ako sa pripojiť na bežiaci kontajner.

Pripojil som sa na databázu pomocou GUI nástroja DBeaver a naučil sa overiť, či tabuľky boli vytvorené.

🛠️ Backend a TypeORM:
Upravil som DATABASE_URL v .env tak, aby smerovala na moju lokálnu databázu.

Pochopil som, ako TypeORM používa synchronize: true a entities na automatické vytváranie tabuliek.

Vyriešil som problém so SSL pripojením k lokálnej databáze pomocou ssl: false v data-source.ts.

Upravil som cestu k modelom (src/models/**/*.ts), aby TypeORM vedel načítať moje entity.

Overil som vytváranie tabuliek cez logy v termináli a príkazy v DBeaveri.

### Day 2

## 📁 Štruktúra projektu


```
src/
├── controllers/   <- prijímajú requesty, volajú služby
├── services/      <- biznis logika, databázové operácie (napr. vytvorenie tasku)
├── models/        <- databázové entity (napr. User, Task)
├── routes/        <- definuje API endpointy a ich prepojenie s controllerom
├── middlewares/   <- validácia tokenov, autentifikácia, error handling
├── config/        <- pripojenie na DB, načitanie .env, konštanty
├── utils/         <- pomocné funkcie
├── app.ts         <- hlavný vstup aplikácie
```

## Architektúra aplikácie

Aplikácia je rozdelená do vrstiev, ktoré majú jasne definované zodpovednosti. Toto rozdelenie pomáha udržiavať kód čistý, testovateľný a ľahko rozšíriteľný.

### Vrstvy aplikácie



| Vrstva           | Zodpovednosť                                                            |
| ---------------- | ----------------------------------------------------------------------- |
| **Controller**   | prijíma HTTP požiadavky, validuje vstup, volá service                   |
| **Service**      | obsahuje *biznis logiku* – napr. overenie používateľa, vytvorenie tasku |
| **Model/Entity** | definuje tabuľky a vzťahy pre databázu                                  |
| **Route**        | priradí `GET /tasks` k `taskController.getAll`                          |
| **Middleware**   | rieši veci medzi requestom a kontrolérom – napr. JWT token              |

`routes/` je bežná súčasť moderných Express aplikácií, aj keď MVC ju nespomína. Slúži na prepojenie URL ciest s controller metódami.  
Reálna štruktúra projektu

## Architektonické vzory
### MVC (Model-View-Controller)
MVC je architektonický vzor, ktorý rozdeľuje aplikáciu na tri hlavné časti:
- **Model**: Reprezentuje dáta a logiku aplikácie. V našom prípade sú to databázové entity ako `User` a `Task`.
- **View**: Zobrazuje dáta používateľovi. V našom prípade to nie je priamo súčasťou backendu, ale môžeme si predstaviť, že by sme mali frontend aplikáciu.
- **Controller**: Spracováva požiadavky od používateľa, komunikuje s modelmi a vracia odpovede. V našom prípade sú to kontroléry ako `taskController` a `userController`.
### Service Layer
Service Layer je vrstva, ktorá obsahuje biznis logiku aplikácie. Je zodpovedná za spracovanie dát a komunikáciu medzi kontrolérmi a modelmi. V našom prípade budeme mať služby ako `taskService` a `userService`, ktoré budú obsahovať metódy na vytváranie, aktualizáciu a mazanie úloh a používateľov.    

Zvyčajne sa používa na oddelenie biznis logiky od kontrolérov, čo umožňuje lepšiu testovateľnosť a udržiavateľnosť kódu, takže `MVC` + `Service Layer` je veľmi bežná kombinácia v moderných webových aplikáciách.

### Day 3

### 📌 Asynchrónny vs. Synchronný kód

**Synchronný kód**: vykonáva sa *riadok po riadku* – ďalší krok sa spustí až po dokončení predchádzajúceho.  
**Asynchrónny kód**: umožňuje spustiť operácie, ktoré *bežia na pozadí* (napr. čítanie z DB, sieťový request), a pokračovať ďalej, bez čakania na ich dokončenie.  
`await` zastaví vykonávanie funkcie dovtedy, kým sa operácia nedokončí – čím vytvára efekt „synchronnosti“ v asynchrónnom kóde.

### ⏳ await a async

- `async` označuje funkciu, ktorá môže obsahovať `await`.
- `await` sa používa na počkanie, kým sa *Promise* (napr. zápis do DB) dokončí.
- Bez `await` dostaneš `Promise<User>`, nie reálny objekt.

---

### 🔄 Prečo exportovať controller funkcie

Exportujeme funkcie z controllerov, aby ich vedel Express `router` použiť a prepojiť ich na API endpointy.  
Bez exportu by neboli viditeľné mimo súboru.

### Day 4

### 🌍 Globálny error handler v Express

- Error handler v Express je špeciálny middleware na spracovanie všetkých chýb v appke, má signatúru `(err, req, res, next)`.
- Chytí chyby vyhodené v controlleri, service alebo hocikde v middleware (cez `throw` alebo `next(error)`).
- Rozlišuje medzi **operational errors** (`AppError`) a **programming errors** (neočakávané bugy).

---

### 🏷️ Operational vs Programming error

- **Operational error:** Očakávaná situácia (zlá validácia, užívateľ už existuje, neplatné údaje atď.). Užívateľ môže dostať jej message.
- **Programming error:** Bugy v kóde, zlyhania systému, ktoré user nesmie vidieť. User dostane len generickú správu (500).

---

### 🧩 Výhody globálneho error handlera

- Netreba opakovať try/catch s res.status v každom controllery.
- Všetky chyby sú spracované a logované na jednom mieste, odpovede sú konzistentné.
- Uľahčuje údržbu a rozširovanie projektu.

---

### 🧰 Stack trace

- Stack trace je výpis volaní funkcií až po miesto chyby (pomáha debugovať).
- Dá sa zalogovať cez `console.error(error.stack)`.

---

### 📝 Ďalšie poznámky

- Správny error handler nikdy neposiela užívateľovi stack trace ani detailný opis bugov.
- AppError triedu umiestňuj do `utils/` alebo `errors/`.
- Error handler registruj až **za všetky routy a middleware** v `app.ts`.

---

### Day 5

### 🔄 Opakovanie architektúry a endpointov

- **Controller:** Rieši validáciu vstupov a volá service layer, hádže chyby cez `throw new AppError(...)` pri neplatných vstupoch aj business logike.
- **Service layer:** Obsahuje business logiku (napr. hashovanie hesla, ukladanie usera), tiež hádže AppError pri chybách.
- **Globálny error handler:** Spracováva všetky vyhodené chyby, rozlišuje medzi operational (AppError) a neočakávanými chybami (programming errors).

---

### 🚦 Práca s error handlingom

- `throw new AppError(...)` v controllery/service signalizuje problém a preskočí do error handlera.
- V catch blokoch controllerov sa chyba posúva ďalej cez `next(error)`, nikdy sa nevracia odpoveď priamo tam.
- Error handler má správny počet parametrov: `(err, req, res, next)`, najlepšie netypovať `err` ako Error, ale ako `any`.
- Netreba používať `return res.status(...).json(...)`, stačí len zavolať odpoveď a ukončiť middleware.
- Typické problémy s TypeScript typmi sa dajú vyriešiť buď použitím `any` na err, alebo explicitným typovaním podľa Express dokumentácie.

---

### 🛤️ Routing a štruktúra endpointov

- Endpoints sú v `/routes/authRoutes.ts` a používajú formát `/api/auth/register` pre škálovateľnosť a oddelenie od FE routovania.
- V app.ts sa routy pripájajú cez `app.use('/api/auth', authRoutes)` a až potom sa registruje globálny error handler.
- Zmysel prefixu `/api/` je v oddelení API endpointov od FE routovania – zabraňuje kolíziám a je to industry standard.

---

### 🧪 Spúšťanie projektu

- Appku spúšťame cez `npm run dev` (vývoj) alebo `npm start` (produkcia/test).
- Vždy je možné pozrieť príkazy v `package.json` alebo cez `npm run`.
- Typové definície pre Express (`@types/express`) je nutné mať nainštalované pre správny beh a typovanie TypeScriptu.

---

### 💡 Tipy a best practices

- Každá časť appky má mať jasnú zodpovednosť: controller (flow), service (logika), error handler (odpovede na chyby).
- Chyby v service a validácii hádž cez AppError, nikdy nerob odpovede priamo v service.
- Chyby vždy posúvaj ďalej (`next(error)`), nikdy nevracaj odpoveď dvakrát.
- Chaining middleware a pred-validácia sa dá pridať priamo do routes. Napríklad, ak chceš overiť token pred prístupom k endpointu, pridáš middleware do routy. (napr. `router.get('/tasks', authMiddleware, getAllTasks)`).

---

### Day 6


### 🔑 Login endpoint & JWT

- Pri implementácii login endpointu v Express/TypeScript API je best practice:
  - Prijímať email a heslo v requeste (POST /api/auth/login).
  - Overovať existenciu užívateľa a správnosť hesla (napr. cez bcrypt.compare).
  - Pri úspešnom prihlásení generovať JWT token cez jsonwebtoken (`jwt.sign`).
  - Token nikdy neposielať ako cookie automaticky – štandard je poslať ho v JSON response.
  - Chybový kód 401 Unauthorized používam pre zlé prihlasovacie údaje (pri validných vstupoch).
  - Chybový kód 400 Bad Request používam, ak sú vstupy neplatné (napr. chýbajúci alebo zle naformátovaný email/heslo).

---

### 🔐 Čo vracať v response po login-e?

- Odporúčaný štandard je vrátiť:
  - Vygenerovaný JWT token (pre ďalšie autorizované požiadavky).
  - Základné informácie o userovi (id, email, prípadne rolu) v user objekte.
- Príklad response:
  ```json
  {
    "token": "...",
    "user": {
      "id": 123,
      "email": "user@example.com"
    }
  }




### Dôležité poznatky:
- Heslo (ani jeho hash) nikdy nepatrí do response ani do JWT
- JWT payload by mal byť jednoduchý: userId, email
- Pri chybách pri login endpointoch používame vždy jednotnú správu
- Dĺžka vstupov je dôležitá kvôli ochrane pred útokmi
- Produkčné logovanie nesmie obsahovať citlivé dáta



#### Kde by som pokračoval ďalej:
- Pridať CRUD operácie pre TODO položky (GET, POST, PATCH, DELETE)
- Implementovať role/permissions (middleware)
- Pridať unit a integration testy cez Jest (najskôr pre auth a validácie)
- Nastaviť dockerizáciu pre ľahšie spustenie projektu
- Pripojiť frontend (React alebo iný FE framework)
- Zvážiť refresh tokeny a pokročilú správu session/autentifikácie