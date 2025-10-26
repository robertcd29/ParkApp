import psycopg2

#MODIFICĂ ASTEA:
DARIA_IP = "192.168.56.1"      # IP-ul Dariei
DARIA_PASSWORD = "d"    # Parola PostgreSQL a Dariei

try:
    print(f" Încerc să mă conectez la {DARIA_IP}...")
    
    conn = psycopg2.connect(
        dbname="smart_parking",
        user="postgres",
        password="d",
        host="192.168.56.1",
        port="5432"
    )
    
    print("✅ CONECTAT CU SUCCES la baza Dariei!")
    
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM parking_spots;")
    count = cur.fetchone()[0]
    print(f"📊 Găsite {count} locuri de parcare în baza de date")
    
    cur.execute("SELECT * FROM parking_spots LIMIT 3;")
    rows = cur.fetchall()
    print("\n Primele 3 locații:")
    for row in rows:
        print(f"  - {row}")
    
    cur.close()
    conn.close()
    
except psycopg2.OperationalError as e:
    print(f" NU MĂ POT CONECTA!")
    print(f"Eroare: {e}")
    print("\n💡 Verifică:")
    print("  1. IP-ul Dariei e corect?")
    print("  2. Sunteți în aceeași rețea WiFi?")
    print("  3. Daria a configurat postgresql.conf și pg_hba.conf?")
    print("  4. Daria a restartat PostgreSQL?")
    print("  5. Parola e corectă?")
    
except Exception as e:
    print(f" Altă eroare: {e}")


