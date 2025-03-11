const express = require("express");
const bcrypt = require("bcryptjs");
const sql = require("mssql/msnodesqlv8");
const cors = require("cors");
const app = express();
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Allow cross-origin requests

// SQL Server connection configuration
const dbConfig = {
    server: "DESKTOP-BVA3HKN\\SQLEXPRESS", // Your server/instance name
    database: "Evidenta_proceselor_la_tribunal",  // Your database name
    driver: "msnodesqlv8",  // Using msnodesqlv8 for Windows authentication
    options: {
        trustedConnection: true,  // Use this option for Windows Authentication
        encrypt: false,  // Set this to false for local development
        trustServerCertificate: true,  // If using a self-signed certificate
    },
};

// Connect to the database
sql.connect(dbConfig)
    .then(() => console.log("Connected to SQL Server"))
    .catch((err) => console.error("SQL Server connection error", err));

// Registration endpoint
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if username or email already exists
        const checkUser = await sql.query`SELECT * FROM Users WHERE Username = ${username} OR Email = ${email}`;
        if (checkUser.recordset.length > 0) {
            return res.status(409).json({ message: "Username or email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Set the default role to 'user'
        const role = 'user';  // Default role for new users

        // Insert the new user into the database with 'user' role
        await sql.query`INSERT INTO Users (Username, Email, Password, Role) VALUES (${username}, ${email}, ${hashedPassword}, ${role})`;

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Login endpoint
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        // Fetch the user from the database
        const result = await sql.query`SELECT * FROM Users WHERE Username = ${username}`;
        const user = result.recordset[0];

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare provided password with the hashed password from DB
        const isPasswordValid = await bcrypt.compare(password, user.Password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Return the role along with the login message
        res.status(200).json({
            message: "Login successful",
            role: user.Role  // Asigură-te că returnezi și rolul utilizatorului
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


app.post("/cases", async (req, res) => {
    try {
        console.log("📌 Received request on /cases", req.body);

        const result = await sql.query`
            SELECT 
                ID_Proces AS id, 
                Nr_Dosar AS case_number, 
                ID_Judecator AS judge, 
                Data_Inceperii AS start_date, 
                CAST(Status AS NVARCHAR(100)) AS status,
                CAST(Tip_Proces AS NVARCHAR(100)) AS case_type  -- ✅ Adăugăm case_type
            FROM Evidenta_proceselor_la_tribunal.dbo.Procese`;

        console.log("📌 Cases from database:", result.recordset);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("❌ Error fetching cases:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});




app.post("/judges", async (req, res) => {
    try {
        console.log("📌 Received request on /judges", req.body); // Debugging

        const result = await sql.query`
            SELECT 
                ID_Judecator AS id, 
                Nume AS name, 
                Prenume AS surname, 
                Experienta AS experience
            FROM Evidenta_proceselor_la_tribunal.dbo.Judecatori`;

        console.log("📌 Judges from database:", result.recordset); // Debugging

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("❌ Error fetching judges:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});


app.post("/decisions", async (req, res) => {
    try {
        console.log("📌 Received request on /decisions");

        const result = await sql.query`
            SELECT 
                ID_Decizie AS id, 
                ID_Proces AS case_id, 
                ID_Judecator AS judge_id, 
                Data AS decision_date, 
                CAST(Rezultat AS NVARCHAR(200)) AS result, 
                CAST(Descriere_Text AS NVARCHAR(500)) AS description, 
                CAST(Tip_Decizie AS NVARCHAR(200)) AS decision_type
            FROM Evidenta_proceselor_la_tribunal.dbo.Decizii`;

        console.log("📌 Decisions from database:", result.recordset);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("❌ Error fetching decisions:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});


app.post("/defendants", async (req, res) => {
    try {
        console.log("📌 Received request on /defendants");

        const result = await sql.query`
            SELECT 
                ID_Parte AS id, 
                Tip_parte AS party_type, 
                Nume AS name, 
                Prenume AS surname, 
                Varsta AS age, 
                Sex AS gender
            FROM Evidenta_proceselor_la_tribunal.dbo.Parti`;

        console.log("📌 Defendants & Accused from database:", result.recordset);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("❌ Error fetching defendants:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});


//INSERT 1
app.post("/cases/insert", async (req, res) => {
    const { judge_id, prosecutor_id, case_number, start_date, end_date, case_type, status } = req.body;

    try {
        console.log("📌 Received request to insert case:", req.body);

        // 🔴 Inserează cazul fără OUTPUT
        await sql.query`
            INSERT INTO Evidenta_proceselor_la_tribunal.dbo.Procese 
            (ID_Judecator, ID_Procuror, Nr_Dosar, Data_Inceperii, Data_Finalizare, Tip_Proces, Status) 
            VALUES (${judge_id}, ${prosecutor_id}, ${case_number}, ${start_date}, ${end_date}, ${case_type}, ${status})`;

        console.log("✅ Case inserted successfully!");
        res.status(201).json({ message: "Case inserted successfully!" });
    } catch (error) {
        console.error("❌ Error inserting case:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});


//DELETE 1
app.post("/cases/delete", async (req, res) => {
    const { id } = req.body;

    try {
        console.log("📌 Received request to delete case with ID:", id);

        // 🔴 1. Ștergem toate înregistrările din ProcesPartiAvocati asociate acestui caz
        await sql.query`
            DELETE FROM Evidenta_proceselor_la_tribunal.dbo.ProcesPartiAvocati 
            WHERE ID_Proces = ${id}`;

        // 🔴 2. Ștergem toate audierile asociate acestui caz
        await sql.query`
            DELETE FROM Evidenta_proceselor_la_tribunal.dbo.Audieri 
            WHERE ID_Proces = ${id}`;

        // 🔴 3. Ștergem toate deciziile asociate acestui caz
        await sql.query`
            DELETE FROM Evidenta_proceselor_la_tribunal.dbo.Decizii 
            WHERE ID_Proces = ${id}`;

        // 🔴 4. Ștergem acum cazul din tabela Procese
        const result = await sql.query`
            DELETE FROM Evidenta_proceselor_la_tribunal.dbo.Procese 
            WHERE ID_Proces = ${id}`;

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Case not found!" });
        }

        console.log("✅ Case deleted successfully.");
        res.status(200).json({ message: "Case deleted successfully!" });
    } catch (error) {
        console.error("❌ Error deleting case:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});


//UPDATE 1
app.post("/cases/update", async (req, res) => {
    const { id, case_type, status } = req.body;

    try {
        console.log("📌 Received request to update case:", req.body);

        await sql.query`
            UPDATE Evidenta_proceselor_la_tribunal.dbo.Procese
            SET Tip_Proces = ${case_type}, Status = ${status}
            WHERE ID_Proces = ${id}`;

        console.log("✅ Case updated successfully!");
        res.status(200).json({ message: "Case updated successfully!" });
    } catch (error) {
        console.error("❌ Error updating case:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// Endpoint pentru filtrare după status
app.post("/cases/filter", async (req, res) => {
    const { status } = req.body;
    try {
        let query = `
            SELECT ID_Proces AS id, Nr_Dosar AS case_number, ID_Judecator AS judge, 
                   Data_Inceperii AS start_date, CAST(Status AS NVARCHAR(100)) AS status,
                   CAST(Tip_Proces AS NVARCHAR(100)) AS case_type
            FROM Evidenta_proceselor_la_tribunal.dbo.Procese`;

        if (status !== "All") {
            query += ` WHERE Status = '${status}'`;
        }

        const result = await sql.query(query);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("❌ Error filtering cases:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// Endpoint pentru căutare după Nr_Dosar
app.post("/cases/search", async (req, res) => {
    const { case_number } = req.body;
    try {
        const result = await sql.query`
            SELECT ID_Proces AS id, Nr_Dosar AS case_number, ID_Judecator AS judge, 
                   Data_Inceperii AS start_date, CAST(Status AS NVARCHAR(100)) AS status,
                   CAST(Tip_Proces AS NVARCHAR(100)) AS case_type
            FROM Evidenta_proceselor_la_tribunal.dbo.Procese
            WHERE Nr_Dosar LIKE '%' + ${case_number} + '%'`;

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("❌ Error searching cases:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// Endpoint pentru a obține judecătorii și numărul total de procese gestionate de fiecare(INterogare 1)
app.post("/judges/cases-count", async (req, res) => {
    try {
        console.log("📌 Received request on /judges/cases-count");

        const result = await sql.query`
            SELECT 
                J.ID_Judecator AS id, 
                J.Nume + ' ' + J.Prenume AS judge_name, 
                COUNT(P.ID_Proces) AS case_count
            FROM Evidenta_proceselor_la_tribunal.dbo.Judecatori J
            LEFT JOIN Evidenta_proceselor_la_tribunal.dbo.Procese P 
            ON J.ID_Judecator = P.ID_Judecator
            GROUP BY J.ID_Judecator, J.Nume, J.Prenume
            ORDER BY case_count DESC;
        `;

        console.log("📌 Judges with case count:", result.recordset);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("❌ Error fetching judges with case count:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});


//Afisam cazurile in functie de judecatori(iNTEROGARE 2)

app.post("/judges/cases-list", async (req, res) => {
    try {
        console.log("📌 Received request on /judges/cases-list");

        const result = await sql.query`
            SELECT 
                J.ID_Judecator AS judge_id,
                J.Nume + ' ' + J.Prenume AS judge_name,
                P.ID_Proces AS case_id,
                P.Nr_Dosar AS case_number,
                CAST(P.Status AS NVARCHAR(100)) AS case_status
            FROM Evidenta_proceselor_la_tribunal.dbo.Procese P
            INNER JOIN Evidenta_proceselor_la_tribunal.dbo.Judecatori J 
            ON P.ID_Judecator = J.ID_Judecator
            ORDER BY J.ID_Judecator, P.ID_Proces`;

        console.log("📌 Judges and cases from database:", result.recordset);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("❌ Error fetching judge-case data:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});


//inserare noi decizii -- INSERT 2

app.post("/decisions/insert", async (req, res) => {
    const { case_id, judge_id, decision_date, result, description, decision_type } = req.body;

    try {
        console.log("📌 Received request to insert decision:", req.body);

        // 🔹 Obține cel mai mare ID_Decizie existent
        const maxIdResult = await sql.query`
            SELECT MAX(ID_Decizie) AS max_id FROM Evidenta_proceselor_la_tribunal.dbo.Decizii`;

        let nextId = 1;
        if (maxIdResult.recordset[0].max_id !== null) {
            nextId = maxIdResult.recordset[0].max_id + 1; // 🔹 Setăm următorul ID
        }

        // 🔹 Acum facem inserarea cu ID-ul setat manual
        await sql.query`
            INSERT INTO Evidenta_proceselor_la_tribunal.dbo.Decizii 
            (ID_Decizie, ID_Proces, ID_Judecator, Data, Rezultat, Descriere_Text, Tip_Decizie) 
            VALUES (${nextId}, ${case_id}, ${judge_id}, ${decision_date}, ${result}, ${description}, ${decision_type})`;

        console.log(`✅ Decision inserted successfully with ID: ${nextId}`);
        res.status(201).json({ message: "Decision inserted successfully!", id: nextId });

    } catch (error) {
        console.error("❌ Error inserting decision:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// 🔹 Endpoint pentru ștergerea unei decizii -- DELETE 2
app.post("/decisions/delete", async (req, res) => {
    const { id } = req.body;

    try {
        console.log(`📌 Deleting decision with ID: ${id}`);

        const result = await sql.query`
            DELETE FROM Evidenta_proceselor_la_tribunal.dbo.Decizii 
            WHERE ID_Decizie = ${id}`;

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Decision not found!" });
        }

        console.log("✅ Decision deleted successfully.");
        res.status(200).json({ message: "Decision deleted successfully!" });
    } catch (error) {
        console.error("❌ Error deleting decision:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});


//update decizii -- UPDATE 2
app.post("/decisions/update", async (req, res) => {
    const { id, decision_date, decision_type } = req.body;

    try {
        await sql.query`
            UPDATE Evidenta_proceselor_la_tribunal.dbo.Decizii
            SET Data = ${decision_date}, Tip_Decizie = ${decision_type}
            WHERE ID_Decizie = ${id}`;

        res.status(200).json({ message: "Decision updated successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});


//filtrare decizii
app.post("/decisions/filter", async (req, res) => {
    const { decision_type } = req.body;
  
    try {
      let query = `
        SELECT 
          ID_Decizie AS id, 
          ID_Proces AS case_id, 
          ID_Judecator AS judge_id, 
          Data AS decision_date, 
          CAST(Tip_Decizie AS NVARCHAR(200)) AS decision_type
        FROM Evidenta_proceselor_la_tribunal.dbo.Decizii`;
  
      // Aplicăm filtrarea doar dacă este specificată o decizie diferită de "All"
      if (decision_type && decision_type !== "All") {
        query += ` WHERE Tip_Decizie = '${decision_type}'`;
      }
  
      const result = await sql.query(query);
      res.status(200).json(result.recordset);
    } catch (error) {
      console.error("❌ Error filtering decisions:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  
  // Endpoint pentru prima interogare(3)
  app.post("/judges/decision-counts", async (req, res) => {
    try {
      console.log("📌 Received request on /judges/decision-counts");
  
      const result = await sql.query`
        SELECT 
          J.Nume + ' ' + J.Prenume AS judge_name, 
          COUNT(D.ID_Decizie) AS decision_count
        FROM Evidenta_proceselor_la_tribunal.dbo.Judecatori J
        INNER JOIN Evidenta_proceselor_la_tribunal.dbo.Decizii D
        ON J.ID_Judecator = D.ID_Judecator
        GROUP BY J.ID_Judecator, J.Nume, J.Prenume
        ORDER BY decision_count DESC;
      `;
  
      console.log("📌 Judge Decision Counts:", result.recordset);
      res.status(200).json(result.recordset);
    } catch (error) {
      console.error("❌ Error fetching judge decision counts:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  });
  
  
  // Endpoint pentru a doua interogare(4)
  app.post("/cases/decision-counts", async (req, res) => {
    try {
      const result = await sql.query(`
        SELECT 
          P.ID_Proces AS case_id,
          COUNT(D.ID_Decizie) AS decision_count
        FROM Evidenta_proceselor_la_tribunal.dbo.Procese P
        INNER JOIN Evidenta_proceselor_la_tribunal.dbo.Decizii D 
        ON P.ID_Proces = D.ID_Proces
        GROUP BY P.ID_Proces
      `);
  
      res.status(200).json(result.recordset);
    } catch (error) {
      console.error("❌ Error fetching case decision counts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  

  // Endpoint pentru filtrarea părților
app.post("/defendants/filter", async (req, res) => {
    const { type } = req.body;
  
    try {
      let query = `
        SELECT 
          ID_Parte AS id, 
          Tip_parte AS party_type, 
          Nume AS name, 
          Prenume AS surname, 
          Varsta AS age, 
          Sex AS gender
        FROM Evidenta_proceselor_la_tribunal.dbo.Parti`;
  
      if (type !== "All") {
        query += ` WHERE Tip_parte = '${type}'`;
      }
  
      const result = await sql.query(query);
      res.status(200).json(result.recordset);
    } catch (error) {
      console.error("❌ Error filtering defendants:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  });
  

  //Interogare simpla 5 -- afisarea detaliilor despre partile implicate in procese
  app.post("/cases/defendant-details", async (req, res) => {
    try {
      console.log("📌 Received request for cases with defendant details");
  
      const result = await sql.query`
        SELECT 
          P.Nr_Dosar AS case_number,
          PA.Nume AS defendant_name,
          PA.Prenume AS defendant_surname,
          PA.Tip_parte AS party_type
        FROM 
          Evidenta_proceselor_la_tribunal.dbo.Procese P
        JOIN 
          Evidenta_proceselor_la_tribunal.dbo.ProcesPartiAvocati PPA ON P.ID_Proces = PPA.ID_Proces
        JOIN 
          Evidenta_proceselor_la_tribunal.dbo.Parti PA ON PPA.ID_Parte = PA.ID_Parte
        ORDER BY 
          P.Nr_Dosar`;
  
      console.log("📌 Cases with defendant details:", result.recordset);
      res.status(200).json(result.recordset);
    } catch (error) {
      console.error("❌ Error fetching cases with defendant details:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  });


  // Endpoint pentru numărul de procese ale părților -- Interogare simpla 6
app.post("/defendants/case-counts", async (req, res) => {
    try {
        console.log("📌 Fetching case counts for defendants...");
        
        const query = `
            SELECT 
                P.Nume AS defendant_name,
                P.Prenume AS defendant_surname,
                COUNT(DISTINCT PA.ID_Proces) AS total_cases
            FROM Evidenta_proceselor_la_tribunal.dbo.Parti P
            JOIN Evidenta_proceselor_la_tribunal.dbo.ProcesPartiAvocati PA
            ON P.ID_Parte = PA.ID_Parte
            GROUP BY P.Nume, P.Prenume
            ORDER BY total_cases DESC;
        `;

        const result = await sql.query(query);
        console.log("📌 Case counts fetched successfully:", result.recordset);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("❌ Error fetching case counts for defendants:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

  
  
// Endpoint pentru judecătorii cu cele mai multe procese penale și cel puțin 2 decizii finale(COMPLEXE_1)
//cel putin 2 decizii cu sentinta definitiva si sa sortam in ordine descrescatoare in functie de cate procese penale are judecatorul
app.post("/statistics/top-judges-complex", async (req, res) => {
    try {
        console.log("📌 Fetching top judges with complex criteria...");

        const query = `
            SELECT 
                J.Nume AS judge_name,
                J.Prenume AS judge_surname,
                COUNT(DISTINCT P.ID_Proces) AS criminal_cases_count
            FROM Evidenta_proceselor_la_tribunal.dbo.Judecatori J
            INNER JOIN Evidenta_proceselor_la_tribunal.dbo.Procese P
            ON J.ID_Judecator = P.ID_Judecator
            WHERE P.Tip_Proces = 'Penal' 
            AND J.ID_Judecator IN (
                SELECT ID_Judecator
                FROM Evidenta_proceselor_la_tribunal.dbo.Decizii
                WHERE Tip_Decizie = 'Sentinta definitiva'
                GROUP BY ID_Judecator
                HAVING COUNT(ID_Decizie) >= 2
            )
            GROUP BY J.Nume, J.Prenume
            ORDER BY criminal_cases_count DESC;
        `;

        const result = await sql.query(query);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("❌ Error fetching top judges with complex criteria:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

//Care sunt procesele unde reclamantul are cel mai mare onorariu plătit avocatului(reclamantul sa plateasca mai mult decat paratul), împreună cu detalii despre judecător?
//Complexe 2
app.post("/statistics/highest-fee-claimants", async (req, res) => {
    try {
        const result = await sql.query(`
            SELECT 
                P.Nr_Dosar AS case_number,
                PA.Nume AS claimant_name,
                PA.Prenume AS claimant_surname,
                PPA.Onorariu AS highest_fee,
                J.Nume AS judge_name,
                J.Prenume AS judge_surname
            FROM Evidenta_proceselor_la_tribunal.dbo.Procese P
            INNER JOIN Evidenta_proceselor_la_tribunal.dbo.ProcesPartiAvocati PPA
                ON P.ID_Proces = PPA.ID_Proces
            INNER JOIN Evidenta_proceselor_la_tribunal.dbo.Parti PA
                ON PPA.ID_Parte = PA.ID_Parte
            INNER JOIN Evidenta_proceselor_la_tribunal.dbo.Judecatori J
                ON P.ID_Judecator = J.ID_Judecator
            WHERE PA.Tip_parte = 'Reclamant'
              AND PPA.Onorariu = (
                  SELECT MAX(Onorariu)
                  FROM Evidenta_proceselor_la_tribunal.dbo.ProcesPartiAvocati PPA_Sub
                  WHERE P.ID_Proces = PPA_Sub.ID_Proces
              )
            ORDER BY PPA.Onorariu DESC; -- Filtrare descrescătoare după Onorariu
        `);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("❌ Error fetching highest fee claimants:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



// Top avocați cu cele mai mari încasări totale
app.post("/statistics/top-lawyers-fees", async (req, res) => {
    try {
        const result = await sql.query(`
            SELECT 
                A.Nume AS lawyer_name,
                A.Prenume AS lawyer_surname,
                (
                    SELECT SUM(PPA.Onorariu)
                    FROM Evidenta_proceselor_la_tribunal.dbo.ProcesPartiAvocati PPA
                    WHERE PPA.ID_Avocat = A.ID_Avocat
                ) AS total_fees
            FROM Evidenta_proceselor_la_tribunal.dbo.Avocati A
            WHERE (
                SELECT SUM(PPA.Onorariu)
                FROM Evidenta_proceselor_la_tribunal.dbo.ProcesPartiAvocati PPA
                WHERE PPA.ID_Avocat = A.ID_Avocat
            ) IS NOT NULL
            ORDER BY total_fees DESC;
        `);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("❌ Error fetching top lawyers' fees:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Endpoint pentru procesele finalizate cu cele mai multe decizii
//Identificăm procesele care sunt finalizate (Status = 'Finalizat') și au cele mai multe decizii luate.
app.post("/statistics/completed-processes-most-decisions", async (req, res) => {
    try {
        const result = await sql.query(`
            SELECT 
                P.Nr_Dosar AS case_number,
                J.Nume AS judge_name,
                J.Prenume AS judge_surname,
                COUNT(D.ID_Decizie) AS decisions_count
            FROM Evidenta_proceselor_la_tribunal.dbo.Procese P
            INNER JOIN Evidenta_proceselor_la_tribunal.dbo.Decizii D
                ON P.ID_Proces = D.ID_Proces
            INNER JOIN Evidenta_proceselor_la_tribunal.dbo.Judecatori J
                ON P.ID_Judecator = J.ID_Judecator
            WHERE P.Status = 'Finalizat'
            GROUP BY P.Nr_Dosar, J.Nume, J.Prenume
            HAVING COUNT(D.ID_Decizie) >= (
                SELECT MAX(Decizii_Count) 
                FROM (
                    SELECT COUNT(ID_Decizie) AS Decizii_Count
                    FROM Evidenta_proceselor_la_tribunal.dbo.Decizii D
                    INNER JOIN Evidenta_proceselor_la_tribunal.dbo.Procese P
                        ON D.ID_Proces = P.ID_Proces
                    WHERE P.Status = 'Finalizat'
                    GROUP BY P.ID_Proces
                ) AS SubQuery
            )
            ORDER BY decisions_count DESC;
        `);

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("❌ Error fetching completed processes with most decisions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


const port = 3000;
app.listen(port, () => {
    console.log(`Serverul rulează la adresa http://localhost:${port}`);
});
